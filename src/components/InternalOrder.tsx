import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye,  FiCheckSquare, FiX, FiActivity, FiClock, FiFileText, FiMenu } from "react-icons/fi";
import { MdOutlineScience, MdOutlinePendingActions } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";

interface Order {
  id: string;
  created_at: string;
  full_name: string;
  patient_id: string;
  order_data: string;
  status: string;
  result?: string;
  requested_by: string;
}

interface InternalOrderProps {
  loading: boolean;
  orders: Order[];
  openModal: (order: Order) => void;
  setSelectedOrder: (order: Order) => void;
  setConfirmModal: (state: { order: Order; type: string }) => void;
  setOrderResultModal: (open: boolean) => void;
  setOrderResultsValue: (value: string) => void;
}

export function InternalOrder({
  loading,
  orders,
  openModal,
  setSelectedOrder,
  setConfirmModal,
  setOrderResultModal,
  setOrderResultsValue,
}: InternalOrderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // active, all, pending, processing, completed

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_data.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = ["pending", "processing"].includes(order.status);
    } else if (statusFilter !== "all") {
      matchesStatus = order.status === statusFilter;
    }
    
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
    <div className="space-y-4 mt-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="flex items-center text-xl font-bold text-gray-800">
            <MdOutlineScience className="mr-2 text-blue-600" size={24} />
            Internal Orders
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage test requests and view results for in-house patients
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search patient, ID or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto -mx-1 px-1 pb-1">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              statusFilter === "active" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiActivity className="mr-1.5" />
              Active Orders
            </div>
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === "pending" 
                ? "bg-yellow-500 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border-y border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <MdOutlinePendingActions className="mr-1.5" />
              Pending
            </div>
          </button>
          <button
            onClick={() => setStatusFilter("processing")}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === "processing" 
                ? "bg-blue-500 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border-y border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiClock className="mr-1.5" />
              Processing
            </div>
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === "completed" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border-y border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <AiOutlineFileDone className="mr-1.5" />
              Completed
            </div>
          </button>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              statusFilter === "all" 
                ? "bg-gray-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            All Orders
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-blue-700 font-medium">Loading orders...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && filteredOrders.length === 0 && (
          <div className="py-12 px-6 text-center">
            <div className="bg-gray-100 mx-auto rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <MdOutlineScience className="text-gray-400" size={36} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm 
                ? `No results matching "${searchTerm}". Try a different search term.`
                : statusFilter === "active" 
                  ? "There are no active orders at the moment."
                  : statusFilter === "all"
                    ? "There are no laboratory orders in the system."
                    : `No orders with status "${statusFilter}" found.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                    Date/Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px]">
                    Test Order
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => openModal(order)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <div className="font-mono text-blue-700">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.full_name}</div>
                      <div className="text-xs text-gray-500">ID: {order.patient_id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="line-clamp-2 max-w-[200px]" title={order.order_data}>
                        {order.order_data}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status === "completed" && <FiCheckSquare className="mr-1" />}
                        {order.status === "cancelled" && <FiX className="mr-1" />}
                        {order.status === "processing" && <FiActivity className="mr-1" />}
                        {order.status === "pending" && <FiClock className="mr-1" />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.requested_by}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      {/* Desktop view: show all buttons */}
                      <div className="hidden md:flex justify-end space-x-2">
                        <button
                          className="inline-flex items-center px-2 py-1 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xs transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(order);
                          }}
                          title="View details"
                        >
                          <FiEye className="mr-1" />
                          View
                        </button>

                        {order.status === "processing" && (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-purple-300 text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-xs transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              setOrderResultModal(true);
                              setOrderResultsValue(order.result || "");
                            }}
                            title="Enter test results"
                          >
                            <FiFileText className="mr-1" />
                            Results
                          </button>
                        )}

                        {order.status === "pending" && (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xs transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmModal({ order, type: "processing" });
                            }}
                            title="Start processing this order"
                          >
                            <FiActivity className="mr-1" />
                            Process
                          </button>
                        )}

                        {order.status === "processing" && (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-green-300 text-green-700 bg-green-50 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-xs transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmModal({ order, type: "completed" });
                            }}
                            title="Mark as completed"
                          >
                            <FiCheckSquare className="mr-1" />
                            Complete
                          </button>
                        )}

                        {(order.status === "pending" || order.status === "processing") && (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-xs transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmModal({ order, type: "cancelled" });
                            }}
                            title="Cancel this order"
                          >
                            <FiX className="mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Mobile view: show dropdown menu */}
                      <div className="md:hidden">
                        <Menu as="div" className="relative inline-block text-left">
                          <div>
                            <Menu.Button
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                              className="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiMenu className="w-4 h-4" />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={React.Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }: { active: boolean }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex items-center px-4 py-2 text-sm w-full text-left`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openModal(order);
                                      }}
                                    >
                                      <FiEye className="mr-3 h-4 w-4" aria-hidden="true" />
                                      View Details
                                    </button>
                                  )}
                                </Menu.Item>

                                {order.status === "processing" && (
                                  <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                      <button
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } flex items-center px-4 py-2 text-sm w-full text-left`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedOrder(order);
                                          setOrderResultModal(true);
                                          setOrderResultsValue(order.result || "");
                                        }}
                                      >
                                        <FiFileText className="mr-3 h-4 w-4" aria-hidden="true" />
                                        Enter Results
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}

                                {order.status === "pending" && (
                                  <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                      <button
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } flex items-center px-4 py-2 text-sm w-full text-left`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmModal({ order, type: "processing" });
                                        }}
                                      >
                                        <FiActivity className="mr-3 h-4 w-4" aria-hidden="true" />
                                        Process Order
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}

                                {order.status === "processing" && (
                                  <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                      <button
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } flex items-center px-4 py-2 text-sm w-full text-left`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmModal({ order, type: "completed" });
                                        }}
                                      >
                                        <FiCheckSquare className="mr-3 h-4 w-4" aria-hidden="true" />
                                        Complete Order
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}

                                {(order.status === "pending" || order.status === "processing") && (
                                  <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                      <button
                                        className={`${
                                          active ? 'bg-gray-100 text-red-600' : 'text-red-600'
                                        } flex items-center px-4 py-2 text-sm w-full text-left`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmModal({ order, type: "cancelled" });
                                        }}
                                      >
                                        <FiX className="mr-3 h-4 w-4" aria-hidden="true" />
                                        Cancel Order
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
