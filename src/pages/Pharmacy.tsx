import { useEffect, useState } from "react";
import { MdOutlineInventory } from "react-icons/md";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "../components/OrderModal"; //  Corrected component import
import { BiTask, BiTaskX } from "react-icons/bi";
import { DepartmentsReport } from "../components/DepartmentsReport";

type PharmacyOrder = {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  requested_by: string;
};

export const Pharmacy = () => {
  const { pharmacyData, fetchPharmacyData, loading, updatePharmacyOrderStatus } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [orderData, setOrderData] = useState(true);
  const [confirmModal, setConfirmModal] = useState<null | {
    type: "complete" | "cancelled";
    patient_id: string;
    full_name: string;
    id: string;
  }>(null);

  useEffect(() => {
    fetchPharmacyData();
  }, [fetchPharmacyData]);

  const openModal = (order: PharmacyOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleActionConfirm = async () => {
  if (!confirmModal) return;

  await updatePharmacyOrderStatus({
    id: confirmModal.id,
    status: confirmModal.type === "complete" ? "completed" : "cancelled",
    updated_at: new Date().toISOString(),
  });

  setConfirmModal(null);
  fetchPharmacyData(); // Refresh after update
};


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 rounded-t-xl shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold text-blue-900">Pharmacy Orders</h1>

          <div className="mt-3 md:mt-0 flex w-full md:w-auto gap-2">
            
            <button
              onClick={fetchPharmacyData}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium transition"
              disabled={loading}
            >
              {loading ? 
              <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
              </span>
              : "Refresh"}
            </button>

            <button
              onClick={() => {
              setOrderHistory(!orderHistory);
              setOrderData(orderData ? false : true);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${orderHistory ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              {orderHistory ? " Go Back" : "Order History"}
            </button>
          </div>
        </div>

        {/* Stats */}
        {/* Stats for today's orders only */}
        {orderData && (
          <>
            <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 transition-all duration-300">
              {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isToday = (dateStr: string) => {
            const date = new Date(dateStr);
            return date >= today && date < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          };
          const todaysOrders = pharmacyData.filter(order => isToday(order.created_at));
          return (
            <>
              <StatCard icon={MdOutlineInventory} title="Total Orders" value={todaysOrders.length} />
              <StatCard icon={BiTask} title="Pending Orders" value={todaysOrders.filter(order => order.status === "pending").length} />
              <StatCard icon={BiTask} title="Completed" value={todaysOrders.filter(order => order.status === "completed").length} />
              <StatCard icon={BiTaskX} title="Cancelled" value={todaysOrders.filter(order => order.status === "cancelled").length} />
            </>
          );
              })()}
            </div>

            {/* Order Table */}
            <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto transition-all duration-300">
              {loading && (
          <div className="text-blue-600 animate-pulse text-sm mb-4 transition-opacity duration-300">Fetching latest orders from server...</div>
              )}

              {!loading && pharmacyData.length === 0 && (
          <div className="text-gray-500 py-6 text-center transition-opacity duration-300">No orders found.</div>
              )}

              {!loading && pharmacyData.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 text-sm transition-all duration-300">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Patient ID</th>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Sent by</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading && pharmacyData.filter(order => order.status === "pending" || order.status === "processing").length === 0 && (
                <td colSpan={7} className="text-gray-500 py-6 text-center transition-opacity duration-300">No orders found.</td>
              )}

              {pharmacyData.filter(order => order.status === "pending").map((order, index) => (
                <tr className="hover:bg-blue-50 transition-colors duration-300 border-b border-gray-200"
            key={order.id}
            onClick={() => openModal(order)}
                >
            <td className="px-4 py-3 font-mono text-blue-700 border">{index + 1}</td>
            <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_at).toLocaleString()}</td>
            <td className="px-4 py-3 font-medium text-gray-900 border">{order.full_name?.toUpperCase()}</td>
            <td className="px-4 py-3 font-mono text-blue-700 border">{order.patient_id?.toUpperCase()}</td>
            <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>
              {order.order_data}
            </td>
            <td className="px-4 py-3 border">
              <span className={`px-2 py-1 text-xs rounded-full ${
                order.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } transition-colors duration-300`}>
                {order.status.toUpperCase()}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-700 border">{order.requested_by}</td>
            <td className="px-4 py-3 flex flex-col md:flex-row gap-2 border-r">
              <button
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white text-xs font-medium transition-colors duration-300"
                onClick={() => openModal(order)}
              >
                View
              </button>

              <button
                className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-sm transition-colors duration-300"
                onClick={() =>
                  setConfirmModal({
              type: "cancelled",
              patient_id: order.patient_id,
              full_name: order.full_name,
              id: order.id,
                  })
                }
              >
                Cancel
              </button>

              <button
                className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded text-white text-xs font-medium transition-colors duration-300"
                onClick={() => setConfirmModal({
                  type: "complete",
                  patient_id: order.patient_id,
                  full_name: order.full_name,
                  id: order.id
                })}
              >
                Complete
              </button>
            </td>
                </tr>
              ))}
            </tbody>
          </table>
              )}
            </section>
          </>
        )}

        {orderHistory && <div className="transition-all duration-300">
          <DepartmentsReport department={"pharmacy"} />
        </div>}
      </main>

      {/* Modal */}
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
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </OrderModal>
      )}

      {/* 🔒 Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Confirm Action</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to <strong>{confirmModal.type}</strong> <strong>{confirmModal.full_name}</strong>'s order?
            </p>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition" onClick={() => setConfirmModal(null)}>No</button>
              <button
                className={`px-4 py-2 ${confirmModal.type === "complete" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white rounded transition`}
                onClick={handleActionConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
