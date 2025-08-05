import { useEffect, useState } from "react";
import { MdOutlineInventory, MdMedication, MdHistory } from "react-icons/md";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/DashboardContext";
import { BiTask, BiTaskX, BiCheckCircle } from "react-icons/bi";
import { DepartmentsReport } from "../components/DepartmentsReport";
import { FiLoader, FiRefreshCw,  FiCheck, FiX, FiSearch } from "react-icons/fi";
import { ViewOrderDetail } from "../components/ViewOrderDetail";
import { motion, AnimatePresence } from "framer-motion";

type PharmacyOrder = {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  requested_by: string;
};

type OrderStatus = "all" | "pending" | "completed" | "cancelled";

export const Pharmacy = () => {
  const { pharmacyData, fetchPharmacyData, loading, updatePharmacyOrderStatus } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [orderData, setOrderData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("pending");
  const [confirmModal, setConfirmModal] = useState<null | {
    type: "complete" | "cancelled";
    patient_id: string;
    full_name: string;
    id: string;
  }>(null);

  useEffect(() => {
    document.title = "Pharmacy Management - ClinicPal";
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

  // Stats calculation
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
  
  // Calculate trends based on 24-hour window (simplified example)
  const pendingOrdersTrend = pendingOrders > 0 ? Math.min(Math.round(pendingOrders / Math.max(totalOrders, 1) * 100), 100) : 0;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  // Filter function for orders
  const filteredOrders = pharmacyData.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_data.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-20 md:px-6 pb-6 space-y-4">
        {/* Header with Tabs */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <MdMedication className="text-blue-600 w-6 h-6 mr-2" />
              <h1 className="text-lg md:text-xl font-semibold text-blue-900">Pharmacy Management</h1>
            </div>
            <div className="mt-3 md:mt-0 flex flex-wrap w-full md:w-auto gap-2">
              <button
                onClick={fetchPharmacyData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="mr-2" />
                    Refresh
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setOrderHistory(!orderHistory);
                  setOrderData(!orderData);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center ${
                  orderHistory 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <MdHistory className="mr-2" />
                {orderHistory ? "Current Orders" : "Order History"}
              </button>
            </div>
          </div>
          
          {!orderHistory && (
            <div className="flex overflow-x-auto bg-gray-50 border-t border-gray-200">
              <button 
                className={`px-4 py-2 text-sm font-medium ${statusFilter === "pending" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${statusFilter === "completed" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${statusFilter === "cancelled" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setStatusFilter("cancelled")}
              >
                Cancelled
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${statusFilter === "all" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setStatusFilter("all")}
              >
                All Orders
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {orderData && (
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-2 min-w-max px-1">
              <StatCard 
                icon={MdOutlineInventory} 
                title="Total Orders" 
                value={totalOrders}
                subtitle="Today"
                variant="primary" 
                trend={{ value: 0, isUpGood: true }}
              />
              <StatCard 
                icon={BiTask} 
                title="Pending" 
                value={pendingOrders}
                subtitle="Need attention"
                variant="warning" 
                trend={{ value: pendingOrdersTrend, isUpGood: false }}
              />
              <StatCard 
                icon={BiCheckCircle} 
                title="Completed" 
                value={completedOrders}
                subtitle="Today"
                variant="success" 
                trend={{ value: completionRate, isUpGood: true }}
              />
              <StatCard 
                icon={BiTaskX} 
                title="Cancelled" 
                value={cancelledOrders}
                subtitle="Today"
                variant="danger" 
                trend={{ value: 0, isUpGood: true }}
              />
            </div>
          </div>
        )}

        {/* Search bar - Only show when viewing orders */}
        {orderData && !orderHistory && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, ID or medication..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Order Table or Order History */}
        <AnimatePresence mode="wait">
          {orderData && !orderHistory && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden"
            >
              {/* Loading state */}
              {loading && (
                <div className="p-6 text-center">
                  <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                    <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <p className="text-blue-600 text-lg font-medium">Loading pharmacy orders...</p>
                  <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the latest data</p>
                </div>
              )}

              {/* Empty state */}
              {!loading && filteredOrders.length === 0 && (
                <div className="p-8 text-center">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <MdMedication className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchTerm 
                      ? `No results found for "${searchTerm}". Try using different keywords or clear the search.`
                      : statusFilter !== "all" 
                        ? `There are no ${statusFilter} orders at the moment.` 
                        : "There are no pharmacy orders at the moment."}
                  </p>
                </div>
              )}

              {/* Data table */}
              {!loading && filteredOrders.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 w-12">#</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-4 py-3">Medication</th>
                        <th className="px-4 py-3 w-24">Status</th>
                        <th className="px-4 py-3">Ordered By</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrders.map((order, index) => (
                        <tr 
                          key={order.id}
                          className="hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => openModal(order)}
                        >
                          <td className="px-4 py-3.5 font-mono text-xs text-blue-700">{index + 1}</td>
                          <td className="px-4 py-3.5 text-gray-700">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-gray-900">{order.full_name}</div>
                            <div className="text-xs text-gray-500">ID: {order.patient_id}</div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-700">
                            <div className="max-w-xs truncate" title={order.order_data}>
                              {order.order_data}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled" 
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status === "completed" && <FiCheck className="mr-1 w-3 h-3" />}
                              {order.status === "cancelled" && <FiX className="mr-1 w-3 h-3" />}
                              {order.status === "pending" && <FiLoader className="mr-1 w-3 h-3" />}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-700">{order.requested_by}</td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(order);
                                }}
                              >
                                <FiSearch className="mr-1 w-3 h-3" />
                                View
                              </button>

                              {order.status === "pending" && (
                                <>
                                  <button
                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmModal({
                                        type: "cancelled",
                                        patient_id: order.patient_id,
                                        full_name: order.full_name,
                                        id: order.id,
                                      });
                                    }}
                                  >
                                    <FiX className="mr-1 w-3 h-3" />
                                    Cancel
                                  </button>

                                  <button
                                    className="bg-green-100 text-green-700 hover:bg-green-200 px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmModal({
                                        type: "complete",
                                        patient_id: order.patient_id,
                                        full_name: order.full_name,
                                        id: order.id,
                                      });
                                    }}
                                  >
                                    <FiCheck className="mr-1 w-3 h-3" />
                                    Complete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>
          )}

          {orderHistory && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="transition-all duration-300"
            >
              <DepartmentsReport department="pharmacy" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <ViewOrderDetail open={showModal} order={selectedOrder} onClose={closeModal} />
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className={`py-4 px-5 ${confirmModal.type === "complete" ? "bg-green-50" : "bg-red-50"}`}>
              <h2 className={`text-lg font-semibold ${confirmModal.type === "complete" ? "text-green-800" : "text-red-800"}`}>
                {confirmModal.type === "complete" ? "Complete Order" : "Cancel Order"}
              </h2>
            </div>
            
            <div className="p-5">
              <div className="mb-5">
                <div className="text-sm text-gray-600 mb-1">Patient</div>
                <div className="font-medium">{confirmModal.full_name}</div>
                <div className="text-xs text-gray-500">ID: {confirmModal.patient_id}</div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to mark this order as <strong>{confirmModal.type}</strong>? 
                {confirmModal.type === "complete" 
                  ? " This will indicate that all medications have been dispensed."
                  : " This will cancel the order and notify the requesting provider."}
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 ${
                    confirmModal.type === "complete" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-red-600 hover:bg-red-700"
                  } text-white rounded-lg transition-colors text-sm font-medium flex items-center`}
                  onClick={handleActionConfirm}
                >
                  {confirmModal.type === "complete" ? (
                    <>
                      <FiCheck className="mr-1.5" />
                      Complete Order
                    </>
                  ) : (
                    <>
                      <FiX className="mr-1.5" />
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
