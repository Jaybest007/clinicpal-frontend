import React, { useState } from "react";
import { RiFileList3Fill, RiHospitalLine } from "react-icons/ri";
import { FiSearch, FiFilter, FiCalendar, FiUser, FiFileText } from "react-icons/fi";
import StatCard from "./StatCard";
import { useDashboard } from "../context/DashboardContext";
import { MdOutlineDocumentScanner } from "react-icons/md";

type ExternalOrderProps = {
  loading: boolean;
  orderType: "lab" | "pharmacy" | "ultrasound" | "xray";
};

export const ExternalOrder: React.FC<ExternalOrderProps> = ({
  loading,
  orderType,
}) => {
  const { externalOrder } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on orderType and search term
  const filteredOrders = externalOrder
    .filter(order => order.order_type === orderType)
    .filter(order => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.name?.toLowerCase() || "").includes(searchLower) ||
        (order.order_data?.toLowerCase() || "").includes(searchLower) ||
        (order.hospital?.toLowerCase() || "").includes(searchLower)
      );
    });

  // Format date for better readability
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

  // Get display title for order type
  const getOrderTypeTitle = () => {
    switch(orderType) {
      case "lab": return "Laboratory";
      case "xray": return "X-Ray";
      case "ultrasound": return "Ultrasound";
      case "pharmacy": return "Pharmacy";
      default: return String(orderType).charAt(0).toUpperCase() + String(orderType).slice(1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="flex items-center text-xl font-bold text-gray-800">
            <RiHospitalLine className="mr-2 text-blue-600" />
            External {getOrderTypeTitle()} Orders
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage test requests from other facilities
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stat card for external orders */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          <StatCard
            icon={RiFileList3Fill}
            title="Total External Orders"
            value={filteredOrders.length}
            subtitle={`From other facilities`}
            variant="primary"
            trend={{ value: 0, isUpGood: true }}
          />
        </div>
      </div>

      {/* External orders table */}
      <section className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="text-center">
              <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
                <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <p className="text-blue-700 font-medium">Loading external orders...</p>
            </div>
          </div>
        )}

        {!loading && filteredOrders.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="bg-gray-100 mx-auto rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <MdOutlineDocumentScanner className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No external orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm 
                ? `No results matching "${searchTerm}". Try different search terms.`
                : `There are no external ${orderType} orders at the moment.`
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      Date
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiUser className="mr-1" />
                      Patient
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    <div className="flex items-center">
                      <FiFilter className="mr-1" />
                      Type
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiFileText className="mr-1" />
                      Details
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center">
                      <RiHospitalLine className="mr-1" />
                      Facility
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr className="hover:bg-blue-50 transition-colors duration-200" key={order.id}>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-blue-700 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                      {formatDate(order.created_on)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.name?.toUpperCase() || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        Type: {order.order_type}
                      </div>
                      <div className="text-xs text-gray-500 md:hidden">
                        From: {order.hospital}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {order.order_type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      <div className="line-clamp-2 max-w-[160px] md:max-w-[300px]" title={order.order_data}>
                        {order.order_data}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {order.hospital}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};