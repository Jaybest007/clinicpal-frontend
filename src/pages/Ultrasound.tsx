import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { MdOutlineInventory } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import OrderForm from "../components/OrderForm";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "../components/OrderModal";
import { FaTimes } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";

interface ultrasound_order {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  requested_by: string;
}

export const Ultrasound = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { ultrasoundData, fetchUltrasoundData, loading, updateUltrasoundOrderStatus, submitExternalOrder, externalOrder, fetchLaboratoryData, fetchExternalOrder } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState<ultrasound_order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ order: ultrasound_order; type: string } | null>(null);
  const [viewType, setViewType] = useState("internal");
  console.log(externalOrder)
  useEffect(() => {
    fetchUltrasoundData();
  }, [fetchUltrasoundData]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-8 py-4 rounded-t-xl shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Ultrasound</h1>
          <div className="flex items-center gap-4">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="text-sm px-4 py-2 border rounded shadow text-gray-700 bg-white"
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow text-sm font-semibold"
            >
              + New Order
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

        {viewType === "internal" && (
          <>
            <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-7">
              <StatCard icon={MdOutlineInventory} title="Total Orders" value={ultrasoundData.length} />
              <StatCard icon={BiTask} title="Pending Orders" value={ultrasoundData.filter(order => order.status === "pending").length} />
              <StatCard icon={BiTask} title="Processing Orders" value={ultrasoundData.filter(order => order.status === "processing").length} />
              <StatCard icon={BiTask} title="Completed Orders" value={ultrasoundData.filter(order => order.status === "completed").length} />
              <StatCard icon={FaTimes} title="Canceled Orders" value={ultrasoundData.filter(order => order.status === "cancelled").length} />
            </div>

            <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
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
                  {!loading && ultrasoundData.filter(order => order.status === "pending" || order.status === "processing").length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-gray-500 py-6 text-center">No orders found.</td>
                    </tr>
                  )}
                  {ultrasoundData.filter(order => order.status === "pending" || order.status === "processing").map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50 transition border-b border-gray-200">
                      <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_at).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 border">{order.full_name}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 border">{order.patient_id.toUpperCase()}</td>
                      <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]">{order.order_data}</td>
                      <td className="px-4 py-3 font-medium text-yellow-600 border">{order.status.toUpperCase()}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 border">{order.requested_by}</td>
                      <td className="px-4 py-3 border">
                        <button className="text-white bg-blue-600 hover:bg-blue-800 text-sm px-2 py-1 rounded" onClick={() => openModal(order)}>
                          View
                        </button>
                        <button className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-sm ml-2" onClick={() => setConfirmModal({ order, type: "cancelled" })}>
                          Cancel
                        </button>
                        {order.status === "pending" && (
                          <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm ml-2" onClick={() => setConfirmModal({ order, type: "processing" })}>
                            Process
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-sm ml-2" onClick={() => setConfirmModal({ order, type: "completed" })}>
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {viewType === "external" && (
          <div className="bg-yellow-50 text-yellow-800 p-6 border border-yellow-300 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold mb-2">External Orders View</h2>
            <div className="p-4 rounded-lg">
              <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                <StatCard icon={RiFileList3Fill} title="Total Orders" value={externalOrder.filter(order => order.order_type === "ultrasound").length} />
              </div>

              <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto">
                {loading && <div className="text-blue-600 animate-pulse text-sm mb-4">Fetching latest orders from server...</div>}
                {!loading && externalOrder.filter(order => order.order_type === "ultrasound").length > 0 && (
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
                      {externalOrder.filter(order => order.order_type === "ultrasound").map((order, index) => (
                        <tr className="hover:bg-blue-50 transition border-b border-gray-200" key={order.id}>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{index + 1}</td>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_on).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 border">{order.name?.toUpperCase()}</td>
                          <td className="px-4 py-3 font-mono text-blue-700 border">{order.order_type}</td>
                          <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>{order.order_data}</td>
                          <td className="px-4 py-3 text-gray-700 border">{order.hospital}</td>
                        </tr>
                      ))}
                      {!loading && externalOrder.filter(order => order.order_type === "ultrasound").length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-gray-500 py-6 text-center">No orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </section>
            </div>
          </div>
        )}
        <OrderForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={async(data) => {
            await submitExternalOrder({
              full_name: data.full_name,
              age: data.age,
              order_type: data.order_type,
              order_data: data.description,
              sent_by: data.sent_by
            });
          }}
        />

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
      </main>
    </div>
  );
};
