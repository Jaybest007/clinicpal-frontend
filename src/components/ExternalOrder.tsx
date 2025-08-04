import React from "react";
import { RiFileList3Fill } from "react-icons/ri";
import StatCard from "./StatCard";
import { useDashboard } from "../context/DashboardContext";

type ExternalOrderProps = {
  loading: boolean;
  orderType: "lab" | "pharmacy" | "ultrasound" | "xray";
};

export const ExternalOrder: React.FC<ExternalOrderProps> = ({
  loading,
  orderType,
}) => {
  const { externalOrder } = useDashboard();

  // Filter data based on orderType
  const filteredOrders = externalOrder.filter(order => order.order_type === orderType);

  return (
    <div className="space-y-4">
      {/* Stat card for external orders */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max px-1">
          <StatCard
            icon={RiFileList3Fill}
            title="Total Orders"
            value={filteredOrders.length}
          />
        </div>
      </div>
      {/* External orders table */}
      <section className="bg-white rounded-xl shadow border border-slate-200 p-2 md:p-4 overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 backdrop-blur-sm">
            <span className="text-blue-600 flex items-center gap-2 font-semibold">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Loading...
            </span>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm transition-all duration-300">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-2 py-2 md:px-3 md:py-2 text-left">No</th>
              <th className="px-2 py-2 md:px-3 md:py-2 text-left">Date</th>
              <th className="px-2 py-2 md:px-3 md:py-2 text-left">Name</th>
              <th className="px-2 py-2 md:px-3 md:py-2 text-left">Type</th>
              <th className="px-2 py-2 md:px-3 md:py-2 text-left">Order details</th>
              <th className="px-2 py-2 md:px-3 md:py-2 text-left">Sent by</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-gray-500 py-6 text-center">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200" key={order.id}>
                  <td className="px-2 py-2 md:px-3 md:py-2 font-mono text-blue-700 border">{index + 1}</td>
                  <td className="px-2 py-2 md:px-3 md:py-2 font-mono text-blue-700 border">{new Date(order.created_on).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className="px-2 py-2 md:px-3 md:py-2 font-medium text-gray-900 border">{order.name?.toUpperCase()}</td>
                  <td className="px-2 py-2 md:px-3 md:py-2 font-mono text-blue-700 border">{order.order_type}</td>
                  <td className="px-2 py-2 md:px-3 md:py-2 text-gray-700 border truncate max-w-[120px] md:max-w-[200px]" title={order.order_data}>{order.order_data}</td>
                  <td className="px-2 py-2 md:px-3 md:py-2 text-gray-700 border">{order.hospital}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};