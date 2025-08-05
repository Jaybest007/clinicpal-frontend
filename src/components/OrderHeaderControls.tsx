import React from "react";
import { FiLoader, FiRefreshCw, FiList, FiPlus, FiFilter, FiCalendar, FiX } from "react-icons/fi";
import { MdScience, MdOutlineRadio, MdOutlineOutbound, MdOutlineBedroomParent } from "react-icons/md";

interface OrderHeaderControlsProps {
  department: string; // e.g. "ultrasound", "lab", "xray"
  viewType: string;
  setViewType: (v: "internal" | "external") => void
  loading: boolean;
  orderHistory: boolean;
  setOrderHistory: (v: boolean) => void;
  setModalOpen: (v: boolean) => void;
  fetchDepartmentData: () => void;
  fetchExternalOrder: () => void;
}

export const OrderHeaderControls: React.FC<OrderHeaderControlsProps> = ({
  department,
  viewType,
  setViewType,
  loading,
  orderHistory,
  setOrderHistory,
  setModalOpen,
  fetchDepartmentData,
  fetchExternalOrder,
}) => {
  // Select the appropriate icon based on department
  const getDepartmentIcon = () => {
    switch (department.toLowerCase()) {
      case "lab":
        return <MdScience className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />;
      case "xray":
        return <MdOutlineRadio className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />;
      case "ultrasound":
        return <MdOutlineOutbound className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />;
      case "mortuary":
        return <MdOutlineBedroomParent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />;
      default:
        return <FiList className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />;
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-200 rounded-t-xl shadow-sm overflow-hidden mb-4 sm:mb-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4">
        <div className="flex items-center mb-2 sm:mb-0">
          {getDepartmentIcon()}
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-blue-900 capitalize truncate">
            {department} Management
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Action Buttons */}
          <button
            onClick={() => {
              fetchDepartmentData();
              fetchExternalOrder();
            }}
            className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors min-w-[70px] sm:min-w-0"
            disabled={loading}
            aria-label="Refresh data"
          >
            {loading ? (
              <>
                <FiLoader className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="sm:inline">Loading...</span>
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Refresh</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setOrderHistory(!orderHistory)}
            className={`inline-flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 border text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm transition-colors flex-1 sm:flex-none ${
              orderHistory 
                ? "text-blue-700 bg-blue-100 hover:bg-blue-200 border-blue-200" 
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
            }`}
            aria-label={orderHistory ? "View current orders" : "View order history"}
          >
            {orderHistory ? (
              <>
                <FiX className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Close History</span>
              </>
            ) : (
              <>
                <FiCalendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>History</span>
              </>
            )}
          </button>

          {!orderHistory && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex-1 sm:flex-none"
              aria-label="Create new order"
            >
              <FiPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span>New Order</span>
            </button>
          )}
        </div>
      </div>
      
      {/* View Type Tabs - Only show when not viewing history */}
      {!orderHistory && (
        <div className="flex overflow-x-auto border-t border-gray-200 bg-gray-50 scrollbar-hide">
          <button
            onClick={() => setViewType("internal")}
            className={`flex-1 sm:flex-none py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              viewType === "internal"
                ? "text-blue-700 border-b-2 border-blue-500 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
            }`}
            aria-label="View internal orders"
          >
            Internal Orders
          </button>
          
          <button
            onClick={() => setViewType("external")}
            className={`flex-1 sm:flex-none py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              viewType === "external"
                ? "text-blue-700 border-b-2 border-blue-500 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
            }`}
            aria-label="View external orders"
          >
            External Orders
          </button>
          
          <div className="hidden md:flex items-center ml-auto px-4">
            <FiFilter className="text-gray-400 mr-2" />
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as "internal" | "external")}
              className="text-sm border-0 bg-transparent text-gray-500 focus:ring-0 focus:outline-none cursor-pointer"
              aria-label="Filter order type"
            >
              <option value="internal">Internal Orders</option>
              <option value="external">External Orders</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};