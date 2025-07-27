
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
    <section className="bg-white rounded-xl shadow border border-slate-200 p-4 md:p-6 overflow-x-auto relative mt-4">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <span className="text-blue-600 flex items-center gap-2 font-semibold">
            <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading...
          </span>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">D/T</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Patient ID</th>
            <th className="px-4 py-3 text-left">Order</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Sent by</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter(order => order.status === "pending" || order.status === "processing").length === 0 ? (
            <tr>
              <td colSpan={7} className="text-gray-500 py-6 text-center">No orders found.</td>
            </tr>
          ) : (
            orders
              .filter(order => order.status === "pending" || order.status === "processing")
              .map(order => (
                <tr className="hover:bg-blue-50 transition border-b border-gray-200" key={order.id}>
                  <td className="px-4 py-3 font-mono text-blue-700 border">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 border">{order.full_name?.toUpperCase()}</td>
                  <td className="px-4 py-3 font-mono text-blue-700 border">{order.patient_id?.toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-700 border truncate max-w-[200px]" title={order.order_data}>{order.order_data}</td>
                  <td className="px-4 py-3 border">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 border">{order.requested_by}</td>
                  <td className="px-4 py-3 border-r">
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <button
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center justify-center gap-1 text-xs"
                        onClick={() => openModal(order)}
                        title="View Order Details"
                        disabled={loading}
                      >
                        <FiEye className="text-sm" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      {order.status === "processing" && (
                        <button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded flex items-center justify-center gap-1 text-xs"
                          onClick={() => {
                            setSelectedOrder(order);
                            setOrderResultModal(true);
                            setOrderResultsValue(order.result || "");
                          }}
                          title="Add/View Results"
                          disabled={loading}
                        >
                          <RiFileList3Fill className="text-sm" />
                          <span className="hidden sm:inline">Results</span>
                        </button>
                      )}

                      {order.status === "pending" && (
                        <button
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded flex items-center justify-center gap-1 text-xs"
                          onClick={() => setConfirmModal({ order, type: "processing" })}
                          title="Mark as Processing"
                          disabled={loading}
                        >
                          <FiClock className="text-sm" />
                          <span className="hidden sm:inline">Process</span>
                        </button>
                      )}

                      {order.status === "processing" && (
                        <button
                          className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center justify-center gap-1 text-xs"
                          onClick={() => setConfirmModal({ order, type: "completed" })}
                          title="Mark as Completed"
                          disabled={loading}
                        >
                          <FiCheck className="text-sm" />
                          <span className="hidden sm:inline">Complete</span>
                        </button>
                      )}

                      <button
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center justify-center gap-1 text-xs"
                        onClick={() => setConfirmModal({ order, type: "cancelled" })}
                        title="Cancel Order"
                        disabled={loading}
                      >
                        <FiX className="text-sm" />
                        <span className="hidden sm:inline">Cancel</span>
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