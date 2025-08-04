import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { MdOutlineInventory } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import OrderForm from "../components/OrderForm";
import { useDashboard } from "../context/DashboardContext";

import { FaTimes } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import {ExternalOrder} from "../components/ExternalOrder";
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
  const { ultrasoundData, fetchUltrasoundData, loading, updateUltrasoundOrderStatus, submitExternalOrder, 
         fetchExternalOrder, orderResult } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState<ultrasound_order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ order: ultrasound_order; type: string } | null>(null);
  const [viewType, setViewType] = useState("internal");
  const [orderResultModal, setOrderResultModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [orderResultsValue, setOrderResultsValue] = useState("");
  const { user } = useAuth();

  useEffect(() => {
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
    await updateUltrasoundOrderStatus({
      id: order.id,
      status: type,
      updated_at: new Date().toISOString(),
    });
    setConfirmModal(null);
  };

  useEffect(() => {
    document.title = "Ultrasound - ClinicPal App";
  }, []);

  const handleOrderResultSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOrder) return;
    if (!orderResultsValue.trim()) {
      return;
    }
    await orderResult({
      id: selectedOrder.id,
      wrote_by: user?.name ?? "",
      patient_id: selectedOrder.patient_id,
      orderResults: orderResultsValue,
    });
    fetchUltrasoundData(); 
    setOrderResultModal(false);
    setOrderResultsValue("");
  };

  useEffect(() => {
    if (orderResultModal && selectedOrder) {
      setOrderResultsValue(selectedOrder.result || "");
    }
  }, [orderResultModal, selectedOrder]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">

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
          <div className="transition-all duration-300">
            <DepartmentsReport department={"ultrasound"} />
          </div>
        ) : (
            <>
            {/* INTERNAL ORDER VIEW */}
            {viewType === "internal" && (
              <>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 min-w-max">
                  <StatCard icon={MdOutlineInventory} title="Total Orders" value={ultrasoundData.length} />
                  <StatCard icon={BiTask} title="Pending Orders" value={ultrasoundData.filter(order => order.status === "pending").length} />
                  <StatCard icon={BiTask} title="Processing Orders" value={ultrasoundData.filter(order => order.status === "processing").length} />
                  <StatCard icon={BiTask} title="Completed Orders" value={ultrasoundData.filter(order => order.status === "completed").length} />
                  <StatCard icon={FaTimes} title="Canceled Orders" value={ultrasoundData.filter(order => order.status === "cancelled").length} />
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
            {/* order detail modal */}
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
                loading={loading}
                onChange={setOrderResultsValue}
                onClose={() => {
                  setOrderResultModal(false);
                  setOrderResultsValue("");
                }}
                onSubmit={handleOrderResultSubmit}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
