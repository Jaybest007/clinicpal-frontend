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
    externalOrder,
    submitExternalOrder,
    orderResult,
  } = useDashboard();

  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);
  const [viewType, setViewType] = useState("internal"); // "internal" or "external"
  const [modalOpen, setModalOpen] = useState(false);
  const [orderResultModal, setOrderResultModal] = useState(false);
  const [orderResultsValue, setOrderResultsValue] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
    fetchLaboratoryData();
    fetchExternalOrder();
  }, [fetchLaboratoryData, fetchExternalOrder]);

  // Open order details modal
  const openModal = (order: LabOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Close order details modal
  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
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
        {/* Header and controls */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 rounded-t-xl shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold text-blue-900">Laboratory Orders</h1>
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-4 w-full md:w-auto mt-3 md:mt-0">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="text-sm px-3 py-2 border rounded shadow text-gray-700 bg-white w-full xs:w-auto focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="internal">Internal Orders</option>
              <option value="external">External Orders</option>
            </select>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-semibold w-full xs:w-auto transition"
            >
              + New Order
            </button>
            <button
              onClick={() => {
                fetchLaboratoryData();
                fetchExternalOrder();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition w-full xs:w-auto"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading...
                </span>
              ) : "Refresh"}
            </button>
          </div>
        </div>

        {/* Internal Orders View */}
        {viewType === "internal" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <StatCard icon={RiFileList3Fill} title="Total Orders" value={labData.length} />
              <StatCard icon={MdOutlinePendingActions} title="Pending" value={labData.filter(order => order.status === "pending").length} />
              <StatCard icon={AiOutlineFileDone} title="Processing" value={labData.filter(order => order.status === "processing").length} />
              <StatCard icon={BiTask} title="Completed" value={labData.filter(order => order.status === "completed").length} />
              <StatCard icon={BiTaskX} title="Cancelled" value={labData.filter(order => order.status === "cancelled").length} />
            </div>

            {/* Orders Table */}
            <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto relative mt-4">
              {/* Loading overlay */}
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
                    <th className="px-4 py-3 text-left">D/T</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Patient ID</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Sent by</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labData.filter(order => order.status === "pending" || order.status === "processing").length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-gray-500 py-6 text-center">No orders found.</td>
                    </tr>
                  ) : (
                    labData
                      .filter(order => order.status === "pending" || order.status === "processing")
                      .map(order => (
                        <tr className="hover:bg-blue-50 transition border-b border-gray-200" key={order.id}>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 border">{order.full_name?.toUpperCase()}</td>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{order.patient_id?.toUpperCase()}</td>
                          <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>{order.order_data}</td>
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
                              onClick={() => openModal(order)}
                              title="View Order Details"
                              disabled={loading}
                              >
                              View
                              </button>
                              {order.status === "processing" && (
                              <button
                                className="flex-1 min-w-[80px] sm:min-w-[110px] bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs sm:text-sm px-2 py-1 rounded transition flex items-center justify-center gap-1"
                                onClick={() => {
                                setSelectedOrder(order);
                                setOrderResultModal(true);
                                }}
                                title="Add/View Results"
                                disabled={loading}
                              >
                                <RiFileList3Fill className="inline-block text-base sm:text-lg" /> Results
                              </button>
                              )}
                              {order.status === "pending" && (
                              <button
                                className="flex-1 min-w-[80px] sm:min-w-[110px] bg-yellow-600 hover:bg-yellow-500 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                                onClick={() => setConfirmModal({ order, type: "processing" })}
                                title="Mark as Processing"
                                disabled={loading}
                              >
                                Process
                              </button>
                              )}
                              {order.status === "processing" && (
                              <button
                                className="flex-1 min-w-[80px] sm:min-w-[110px] bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                                onClick={() => setConfirmModal({ order, type: "completed" })}
                                title="Mark as Completed"
                                disabled={loading}
                              >
                                Complete
                              </button>
                              )}
                              <button
                              className="flex-1 min-w-[80px] sm:min-w-[100px] bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded transition"
                              onClick={() => setConfirmModal({ order, type: "cancelled" })}
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

        {/* External Orders View */}
        {viewType === "external" && (
          <div>
            {/* Stat card for external orders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <StatCard
                icon={RiFileList3Fill}
                title="Total Orders"
                value={externalOrder.filter(order => order.order_type === "lab").length}
              />
            </div>
            {/* External orders table */}
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
                    <th className="px-4 py-3 text-left">NA</th>
                    <th className="px-4 py-3 text-left">D/T</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Order details</th>
                    <th className="px-4 py-3 text-left">Sent by</th>
                  </tr>
                </thead>
                <tbody>
                  {externalOrder.filter(order => order.order_type === "lab").length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-gray-500 py-6 text-center">No orders found.</td>
                    </tr>
                  ) : (
                    externalOrder
                      .filter(order => order.order_type === "lab")
                      .map((order, index) => (
                        <tr className="hover:bg-blue-50 transition border-b border-gray-200" key={order.id}>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{index + 1}</td>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_on).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 border">{order.name?.toUpperCase()}</td>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{order.order_type}</td>
                          <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>{order.order_data}</td>
                          <td className="px-4 py-3 text-gray-700 border">{order.hospital}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
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

      {/* Confirmation Modal for actions */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Confirm Action</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to <strong>{confirmModal.type}</strong> <strong>{confirmModal.order.full_name}</strong>'s order?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition"
                onClick={() => setConfirmModal(null)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                onClick={handleActionConfirm}
              >
                Yes
              </button>
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
                  disabled={resultLoading}
                >
                  {resultLoading ? (
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
