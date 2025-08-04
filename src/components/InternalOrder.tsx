
import { RiFileList3Fill } from "react-icons/ri";
import { FiEye, FiCheck, FiX, FiClock } from "react-icons/fi";

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
  return (
    <section className="bg-white rounded-xl shadow-lg border border-slate-300 p-2 md:p-3 overflow-x-auto relative mt-6">
      {/* 🔄 Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 backdrop-blur-sm">
          <span className="text-blue-600 flex items-center gap-2 font-semibold animate-fade-in">
            <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading orders...
          </span>
        </div>
      )}

      {/* 📋 Order Table */}
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left font-inter">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 uppercase text-xs font-bold tracking-wide sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3">D/T</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 max-w-[220px] truncate">Order</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Requested By</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-slate-100">
          {orders.filter(o => ["pending", "processing"].includes(o.status)).length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic">
                No active orders at the moment.
              </td>
            </tr>
          ) : (
            orders
              .filter(o => ["pending", "processing"].includes(o.status))
              .map(order => (
                <tr key={order.id} className="hover:bg-blue-50 transition-all duration-150">
                  <td className="px-4 py-3 font-mono text-blue-700">
                    {new Date(order.created_at).toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {order.full_name?.toUpperCase()}
                  </td>
                  <td
                    className="px-4 py-3 max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis"
                    title={order.order_data}
                  >
                    {order.order_data}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-[11px] font-medium rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{order.requested_by}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-row flex-wrap gap-1 sm:gap-2 items-center">
                      {/* 👁 View */}
                      <button
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
                        onClick={() => openModal(order)}
                        disabled={loading}
                        title="View Order"
                      >
                        <FiEye />
                        <span className="hidden xs:inline sm:inline">View</span>
                      </button>

                      {/* 📄 Results */}
                      {order.status === "processing" && (
                        <button
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition"
                          onClick={() => {
                            setSelectedOrder(order);
                            setOrderResultModal(true);
                            setOrderResultsValue(order.result || "");
                          }}
                          disabled={loading}
                          title="Add/View Results"
                        >
                          <RiFileList3Fill />
                          <span className="hidden xs:inline sm:inline">Results</span>
                        </button>
                      )}

                      {/* ⏱ Process */}
                      {order.status === "pending" && (
                        <button
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded transition"
                          onClick={() => setConfirmModal({ order, type: "processing" })}
                          disabled={loading}
                          title="Mark as Processing"
                        >
                          <FiClock />
                          <span className="hidden xs:inline sm:inline">Process</span>
                        </button>
                      )}

                      {/* ✅ Complete */}
                      {order.status === "processing" && (
                        <button
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition"
                          onClick={() => setConfirmModal({ order, type: "completed" })}
                          disabled={loading}
                          title="Complete Order"
                        >
                          <FiCheck />
                          <span className="hidden xs:inline sm:inline">Complete</span>
                        </button>
                      )}

                      {/* ❌ Cancel */}
                      <button
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                        onClick={() => setConfirmModal({ order, type: "cancelled" })}
                        disabled={loading}
                        title="Cancel Order"
                      >
                        <FiX />
                        <span className="hidden xs:inline sm:inline">Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </section>
  );
}
