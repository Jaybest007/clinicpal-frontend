import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { MdOutlineInventory } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import OrderForm from "../components/OrderForm";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "../components/OrderModal";
import { FaTimes } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import {ExternalOrder} from "../components/ExternalOrder";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { FiLoader, FiRefreshCcw } from "react-icons/fi";

interface ultrasound_order {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  result: string;
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
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 rounded-t-xl shadow-sm mb-6">
          <h1 className="text-lg md:text-xl font-semibold text-blue-900">Ultrasound Orders</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto mt-3 md:mt-0">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="text-sm px-2.5 py-1.5 border border-slate-300 rounded-md shadow-sm text-gray-700 bg-white w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-300"
              disabled={orderHistory}
            >
              <option value="internal">Internal Orders</option>
              <option value="external">External Orders</option>
            </select>
            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-medium w-full sm:w-auto transition duration-150 border border-blue-300"
              disabled={orderHistory}
              >
              + New
              </button>
              <button
              onClick={() => {
                fetchUltrasoundData();
                fetchExternalOrder();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-medium w-full sm:w-auto transition duration-150 border border-blue-300"
              disabled={loading || orderHistory}
              >
                {loading ? (
                <>
                  <FiLoader className="inline mr-1 mb-1 animate-spin" />
                  Loading...
                </>
                ) : (
                <>
                  <FiRefreshCcw className="inline mr-1 " />
                  Refresh
                </>
                )}
              </button>
              <button
              onClick={() => setOrderHistory(!orderHistory)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition duration-150 w-full sm:w-auto ${
                orderHistory ? "bg-blue-500 hover:bg-blue-400" : "bg-blue-600 hover:bg-blue-500"
              } text-white`}
              >
              {orderHistory ? "Hide History" : "Show History"}
              </button>
            </div>
            </div>
        </div>

        {orderHistory ? (
          <div className="transition-all duration-300">
            <DepartmentsReport department={"ultrasound"} />
          </div>
        ) : (
          <>
            {/* INTERNAL ORDER VIEW */}
            {viewType === "internal" && (
              <>
                <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-7">
                  <StatCard icon={MdOutlineInventory} title="Total Orders" value={ultrasoundData.length} />
                  <StatCard icon={BiTask} title="Pending Orders" value={ultrasoundData.filter(order => order.status === "pending").length} />
                  <StatCard icon={BiTask} title="Processing Orders" value={ultrasoundData.filter(order => order.status === "processing").length} />
                  <StatCard icon={BiTask} title="Completed Orders" value={ultrasoundData.filter(order => order.status === "completed").length} />
                  <StatCard icon={FaTimes} title="Canceled Orders" value={ultrasoundData.filter(order => order.status === "cancelled").length} />
                </div>

                <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto relative">
                  {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                      <span className="text-blue-600 flex items-center gap-2 font-semibold">
                        <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Loading...
                      </span>
                    </div>
                  )}

                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-left border">#</th>
                        <th className="px-4 py-3 text-left border">D/T</th>
                        <th className="px-4 py-3 text-left border">Name</th>
                        <th className="px-4 py-3 text-left border">Patient ID</th>
                        <th className="px-4 py-3 text-left border">Order</th>
                        <th className="px-4 py-3 text-left border">Status</th>
                        <th className="px-4 py-3 text-left border">Sent by</th>
                        <th className="px-4 py-3 text-left border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultrasoundData.filter(order => order.status === "pending" || order.status === "processing").length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-gray-500 py-6 text-center">No orders found.</td>
                        </tr>
                      ) : (
                        ultrasoundData
                          .filter(order => order.status === "pending" || order.status === "processing")
                          .map((order, index) => (
                            <tr key={order.id}
                              onClick={() => openModal(order)}
                              className="hover:bg-blue-50 transition border-b border-gray-200">
                              <td className="px-4 py-3 font-mono text-blue-700 border">{index + 1}</td>
                              <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_at).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</td>
                              <td className="px-4 py-3 font-medium text-gray-900 border">{order.full_name}</td>
                              <td className="px-4 py-3 font-medium text-gray-900 border">{order.patient_id.toUpperCase()}</td>
                              <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]">{order.order_data}</td>
                              <td className="px-4 py-3 border">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "processing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {order.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-700 border">{order.requested_by}</td>
                              <td className="px-4 py-3 border-r">
                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-start items-center">
                                  <button
                                    className="flex-1 min-w-[80px] sm:min-w-[90px] text-white bg-blue-600 hover:bg-blue-800 text-xs sm:text-sm px-2 py-1 rounded transition"
                                    onClick={e => { e.stopPropagation(); openModal(order); }}
                                    title="View Order Details"
                                    disabled={loading}
                                  >
                                    View
                                  </button>
                                  {order.status === "processing" && (
                                    <button
                                      className="flex-1 min-w-[80px] sm:min-w-[110px] bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs sm:text-sm px-2 py-1 rounded transition flex items-center justify-center gap-1"
                                      onClick={e => { e.stopPropagation(); setSelectedOrder(order); setOrderResultModal(true); }}
                                      title="Add/View Results"
                                      disabled={loading}
                                    >
                                      <RiFileList3Fill className="inline-block text-base sm:text-lg" /> Results
                                    </button>
                                  )}
                                  {order.status === "pending" && (
                                    <button
                                      className="flex-1 min-w-[80px] sm:min-w-[110px] bg-yellow-600 hover:bg-yellow-500 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                                      onClick={e => { e.stopPropagation(); setConfirmModal({ order, type: "processing" }); }}
                                      title="Mark as Processing"
                                      disabled={loading}
                                    >
                                      Process
                                    </button>
                                  )}
                                  {order.status === "processing" && (
                                    <button
                                      className="flex-1 min-w-[80px] sm:min-w-[110px] bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                                      onClick={e => { e.stopPropagation(); setConfirmModal({ order, type: "completed" }); }}
                                      title="Mark as Completed"
                                      disabled={loading}
                                    >
                                      Complete
                                    </button>
                                  )}
                                  <button
                                    className="flex-1 min-w-[80px] sm:min-w-[100px] bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                                    onClick={e => { e.stopPropagation(); setConfirmModal({ order, type: "cancelled" }); }}
                                    title="Cancel Order"
                                    disabled={loading}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </section>
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
                await submitExternalOrder({
                  full_name: data.full_name,
                  age: data.age,
                  order_type: data.order_type,
                  order_data: data.description,
                  sent_by: data.sent_by
                });
              }}
            />
            {/* order detail modal */}
            {showModal && selectedOrder && (
              <OrderModal onClose={closeModal}>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-blue-900 border-b pb-2 mb-2 flex items-center gap-2">
                    <RiFileList3Fill className="text-blue-500 text-2xl" />
                    Order Details
                  </h2>
                  <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    <li>
                      <span className="font-semibold text-gray-700">Date:</span>
                      <span className="ml-2 font-mono text-blue-700">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">Patient:</span>
                      <span className="ml-2">{selectedOrder.full_name.toUpperCase()}</span>
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">Patient ID:</span>
                      <span className="ml-2 font-mono text-blue-700">{selectedOrder.patient_id.toUpperCase()}</span>
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedOrder.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : selectedOrder.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedOrder.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </li>
                    <li className="sm:col-span-2">
                      <span className="font-semibold text-gray-700">Requested By:</span>
                      <span className="ml-2">{selectedOrder.requested_by}</span>
                    </li>
                  </ul>
                  <div className="mt-2 bg-slate-50 border border-slate-200 p-4 rounded-lg shadow-inner">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                      {selectedOrder.order_data || <span className="italic text-gray-400">No order details available.</span>}
                    </p>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </OrderModal>
            )}
            {/* Confirmation modal */}
            {confirmModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Confirm Action</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                    Are you sure you want to <strong>{confirmModal.type}</strong> <strong>{confirmModal.order.full_name}</strong>'s order?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition" onClick={() => setConfirmModal(null)}>No</button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition" onClick={handleActionConfirm}>Yes</button>
                  </div>
                </div>
              </div>
            )}

            {/* Result form modal */}
            {orderResultModal && selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Enter Order Results</h3>
                  <form onSubmit={handleOrderResultSubmit}>
                    <textarea
                      name="orderResults"
                      className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none mb-4"
                      placeholder="Enter order results..."
                      value={orderResultsValue}
                      onChange={e => setOrderResultsValue(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                        onClick={() => {
                          setOrderResultModal(false);
                          setOrderResultsValue("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Saving...
                          </span>
                        ) : "Save Results"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
