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
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-8">
      <header className="mb-2">
        <h1 className="text-3xl font-extrabold text-slate-800">Internal Orders</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage and process internal orders efficiently.
        </p>
      </header>
      <section className="overflow-x-auto bg-white shadow-md rounded-xl border border-slate-200">
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
        <table className="w-full text-xs md:text-sm text-left text-gray-700">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="px-4 py-3">D/T</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 max-w-[90px] md:max-w-[220px] truncate">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Requested By</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.filter(o => ["pending", "processing"].includes(o.status)).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                  No active orders at the moment.
                </td>
              </tr>
            ) : (
              orders
                .filter(o => ["pending", "processing"].includes(o.status))
                .map(order => (
                  <tr key={order.id} className="odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-all duration-150">
                    <td className="px-4 py-3 font-mono text-blue-700">
                      {new Date(order.created_at).toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {order.full_name?.toUpperCase()}
                    </td>
                    <td
                      className="px-4 py-3 max-w-[90px] md:max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis"
                      title={order.order_data}
                    >
                      {order.order_data}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-[10px] md:text-[11px] font-medium rounded-full ${
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
                    <div className="overflow-x-auto -mx-2">
                      <div className="flex gap-2 min-w-max px-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap"
                          onClick={() => openModal(order)}
                          disabled={loading}
                          title="View Order"
                        >
                          View
                        </button>

                        {order.status === "processing" && (
                          <button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOrderResultModal(true);
                              setOrderResultsValue(order.result || "");
                            }}
                            disabled={loading}
                            title="Add/View Results"
                          >
                            Results
                          </button>
                        )}

                        {order.status === "pending" && (
                          <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap"
                            onClick={() => setConfirmModal({ order, type: "processing" })}
                            disabled={loading}
                            title="Mark as Processing"
                          >
                            Process
                          </button>
                        )}

                        {order.status === "processing" && (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap"
                            onClick={() => setConfirmModal({ order, type: "completed" })}
                            disabled={loading}
                            title="Complete Order"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap"
                          onClick={() => setConfirmModal({ order, type: "cancelled" })}
                          disabled={loading}
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>


                  </tr>
                ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
