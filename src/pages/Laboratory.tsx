import { useState, useEffect } from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "../components/OrderModal";
import { BiTask, BiTaskX } from "react-icons/bi";
import { AiOutlineFileDone } from "react-icons/ai";
import { RiFileList3Fill } from "react-icons/ri";
import OrderForm from "../components/OrderForm";
import { useAuth } from "../context/AuthContext";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { ExternalOrder } from "../components/ExternalOrder";

import { InternalOrder } from "../components/InternalOrder";
import { OrderResult } from "../components/OrderResult";
import { OrderHeaderControls } from "../components/OrderHeaderControls";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { ViewOrderDetail } from "../components/ViewOrderDetail";

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
  const { user } = useAuth();

  // Add these two state hooks:
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <OrderHeaderControls
          department="Laboratory"
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
          <div className="transition-all duration-300">
            <DepartmentsReport department={"lab"} />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            {!orderHistory && viewType === "internal" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <StatCard icon={RiFileList3Fill} title="Total Orders" value={labData.length} />
                <StatCard icon={MdOutlinePendingActions} title="Pending" value={labData.filter(order => order.status === "pending").length} />
                <StatCard icon={AiOutlineFileDone} title="Processing" value={labData.filter(order => order.status === "processing").length} />
                <StatCard icon={BiTask} title="Completed" value={labData.filter(order => order.status === "completed").length} />
                <StatCard icon={BiTaskX} title="Cancelled" value={labData.filter(order => order.status === "cancelled").length} />
              </div>
            )}

            {/* Internal Orders Table */}
            {viewType === "internal" && (
              <InternalOrder
                loading={loading}
                orders={labData}
                openModal={openModal}
                setSelectedOrder={setSelectedOrder}
                setConfirmModal={setConfirmModal}
                setOrderResultModal={setOrderResultModal}
                setOrderResultsValue={setOrderResultsValue}
              />
            )}

            {/* External Orders View */}
            {viewType === "external" && (
              <ExternalOrder loading={loading} orderType="lab" />
            )}
          </>
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
          await submitExternalOrder({
            full_name: data.full_name,
            age: data.age,
            order_type: data.order_type,
            order_data: data.description,
            sent_by: data.sent_by,
          });
          setModalOpen(false);
        }}
      />
    </div>
  );
};
