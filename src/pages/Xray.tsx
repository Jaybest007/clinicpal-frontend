import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { OrderHeaderControls } from "../components/OrderHeaderControls";
import { useDashboard } from "../context/DashboardContext";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { InternalOrder } from "../components/InternalOrder";
import { ExternalOrder } from "../components/ExternalOrder";
import StatCard from "../components/StatCard";
import { MdOutlineInventory } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { OrderResult } from "../components/OrderResult";

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
  useEffect(() => {
    document.title = "X-Ray - ClinicPal App";
  }, []);

  const {
    loading,
    fetchExternalOrder,
    fetchXrayData,
    updateUltrasoundOrderStatus, 
    submitExternalOrder,
    xrayData,
  } = useDashboard();

  const [viewType, setViewType] = useState<"internal" | "external">("internal");
  const [orderHistory, setOrderHistory] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: string;
    order: Order;
  } | null>(null);
  const [orderResultModal, setOrderResultModal] = useState(false);
  const [orderResultsValue, setOrderResultsValue] = useState<string>("");

  const openModal = (order?: Order) => {
    if (order) setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderResultSubmit = () => {
    // Submit order result logic goes here
    setOrderResultModal(false);
    setOrderResultsValue("");
  };

  const handleActionConfirm = async () => {
    if (!confirmModal) return;
    const { order, type } = confirmModal;

    try {
      await updateUltrasoundOrderStatus({
        id: order.id,
        status: type,
        updated_at: new Date().toISOString(),
      }); // Assuming this function exists
      await fetchXrayData();
      setConfirmModal(null);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
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
          <div className="transition-all duration-300">
            <DepartmentsReport department="xray" />
          </div>
        ) : (
          <>
            {viewType === "internal" && (
              <>
                <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-7">
                  <StatCard icon={MdOutlineInventory} title="Total Orders" value={xrayData.length} />
                  <StatCard icon={BiTask} title="Pending Orders" value={xrayData.filter(order => order.status === "pending").length} />
                  <StatCard icon={BiTask} title="Processing Orders" value={xrayData.filter(order => order.status === "processing").length} />
                  <StatCard icon={BiTask} title="Completed Orders" value={xrayData.filter(order => order.status === "completed").length} />
                  <StatCard icon={FaTimes} title="Canceled Orders" value={xrayData.filter(order => order.status === "cancelled").length} />
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
          </>
        )}

        {/* View Order Modal */}
        {modalOpen && selectedOrder && (
          <ViewOrderDetail open={modalOpen} order={selectedOrder} onClose={closeModal} />  
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
              } 
              }}
        />

        {/* Result Modal */}
        {orderResultModal && selectedOrder && (
          <OrderResult
            open={orderResultModal && !!selectedOrder}
            value={orderResultsValue}
            loading={loading}
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
