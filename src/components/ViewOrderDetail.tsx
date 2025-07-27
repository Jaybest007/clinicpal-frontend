import { RiFileList3Fill } from "react-icons/ri";
import OrderModal from "./OrderModal";

interface OrderDetailProps {
  open: boolean;
  order: {
    id: string;
    created_at: string;
    full_name: string;
    patient_id: string;
    order_data: string;
    status: string;
    requested_by: string;
  } | null;
  onClose: () => void;
}

export function ViewOrderDetail({ open, order, onClose }: OrderDetailProps) {
  if (!open || !order) return null;

  return (
    <OrderModal onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2 mb-2 flex items-center gap-2">
          <RiFileList3Fill className="text-blue-500 text-2xl" />
          Order Details
        </h2>
        <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <li>
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="ml-2 font-mono text-blue-700">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </li>
          <li>
            <span className="font-semibold text-gray-700">Patient:</span>
            <span className="ml-2">{order.full_name.toUpperCase()}</span>
          </li>
          <li>
            <span className="font-semibold text-gray-700">Patient ID:</span>
            <span className="ml-2 font-mono text-blue-700">
              {order.patient_id.toUpperCase()}
            </span>
          </li>
          <li>
            <span className="font-semibold text-gray-700">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                order.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : order.status === "processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </li>
          <li className="sm:col-span-2">
            <span className="font-semibold text-gray-700">Requested By:</span>
            <span className="ml-2">{order.requested_by}</span>
          </li>
        </ul>
        <div className="mt-2 bg-slate-50 border border-slate-200 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            {order.order_data || (
              <span className="italic text-gray-400">
                No order details available.
              </span>
            )}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </OrderModal>
  );
}