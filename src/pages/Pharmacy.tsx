import { useEffect, useState } from "react";
import { MdOutlineInventory } from "react-icons/md";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/DashboardContext";
import { BiTask, BiTaskX } from "react-icons/bi";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { FiLoader, FiRefreshCw } from "react-icons/fi";
import { ViewOrderDetail } from "../components/ViewOrderDetail";

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

  // Stats calculation (fix: always use pharmacyData, not today's only)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    return date >= today && date < new Date(today.getTime() + 24 * 60 * 60 * 1000);
  };
  const todaysOrders = pharmacyData.filter(order => isToday(order.created_at));
  const totalOrders = todaysOrders.length;
  const pendingOrders = todaysOrders.filter(order => order.status === "pending").length;
  const completedOrders = todaysOrders.filter(order => order.status === "completed").length;
  const cancelledOrders = todaysOrders.filter(order => order.status === "cancelled").length;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-6 py-4 space-y-4">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between px-3 py-3 rounded-t-xl shadow-sm">
          <h1 className="text-lg md:text-xl font-semibold text-blue-900">Pharmacy Orders</h1>
          <div className="mt-3 md:mt-0 flex w-full md:w-auto gap-2">
            <button
              onClick={fetchPharmacyData}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium transition"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="inline mr-1 mb-1 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FiRefreshCw className="inline mr-2 mb-1" />
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={() => {
                setOrderHistory(!orderHistory);
                setOrderData(orderData ? false : true);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${orderHistory ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              {orderHistory ? "Go Back" : "Order History"}
            </button>
          </div>
        </div>

        {/* Stats */}
        {orderData && (
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-2 min-w-max px-1">
              <StatCard icon={MdOutlineInventory} title="Total Orders" value={totalOrders} />
              <StatCard icon={BiTask} title="Pending Orders" value={pendingOrders} />
              <StatCard icon={BiTask} title="Completed" value={completedOrders} />
              <StatCard icon={BiTaskX} title="Cancelled" value={cancelledOrders} />
            </div>
          </div>
        )}

        {/* Order Table */}
        {orderData && (
          <section className="overflow-x-auto bg-white shadow-md rounded-xl border border-slate-200 p-2 md:p-4">
            {loading && (
              <div className="text-blue-600 animate-pulse text-sm mb-4 transition-opacity duration-300">Fetching latest orders from server...</div>
            )}

            {!loading && pharmacyData.length === 0 && (
              <div className="text-gray-500 py-6 text-center transition-opacity duration-300">No orders found.</div>
            )}

            {!loading && pharmacyData.length > 0 && (
              <table className="w-full text-xs md:text-sm text-left text-gray-700">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 max-w-[90px] md:max-w-[200px] truncate">Order</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sent by</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && pharmacyData.filter(order => order.status === "pending" || order.status === "processing").length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-gray-500 py-6 text-center transition-opacity duration-300">No orders found.</td>
                    </tr>
                  ) : (
                    pharmacyData.filter(order => order.status === "pending").map((order, index) => (
                      <tr className="odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-all duration-150"
                        key={order.id}
                        onClick={() => openModal(order)}
                      >
                        <td className="px-4 py-3 font-mono text-blue-700">{index + 1}</td>
                        <td className="px-4 py-3 font-mono text-blue-700">{new Date(order.created_at).toLocaleString(undefined, {  timeStyle: 'short' })}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{order.full_name?.toUpperCase()}</td>
                        
                        <td className="px-4 py-3 text-gray-700 truncate max-w-[90px] md:max-w-[200px]" title={order.order_data}>
                          {order.order_data}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          } transition-colors duration-300`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{order.requested_by}</td>
                        <td className="px-2 py-2 md:px-3 md:py-2 border-r">
                          <div className="overflow-x-auto -mx-1">
                            <div className="flex min-w-max gap-2 px-1">
                              {/* 👁 View */}
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(order);
                                }}
                                title="View Order"
                              >
                                View
                              </button>

                              {/* ❌ Cancel */}
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    type: "cancelled",
                                    patient_id: order.patient_id,
                                    full_name: order.full_name,
                                    id: order.id,
                                  });
                                }}
                                title="Cancel Order"
                              >
                                Cancel
                              </button>

                              {/* ✅ Complete */}
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    type: "complete",
                                    patient_id: order.patient_id,
                                    full_name: order.full_name,
                                    id: order.id,
                                  });
                                }}
                                title="Complete Order"
                              >
                                Complete
                              </button>
                            </div>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </section>
        )}

        {orderHistory && <div className="transition-all duration-300">
          <DepartmentsReport department={"pharmacy"} />
        </div>}
      </main>

      {/* Modal */}
      {showModal && selectedOrder && (
        <ViewOrderDetail open={showModal} order={selectedOrder} onClose={closeModal} />
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
