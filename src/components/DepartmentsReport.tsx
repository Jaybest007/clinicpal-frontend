import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";

type DepartmentsReportProps = {
  department?: string;
};

export const DepartmentsReport = ({ department }: DepartmentsReportProps) => {
  const { pharmacyData, labData, ultrasoundData, loading, externalOrder } = useDashboard();
  if (!department) return null;

  // Map department to correct data source
  let orders: any[] = [];
  if (department.toLowerCase() === "pharmacy") {
    orders = pharmacyData || [];
  } else if (department.toLowerCase() === "lab") {
    orders = labData || [];
  } else if (department.toLowerCase() === "ultrasound") {
    orders = ultrasoundData || [];
  }

  // Harmonize external orders for this department
  const externalOrdersForDept = externalOrder
    ? externalOrder.filter(
        (order) =>
          order.order_type &&
          order.order_type.toLowerCase() === department.toLowerCase()
      )
    : [];

  // Normalize internal orders
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

  // Normalize external orders
  const normalizedExternalOrders = externalOrdersForDept.map((order) => ({
    id: order.id || "",
    patient: order.name ||  "",
    date: (order.created_on || "").slice(0, 10),
    items: [order.order_data || ""],
    status: "External",
    source: "external",
  }));

  // Combine and sort all orders by date/time descending
  const allOrders = [...normalizedInternalOrders, ...normalizedExternalOrders].sort((a, b) => {
    const dateA = new Date(a.date.length > 10 ? a.date : a.date + "T00:00:00");
    const dateB = new Date(b.date.length > 10 ? b.date : b.date + "T00:00:00");
    return dateB.getTime() - dateA.getTime();
  });

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last Week", value: "week" },
    { label: "Last Month", value: "month" },
    { label: "All", value: "all" },
  ];

  function filterOrders(orders: any[], filter: string, searchDate: string) {
    const now = new Date();
    let filtered = orders;

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
    return filtered;
  }

  const [filter, setFilter] = useState("today");
  const [searchDate, setSearchDate] = useState("");

  // Use sorted orders for filtering
  const filteredOrders = filterOrders(allOrders, filter, searchDate);

  return (
    <div className="max-w-8xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-slate-100 rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">
        {department} Order History
      </h1>
      <p className="text-gray-600 mb-6">
        Detailed order history for the{" "}
        <span className="font-semibold text-blue-700">{department}</span>{" "}
        department.
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded-lg border text-sm font-semibold transition ${
              filter === opt.value
                ? "bg-blue-700 text-white border-blue-700 shadow"
                : "bg-white text-blue-700 border-slate-300 hover:bg-blue-50"
            }`}
            onClick={() => {
              setFilter(opt.value);
              setSearchDate("");
            }}
          >
            {opt.label}
          </button>
        ))}
        <input
          type="date"
          className="ml-2 px-2 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setFilter("all");
          }}
          placeholder="Search by date"
        />
      </div>
      <div className="border rounded-xl overflow-hidden bg-white shadow relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <span className="text-blue-600 flex items-center gap-2 font-semibold">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Loading...
            </span>
          </div>
        )}
        <table className="w-full text-left border border-slate-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-blue-900 border-b border-slate-300">Order ID</th>
              <th className="px-6 py-4 font-semibold text-blue-900 border-b border-slate-300">Patient</th>
              <th className="px-6 py-4 font-semibold text-blue-900 border-b border-slate-300">Date</th>
              <th className="px-6 py-4 font-semibold text-blue-900 border-b border-slate-300">Items</th>
              <th className="px-6 py-4 font-semibold text-blue-900 border-b border-slate-300">Status</th>
              <th className="px-6 py-4 font-semibold text-blue-900 border-b border-slate-300">Source</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr className="border border-slate-300">
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 border-b border-slate-200">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border border-slate-300 border-b hover:bg-blue-50 transition"
                >
                  <td className="px-6 py-4 font-mono text-blue-700 align-middle">{order.id}</td>
                  <td className="px-6 py-4 text-gray-900 align-middle">{order.patient}</td>
                  <td className="px-6 py-4 text-gray-700 align-middle">{order.date}</td>
                  <td className="px-6 py-4 text-gray-700 align-middle">
                    {Array.isArray(order.items)
                      ? order.items.join(", ")
                      : order.items}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "External"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.source === "external"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-50 text-gray-700 border border-gray-200"
                    }`}>
                      {order.source.charAt(0).toUpperCase() + order.source.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};