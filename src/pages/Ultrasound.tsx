import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { MdOutlineInventory, MdOutlinePendingActions } from "react-icons/md";
import { BiTask, BiTaskX } from "react-icons/bi";
import { AiOutlineFileDone } from "react-icons/ai";
import OrderForm from "../components/OrderForm";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import { ExternalOrder } from "../components/ExternalOrder";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { InternalOrder } from "../components/InternalOrder";
import { OrderResult } from "../components/OrderResult";
import { OrderHeaderControls } from "../components/OrderHeaderControls";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { ViewOrderDetail } from "../components/ViewOrderDetail";

interface ultrasound_order {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  result?: string;
  requested_by: string;
}

export const Ultrasound = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { 
    ultrasoundData, 
    fetchUltrasoundData, 
    loading, 
    updateUltrasoundOrderStatus, 
    submitExternalOrder, 
    fetchExternalOrder, 
    orderResult 
  } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState<ultrasound_order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ order: ultrasound_order; type: string } | null>(null);
  const [viewType, setViewType] = useState("internal");
  const [orderResultModal, setOrderResultModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [orderResultsValue, setOrderResultsValue] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Ultrasound - ClinicPal App";
    fetchUltrasoundData();
    fetchExternalOrder();
  }, [fetchUltrasoundData, fetchExternalOrder]);

  const openModal = (order: ultrasound_order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleActionConfirm = async () => {
    if (!confirmModal) return;
    const { order, type } = confirmModal;
    const newStatus = type === "complete" || type === "completed" ? "completed" : type;
    await updateUltrasoundOrderStatus({
      id: order.id,
      status: newStatus,
      updated_at: new Date().toISOString(),
    });
    setConfirmModal(null);
    fetchUltrasoundData(); // Fetch fresh data after update
  };

  const handleOrderResultSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOrder) return;
    if (!orderResultsValue.trim()) {
      return;
    }
    setResultLoading(true);
    await orderResult({
      id: selectedOrder.id,
      wrote_by: user?.name ?? "",
      patient_id: selectedOrder.patient_id,
      orderResults: orderResultsValue,
    });
    fetchUltrasoundData(); 
    setOrderResultModal(false);
    setOrderResultsValue("");
    setResultLoading(false);
  };

  useEffect(() => {
    if (orderResultModal && selectedOrder) {
      setOrderResultsValue(selectedOrder.result || "");
    }
  }, [orderResultModal, selectedOrder]);

  // Calculate stats for trend indicators
  const pendingOrders = ultrasoundData.filter(order => order.status === "pending").length;
  const processingOrders = ultrasoundData.filter(order => order.status === "processing").length;
  const completedOrders = ultrasoundData.filter(order => order.status === "completed").length;
  const cancelledOrders = ultrasoundData.filter(order => order.status === "cancelled").length;
  
  const pendingTrend = pendingOrders > 0 ? Math.min(Math.round(pendingOrders / Math.max(ultrasoundData.length, 1) * 100), 100) : 0;
  const processingTrend = processingOrders > 0 ? Math.min(Math.round(processingOrders / Math.max(ultrasoundData.length, 1) * 100), 100) : 0;
  const completionRate = ultrasoundData.length > 0 ? Math.round((completedOrders / ultrasoundData.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-20 md:px-8 pb-6 space-y-4">
        <OrderHeaderControls
          department="ultrasound"
          viewType={viewType}
          setViewType={setViewType}
          loading={loading}
          orderHistory={orderHistory}
          setOrderHistory={setOrderHistory}
          setModalOpen={setModalOpen}
          fetchDepartmentData={fetchUltrasoundData}
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
              <DepartmentsReport department={"ultrasound"} />
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
              {/* INTERNAL ORDER VIEW */}
              {viewType === "internal" && (
                <>
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-3 min-w-max">
                      <StatCard 
                        icon={MdOutlineInventory} 
                        title="Total Orders" 
                        value={ultrasoundData.length}
                        subtitle="All ultrasound orders"
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
                    orders={ultrasoundData}
                    openModal={openModal}
                    setSelectedOrder={setSelectedOrder}
                    setConfirmModal={setConfirmModal}
                    setOrderResultModal={setOrderResultModal}
                    setOrderResultsValue={setOrderResultsValue}
                    loading={loading}
                  />
                </>
              )}

              {/* EXTERNAL ORDER VIEW */}
              {viewType === "external" && (
                <ExternalOrder loading={loading} orderType="ultrasound" />
              )}
            </motion.div>
          </AnimatePresence>
        )}

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
        
        {/* Order detail modal */}
        {showModal && selectedOrder && (
          <ViewOrderDetail open={showModal} order={selectedOrder} onClose={closeModal} />
        )}

        {/* Confirmation modal */}
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
      </main>
    </div>
  );
};
