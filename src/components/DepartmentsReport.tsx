import { useState, useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { FiPrinter, FiDownload, FiCalendar, FiFilter, FiSearch, FiBox } from "react-icons/fi";

type DepartmentsReportProps = {
  department?: string;
};

export const DepartmentsReport = ({ department }: DepartmentsReportProps) => {
  const { pharmacyData, labData, ultrasoundData, loading, externalOrder } = useDashboard();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("today");
  const [searchDate, setSearchDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!department) return null;

  // Map department to correct data source - keeping your original logic
  let orders: any[] = [];
  if (department.toLowerCase() === "pharmacy") {
    orders = pharmacyData || [];
  } else if (department.toLowerCase() === "lab") {
    orders = labData || [];
  } else if (department.toLowerCase() === "ultrasound") {
    orders = ultrasoundData || [];
  }

  // Harmonize external orders for this department - keeping your logic
  const externalOrdersForDept = externalOrder
    ? externalOrder.filter(
        (order) =>
          order.order_type &&
          order.order_type.toLowerCase() === department.toLowerCase()
      )
    : [];

  // Normalize internal orders - keeping your logic
  const normalizedInternalOrders = orders.map((order) => ({
    id: order.id || order.order_id || "",
    patient: order.full_name || order.patient_name || order.name || "",
    date: (order.created_at || order.created_on || "").slice(0, 10),
    items: order.items || [order.order_data || order.description || ""],
    status:
      (order.status || "").charAt(0).toUpperCase() +
      (order.status || "").slice(1),
    source: "internal",
  }));

  // Normalize external orders - keeping your logic
  const normalizedExternalOrders = externalOrdersForDept.map((order) => ({
    id: order.id || "",
    patient: order.name ||  "",
    date: (order.created_on || "").slice(0, 10),
    items: [order.order_data || ""],
    status: "External",
    source: "external",
  }));

  // Combine and sort all orders by date - keeping your logic
  const allOrders = useMemo(() => {
    return [...normalizedInternalOrders, ...normalizedExternalOrders].sort((a, b) => {
      const dateA = new Date(a.date.length > 10 ? a.date : a.date + "T00:00:00");
      const dateB = new Date(b.date.length > 10 ? b.date : b.date + "T00:00:00");
      return dateB.getTime() - dateA.getTime();
    });
  }, [normalizedInternalOrders, normalizedExternalOrders]);

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last Week", value: "week" },
    { label: "Last Month", value: "month" },
    { label: "All", value: "all" },
  ];

  // Your original filter function
  function filterOrders(orders: any[], filter: string, searchDate: string, searchTerm: string) {
    const now = new Date();
    let filtered = orders;

    // Date filtering - keeping your logic
    if (searchDate) {
      filtered = filtered.filter((o) => o.date === searchDate);
    } else {
      switch (filter) {
        case "today":
          filtered = filtered.filter(
            (o) => o.date === now.toISOString().slice(0, 10)
          );
          break;
        case "yesterday":
          const yest = new Date(now);
          yest.setDate(now.getDate() - 1);
          filtered = filtered.filter(
            (o) => o.date === yest.toISOString().slice(0, 10)
          );
          break;
        case "week":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          filtered = filtered.filter(
            (o) => o.date >= weekAgo.toISOString().slice(0, 10)
          );
          break;
        case "month":
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(
            (o) => o.date >= monthAgo.toISOString().slice(0, 10)
          );
          break;
        default:
          break;
      }
    }
    
    // Added search term filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        o => 
          o.patient.toLowerCase().includes(term) || 
          o.id.toLowerCase().includes(term) ||
          (Array.isArray(o.items) ? o.items.some((item: string) => item.toLowerCase().includes(term)) : 
            (typeof o.items === 'string' && o.items.toLowerCase().includes(term)))
      );
    }
    
    return filtered;
  }

  // Use sorted orders for filtering - using your logic
  const filteredOrders = useMemo(() => 
    filterOrders(allOrders, filter, searchDate, searchTerm), 
    [allOrders, filter, searchDate, searchTerm]
  );
  
  // Status counts for summary
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [filteredOrders]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
              {department} Order History
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Viewing {filteredOrders.length} orders for the {department} department
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-1.5 transition-colors"
              onClick={() =>
                navigate(`/department-report/print?department=${department}`, {
                  state: { orders: filteredOrders }
                })
              }
            >
              <FiPrinter size={16} />
              <span>Print</span>
            </button>
            <button
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
              onClick={() => {
                // CSV export functionality
                const headers = ["Order ID", "Patient", "Date", "Items", "Status", "Source"];
                const csvRows = [
                  headers.join(','),
                  ...filteredOrders.map(order => [
                    order.id,
                    `"${order.patient}"`,
                    order.date,
                    `"${Array.isArray(order.items) ? order.items.join('; ') : order.items}"`,
                    order.status,
                    order.source
                  ].join(','))
                ];
                const csvContent = csvRows.join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `${department}_report_${new Date().toISOString().slice(0,10)}.csv`);
                link.click();
              }}
            >
              <FiDownload size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
        
        {/* Order Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 mb-5">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{filteredOrders.length}</div>
            <div className="text-xs text-blue-600 font-medium">Total Orders</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{statusCounts.Completed || 0}</div>
            <div className="text-xs text-green-600 font-medium">Completed</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-700">{statusCounts.Pending || 0}</div>
            <div className="text-xs text-yellow-600 font-medium">Pending</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{statusCounts.External || 0}</div>
            <div className="text-xs text-blue-600 font-medium">External</div>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
            <FiFilter size={16} />
            <span>Filter by:</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-700 border border-slate-300 hover:bg-blue-50"
                }`}
                onClick={() => {
                  setFilter(opt.value);
                  setSearchDate("");
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FiCalendar size={14} className="text-gray-500" />
              </div>
              <input
                type="date"
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setFilter("all");
                }}
                placeholder="Filter by date"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FiSearch size={14} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="bg-white py-16 flex flex-col items-center justify-center text-slate-500">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">Loading order data...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white py-16 flex flex-col items-center justify-center text-slate-400">
            <FiBox size={48} className="mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No orders found</h3>
            <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
              {searchTerm || searchDate 
                ? "Try adjusting your filters or search terms to see more results."
                : `There are no ${department} orders for the selected time period.`}
            </p>
            <button 
              onClick={() => {
                setFilter("all");
                setSearchDate("");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-blue-50 text-blue-900 text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-blue-700">{order.id}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">{order.patient}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{order.date}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm">
                      {Array.isArray(order.items)
                        ? order.items.join(", ")
                        : order.items}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "External"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        order.source === "external"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-50 text-slate-700 border border-slate-200"
                      }`}>
                        {order.source.charAt(0).toUpperCase() + order.source.slice(1)}
                      </span>
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
};