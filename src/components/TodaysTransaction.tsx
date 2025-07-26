import {  FiRefreshCw, FiDownload, FiPrinter, FiEdit, FiX, } from "react-icons/fi";
import { BsReceipt, BsCheckCircle, BsXCircle,  } from "react-icons/bs";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";

export function TodaysTransaction (){

    const { transactions, loading, fetchTransactions } = useDashboard();
    const navigate = useNavigate();
    return(



        <div>
            {/* Section 2: Today's Transactions */}
        <section className="bg-white rounded-xl shadow p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="font-semibold text-lg">Today's Transactions</h2>
            <div className="flex flex-wrap gap-2">
              <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
                onClick={fetchTransactions}
                disabled={loading}
              >
                {loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />} <span className="hidden sm:inline">Refresh</span>
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
                <FiDownload /> <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
                <BsReceipt /> <span className="hidden sm:inline">Print Summary</span>
              </button>
            </div>
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
                {transactions
                  .filter(tx => {
                    const txDate = new Date(tx.created_at);
                    const today = new Date();
                    return (
                      txDate.getFullYear() === today.getFullYear() &&
                      txDate.getMonth() === today.getMonth() &&
                      txDate.getDate() === today.getDate()
                    );
                  })
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((tx, index) => (
                    <tr key={tx.id} className="even:bg-slate-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{tx.payers_name}</td>
                      <td className="px-4 py-2">{tx.department}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                      <td className="px-4 py-2 font-semibold">₦{Number(tx.amount).toLocaleString()}</td>
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
                        {new Date(tx.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        <button 
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-xs"
                          onClick={() => navigate("/bill-receipt", {state: tx})}
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
    )
}