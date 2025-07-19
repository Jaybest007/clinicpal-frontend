import { useState, useEffect } from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "../components/OrderModal";
import { BiTask, BiTaskX } from "react-icons/bi";
import { AiOutlineFileDone } from "react-icons/ai";
import { RiFileList3Fill } from "react-icons/ri";

interface LabOrder {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: any;
  requested_by: string;
}

interface ConfirmModalState {
  type: string;
  order: LabOrder;
}

export const Laboratory = () => {
  const { fetchLaboratoryData, loading, labData, updateLaboratoryOrderStatus, fetchExternalOrder, externalOrder } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);
  const [viewType, setViewType] = useState("internal"); // or "external"

  useEffect(() => {
    fetchLaboratoryData();
    fetchExternalOrder();
  }, [fetchLaboratoryData, fetchExternalOrder]);

  const openModal = (order: LabOrder) => {
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
    const newStatus = type === "complete" ? "completed" : "cancelled";

    await updateLaboratoryOrderStatus({
      id: order.id,
      status: newStatus,
      updated_at: new Date().toISOString()
    });

    setConfirmModal(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 rounded-t-xl shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold text-blue-900">Laboratory Orders</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewType("internal")}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition border ${viewType === "internal" ? "bg-blue-600 text-white" : "bg-white text-blue-700 border-blue-200"}`}
            >
              Internal Orders
            </button>
            <button
              onClick={() => setViewType("external")}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition border ${viewType === "external" ? "bg-blue-600 text-white" : "bg-white text-blue-700 border-blue-200"}`}
            >
              External Orders
            </button>
          </div>

          <div className="mt-3 md:mt-0 flex w-full md:w-auto gap-2">
            <button
              onClick={() => {
                fetchLaboratoryData();
                fetchExternalOrder();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tabs for switching views */}
        

        {viewType === "internal" && (
          <>
            <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <StatCard icon={RiFileList3Fill} title="Total Orders" value={labData.length} />
              <StatCard icon={MdOutlinePendingActions} title="Pending Orders" value={labData.filter(order => order.status === "pending").length} />
              <StatCard icon={AiOutlineFileDone} title="Processing Orders" value={labData.filter(order => order.status === "processing").length} />
              <StatCard icon={BiTask} title="Completed" value={labData.filter(order => order.status === "completed").length} />
              <StatCard icon={BiTaskX} title="Cancelled" value={labData.filter(order => order.status === "cancelled").length} />
            </div>

            <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto">
              {loading && (
                <div className="text-blue-600 animate-pulse text-sm mb-4">Fetching latest orders from server...</div>
              )}

              {!loading && labData.length > 0 && (
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
                    {!loading && labData.filter(order => order.status === "pending" || order.status === "processing").length === 0 && (
                      <td colSpan={7} className="text-gray-500 py-6 text-center">No orders found.</td>
                    )}
                    {labData
                      .filter(order => order.status === "pending" || order.status === "processing")
                      .map(order => (
                        <tr className="hover:bg-blue-50 transition border-b border-gray-200" key={order.id}>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 border">{order.full_name?.toUpperCase()}</td>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{order.patient_id?.toUpperCase()}</td>
                          <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>{order.order_data}</td>
                          <td className="px-4 py-3 border">
                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status.toUpperCase()}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 border">{order.requested_by}</td>
                          <td className="px-4 py-3 flex flex-col md:flex-row gap-2 border-r">
                            <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white text-xs font-medium" onClick={() => openModal(order)}>View</button>
                            <button className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-sm" onClick={() => setConfirmModal({ order, type: "cancelled" })}>Cancel</button>
                            {order.status === "pending" && (
                              <button className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1.5 rounded text-white text-xs font-medium" onClick={async () => await updateLaboratoryOrderStatus({ id: order.id, status: "processing", updated_at: new Date().toISOString() })}>Process Order</button>
                            )}
                            {order.status === "processing" && (
                              <button className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded text-white text-xs font-medium" onClick={() => setConfirmModal({ order, type: "complete" })}>Complete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}

        {viewType === "external" && (
          <div className="bg-neutral-100 p-4 rounded-lg">
            <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              <StatCard icon={RiFileList3Fill} title="Total Orders" value={externalOrder.filter(order => order.order_type === "lab").length} />
            </div>

            <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto">
              {loading && <div className="text-blue-600 animate-pulse text-sm mb-4">Fetching latest orders from server...</div>}
              {!loading && externalOrder.filter(order => order.order_type === "lab").length > 0 && (
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
                    {!loading && externalOrder.filter(order => order.order_type === "lab").length === 0 && (
                      <td colSpan={7} className="text-gray-500 py-6 text-center">No orders found.</td>
                    )}
                    {externalOrder.filter(order => order.order_type === "lab").map((order, index) => (
                      <tr className="hover:bg-blue-50 transition border-b border-gray-200" key={order.id}>
                        <td className="px-4 py-3 font-mono text-blue-700 border">{index + 1}</td>
                        <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_on).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 border">{order.name?.toUpperCase()}</td>
                        <td className="px-4 py-3 font-mono text-blue-700 border">{order.order_type}</td>
                        <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>{order.order_data}</td>
                        <td className="px-4 py-3 text-gray-700 border">{order.hospital}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}
      </main>

      {showModal && selectedOrder && (
        <OrderModal onClose={closeModal}>
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Order Details</h2>
          <ul className="text-sm space-y-2">
            <li><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</li>
            <li><strong>Patient:</strong> {selectedOrder.full_name.toUpperCase()}</li>
            <li><strong>Patient ID:</strong> {selectedOrder.patient_id.toUpperCase()}</li>
            <li><strong>Status:</strong> {selectedOrder.status}</li>
            <li><strong>Requested By:</strong> {selectedOrder.requested_by}</li>
          </ul>
          <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded">
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {selectedOrder.order_data || "No order details available."}
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm" onClick={closeModal}>Close</button>
          </div>
        </OrderModal>
      )}

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
    </div>
  );
};
