import { useMemo, useState } from "react";
import { FiRefreshCw, FiDownload, FiPrinter, FiEdit, FiX } from "react-icons/fi";
import { BsReceipt, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";

type FilterType = "today" | "yesterday" | "search";

export function TodaysTransaction() {
  const { transactions, loading, fetchTransactions, externalBillingData } = useDashboard();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("today");
  const [search, setSearch] = useState("");

  // 1. Map externalBillingData to match transactions structure
  const mappedExternal = useMemo(() => externalBillingData.map((ext, idx) => ({
    id: ext.id || `external-${idx}`,
    payers_name: ext.payers_name,
    department: ext.department,
    description:  ext.service || "",
    amount: ext.amount,
    payment_method: ext.payment_method,
    created_at: ext.created_at,
    payment_status: "paid", // Default to "paid" for external data
    // ...add any other fields needed for display/actions
    isExternal: true, // flag if you want to distinguish
  })), [externalBillingData]);

  // 2. Merge transactions and mappedExternal
  const allTransactions = useMemo(
    () => [...transactions, ...mappedExternal],
    [transactions, mappedExternal]
  );

  // 3. Filtering logic (unchanged)
  const filteredTransactions = allTransactions.filter((tx) => {
    const txDate = new Date(tx.created_at);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (filter === "today") {
      return (
        txDate.getFullYear() === today.getFullYear() &&
        txDate.getMonth() === today.getMonth() &&
        txDate.getDate() === today.getDate()
      );
    }
    if (filter === "yesterday") {
      return (
        txDate.getFullYear() === yesterday.getFullYear() &&
        txDate.getMonth() === yesterday.getMonth() &&
        txDate.getDate() === yesterday.getDate()
      );
    }
    if (filter === "search" && search.trim()) {
      return (
        tx.id?.toString().includes(search.trim()) ||
        tx.payers_name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    return false;
  });

  return (
    <div>
      {/* Section 2: Today's Transactions */}
      <section className="bg-white rounded-xl shadow p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-lg">Transactions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
              onClick={fetchTransactions}
              disabled={loading}
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}{" "}
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
              <FiDownload /> <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
              onClick={() => navigate("/sales-report", { state: filteredTransactions })}
            >
              <BsReceipt /> <span className="hidden sm:inline">Print Summary</span>
            </button>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded ${filter === "today" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
            onClick={() => setFilter("today")}
          >
            Today
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "yesterday" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
            onClick={() => setFilter("yesterday")}
          >
            Yesterday
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "search" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
            onClick={() => setFilter("search")}
          >
            Search
          </button>
          {filter === "search" && (
            <input
              type="text"
              className="ml-2 px-2 py-1 border rounded"
              placeholder="Search by ID or Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-slate-200 rounded-lg">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 border-b border-slate-200">#</th>
                <th className="px-4 py-2 border-b border-slate-200">Payers Name</th>
                <th className="px-4 py-2 border-b border-slate-200">Dept.</th>
                <th className="px-4 py-2 border-b border-slate-200">Service</th>
                <th className="px-4 py-2 border-b border-slate-200">Amount</th>
                <th className="px-4 py-2 border-b border-slate-200">Paid?</th>
                <th className="px-4 py-2 border-b border-slate-200">Method</th>
                <th className="px-4 py-2 border-b border-slate-200">Time</th>
                <th className="px-4 py-2 border-b border-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((tx, index) => (
                  <tr key={tx.id} className="even:bg-slate-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{tx.payers_name}</td>
                    <td className="px-4 py-2">{tx.department}</td>
                    <td className="px-4 py-2">{tx.description}</td>
                    <td className="px-4 py-2 font-semibold">
                      ₦{Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {tx.payment_status === "paid" ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                          <BsCheckCircle className="text-lg" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                          <BsXCircle className="text-lg" /> No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{tx.payment_method?.toUpperCase()}</td>
                    <td className="px-4 py-2">
                      {new Date(tx.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      <button
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-xs"
                        onClick={() => navigate("/bill-receipt", { state: tx })}
                      >
                        <FiPrinter /> <span className="hidden sm:inline">Print</span>
                      </button>
                      <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded flex items-center gap-1 text-xs">
                        <FiEdit /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1 text-xs">
                        <FiX /> <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}