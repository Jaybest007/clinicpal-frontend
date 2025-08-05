import { useState, useEffect } from "react";
import { MdOutlinePendingActions, MdOutlineInventory } from "react-icons/md";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/DashboardContext";
import { motion, AnimatePresence } from "framer-motion";
import { BiTask, BiTaskX } from "react-icons/bi";
import { AiOutlineFileDone } from "react-icons/ai";

import OrderForm from "../components/OrderForm";
import { useAuth } from "../context/AuthContext";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { ExternalOrder } from "../components/ExternalOrder";
// Removed unused FiLoader, FiSearch, FiX, FiClipboard, FiFileText, FiCheck imports
import { InternalOrder } from "../components/InternalOrder"; // Add this import
import { OrderResult } from "../components/OrderResult";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { ViewOrderDetail } from "../components/ViewOrderDetail";
import { OrderHeaderControls } from "../components/OrderHeaderControls";

// Types for lab orders and confirmation modal
interface LabOrder {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  result?: string;
  requested_by: string;
}

interface ConfirmModalState {
  type: string;
  order: LabOrder;
}

export const Laboratory = () => {
  const {
    fetchLaboratoryData,
    loading,
    labData,
    updateLaboratoryOrderStatus,
    fetchExternalOrder,
    submitExternalOrder,
    orderResult,
  } = useDashboard();

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);
  const [viewType, setViewType] = useState("internal"); 
  const [modalOpen, setModalOpen] = useState(false);
  const [orderResultModal, setOrderResultModal] = useState(false);
  const [orderResultsValue, setOrderResultsValue] = useState("");
  const [orderHistory, setOrderHistory] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  // Removed unused searchTerm and setSearchTerm state
  const { user } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = "Laboratory Management - ClinicPal";
    fetchLaboratoryData();
    fetchExternalOrder();
  }, [fetchLaboratoryData, fetchExternalOrder]);

  // Close order details modal
  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  // Handler to open the order details modal
  const openModal = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Handle confirmation for completing/cancelling orders
  const handleActionConfirm = async () => {
    if (!confirmModal) return;
    const { order, type } = confirmModal;
    const newStatus = type === "complete" || type === "completed" ? "completed" : type;
    await updateLaboratoryOrderStatus({
      id: order.id,
      status: newStatus,
      updated_at: new Date().toISOString(),
    });
    setConfirmModal(null);
    fetchLaboratoryData();
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
    await orderResult({
      id: selectedOrder.id,
      patient_id: selectedOrder.patient_id,
      wrote_by: user?.name ?? "",
      orderResults: orderResultsValue,
    });
    fetchLaboratoryData();
    setOrderResultModal(false);
    setOrderResultsValue("");
    setResultLoading(false);
  };

  // Calculate stats for trend indicators
  const pendingOrders = labData.filter(order => order.status === "pending").length;
  const processingOrders = labData.filter(order => order.status === "processing").length;
  const completedOrders = labData.filter(order => order.status === "completed").length;
  const cancelledOrders = labData.filter(order => order.status === "cancelled").length;
  
  const pendingTrend = pendingOrders > 0 ? Math.min(Math.round(pendingOrders / Math.max(labData.length, 1) * 100), 100) : 0;
  const processingTrend = processingOrders > 0 ? Math.min(Math.round(processingOrders / Math.max(labData.length, 1) * 100), 100) : 0;
  const completionRate = labData.length > 0 ? Math.round((completedOrders / labData.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-6 space-y-4">
        <OrderHeaderControls
          department="lab"
          viewType={viewType}
          setViewType={setViewType}
          loading={loading}
          orderHistory={orderHistory}
          setOrderHistory={setOrderHistory}
          setModalOpen={setModalOpen}
          fetchDepartmentData={fetchLaboratoryData}
          fetchExternalOrder={fetchExternalOrder}
        />

        {/* Show only DepartmentsReport if orderHistory is true */}
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
              <DepartmentsReport department={"lab"} />
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
              {/* Internal Orders View */}
              {viewType === "internal" && (
                <>
                  {/* Stat cards */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-3 min-w-max">
                      <StatCard 
                        icon={MdOutlineInventory} 
                        title="Total Orders" 
                        value={labData.length}
                        subtitle="All lab orders"
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

                  {/* Internal Orders Table */}
                  <InternalOrder
                    orders={labData}  // Fixed: using labData instead of ultrasoundData
                    openModal={openModal}
                    setSelectedOrder={setSelectedOrder}
                    setConfirmModal={setConfirmModal}
                    setOrderResultModal={setOrderResultModal}
                    setOrderResultsValue={setOrderResultsValue}
                    loading={loading}
                  />
                </>
              )}
            
              {/* External Orders View */}
              {viewType === "external" && (
                <ExternalOrder loading={loading} orderType="lab" />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <ViewOrderDetail open={showModal} order={selectedOrder} onClose={closeModal} />
      )}

      {/* Confirmation Modal for actions */}
      {confirmModal && (
        <ConfirmActionModal
          open={!!confirmModal}
          order={confirmModal.order}
          type={confirmModal.type}
          onCancel={() => setConfirmModal(null)}
          onConfirm={handleActionConfirm}
        />
      )}

      {/* Result form modal */}
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

      {/* New Order Form Modal */}
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
    </div>
  );
};
