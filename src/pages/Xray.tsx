import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import { OrderHeaderControls } from "../components/OrderHeaderControls";
import { useDashboard } from "../context/DashboardContext";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { InternalOrder } from "../components/InternalOrder";
import { ExternalOrder } from "../components/ExternalOrder";
import StatCard from "../components/StatCard";
import { MdOutlineInventory, MdOutlinePendingActions } from "react-icons/md";
import { BiTask, BiTaskX } from "react-icons/bi";
import { AiOutlineFileDone } from "react-icons/ai";
import { OrderResult } from "../components/OrderResult";
import { useAuth } from "../context/AuthContext";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { ViewOrderDetail } from "../components/ViewOrderDetail";
import OrderForm from "../components/OrderForm";

type Order = {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  status: string;
  requested_by: string;
  order_data: string;
  result?: string;
};

export function Xray() {
  const {
    loading,
    fetchExternalOrder,
    fetchXrayData,
    updateUltrasoundOrderStatus, // Changed from updateUltrasoundOrderStatus to correct function
    submitExternalOrder,
    xrayData,
    orderResult,
  } = useDashboard();

  const [viewType, setViewType] = useState<"internal" | "external">("internal");
  const [orderHistory, setOrderHistory] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: string;
    order: Order;
  } | null>(null);
  const [orderResultModal, setOrderResultModal] = useState(false);
  const [orderResultsValue, setOrderResultsValue] = useState<string>("");
  const [resultLoading, setResultLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "X-Ray - ClinicPal App";
    fetchXrayData();
    fetchExternalOrder();
  }, [fetchXrayData, fetchExternalOrder]);

  // For viewing order details
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Sync orderResultsValue with selectedOrder.result when modal opens
  useEffect(() => {
    if (orderResultModal && selectedOrder) {
      setOrderResultsValue(selectedOrder.result || "");
    }
  }, [orderResultModal, selectedOrder]);

  // Handle result submission
  const handleOrderResultSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOrder) return;
    if (!orderResultsValue.trim()) return;
    
    setResultLoading(true);
    try {
      await orderResult({
        id: selectedOrder.id,
        patient_id: selectedOrder.patient_id,
        wrote_by: user?.name ?? "",
        orderResults: orderResultsValue,
      });
      fetchXrayData();
      setOrderResultModal(false);
      setOrderResultsValue("");
    } catch (error) {
      console.error("Failed to submit results:", error);
    } finally {
      setResultLoading(false);
    }
  };

  const handleActionConfirm = async () => {
    if (!confirmModal) return;
    const { order, type } = confirmModal;
    const newStatus = type === "complete" || type === "completed" ? "completed" : type;

    try {
      await updateUltrasoundOrderStatus({
        id: order.id,
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
      await fetchXrayData();
      setConfirmModal(null);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  // Calculate stats for trend indicators
  const pendingOrders = xrayData.filter(order => order.status === "pending").length;
  const processingOrders = xrayData.filter(order => order.status === "processing").length;
  const completedOrders = xrayData.filter(order => order.status === "completed").length;
  const cancelledOrders = xrayData.filter(order => order.status === "cancelled").length;
  
  const pendingTrend = pendingOrders > 0 ? Math.min(Math.round(pendingOrders / Math.max(xrayData.length, 1) * 100), 100) : 0;
  const processingTrend = processingOrders > 0 ? Math.min(Math.round(processingOrders / Math.max(xrayData.length, 1) * 100), 100) : 0;
  const completionRate = xrayData.length > 0 ? Math.round((completedOrders / xrayData.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-6 space-y-4">
        <OrderHeaderControls
          department="X-ray"
          viewType={viewType}
          setViewType={setViewType}
          loading={loading}
          orderHistory={orderHistory}
          setOrderHistory={setOrderHistory}
          setModalOpen={setModalOpen}
          fetchDepartmentData={fetchXrayData}
          fetchExternalOrder={fetchExternalOrder}
        />

        {orderHistory ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="transition-all duration-300"
            >
              <DepartmentsReport department="xray" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewType === "internal" && (
                <>
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-3 min-w-max">
                      <StatCard 
                        icon={MdOutlineInventory} 
                        title="Total Orders" 
                        value={xrayData.length}
                        subtitle="All X-ray orders"
                        variant="primary" 
                        trend={{ value: 0, isUpGood: true }}
                      />
                      <StatCard 
                        icon={MdOutlinePendingActions} 
                        title="Pending" 
                        value={pendingOrders}
                        subtitle="Need attention"
                        variant="warning" 
                        trend={{ value: pendingTrend, isUpGood: false }}
                      />
                      <StatCard 
                        icon={AiOutlineFileDone} 
                        title="Processing" 
                        value={processingOrders}
                        subtitle="In progress"
                        variant="info" 
                        trend={{ value: processingTrend, isUpGood: false }}
                      />
                      <StatCard 
                        icon={BiTask} 
                        title="Completed" 
                        value={completedOrders}
                        subtitle="All time"
                        variant="success" 
                        trend={{ value: completionRate, isUpGood: true }}
                      />
                      <StatCard 
                        icon={BiTaskX} 
                        title="Cancelled" 
                        value={cancelledOrders}
                        subtitle="All time"
                        variant="danger" 
                        trend={{ value: 0, isUpGood: true }}
                      />
                    </div>
                  </div>

                  <InternalOrder
                    orders={xrayData}
                    openModal={openModal}
                    setSelectedOrder={setSelectedOrder}
                    setConfirmModal={setConfirmModal}
                    setOrderResultModal={setOrderResultModal}
                    setOrderResultsValue={setOrderResultsValue}
                    loading={loading}
                  />
                </>
              )}

              {viewType === "external" && (
                <ExternalOrder loading={loading} orderType="xray" />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View Order Modal */}
        {showModal && selectedOrder && (
          <ViewOrderDetail open={showModal} order={selectedOrder} onClose={closeModal} />  
        )}

        {/* Order form */}
        <OrderForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={async (data) => {
            if (
              data.order_type === "lab" ||
              data.order_type === "xray" ||
              data.order_type === "ultrasound" ||
              data.order_type === "motuary"
            ) {
              await submitExternalOrder({
                full_name: data.full_name,
                age: data.age,
                order_type: data.order_type,
                order_data: data.description,
                sent_by: data.sent_by
              });
              fetchExternalOrder();
              setModalOpen(false);
            } 
          }}
        />

        {/* Result Modal */}
        {orderResultModal && selectedOrder && (
          <OrderResult
            open={orderResultModal && !!selectedOrder}
            value={orderResultsValue}
            loading={resultLoading}
            onChange={setOrderResultsValue}
            onClose={() => {
              setOrderResultModal(false);
              setOrderResultsValue("");
            }}
            onSubmit={handleOrderResultSubmit}
          />
        )}

        {/* Confirmation Modal */}
        {confirmModal && (
          <ConfirmActionModal
            open={!!confirmModal}
            order={confirmModal.order}
            type={confirmModal.type}
            onCancel={() => setConfirmModal(null)}
            onConfirm={handleActionConfirm}
          />
        )}
      </main>
    </div>
  );
}
