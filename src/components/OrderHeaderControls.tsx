import React from "react";
import { FiLoader, FiRefreshCcw } from "react-icons/fi";

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
}) => (
  <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 rounded-t-xl shadow-sm mb-6">
    <h1 className="text-lg md:text-xl font-semibold text-blue-900 capitalize">
      {department} Orders
    </h1>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto mt-3 md:mt-0">
      <select
        value={viewType}
        onChange={(e) => setViewType(e.target.value as "internal" | "external")}
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
            fetchDepartmentData();
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
            orderHistory
              ? "bg-blue-500 hover:bg-blue-400"
              : "bg-blue-600 hover:bg-blue-500"
          } text-white`}
        >
          {orderHistory ? "Hide History" : "Show History"}
        </button>
      </div>
    </div>
  </div>
);