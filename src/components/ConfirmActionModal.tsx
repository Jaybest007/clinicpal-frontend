import React from "react";
import { useDashboard } from "../context/DashboardContext";

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

interface ConfirmActionModalProps {
  open: boolean;
  type: string;
  order: Order;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  open,
  type,
  order,
  onCancel,
  onConfirm,
}) => {
  if (!open || !order) return null;
  const {loading} = useDashboard()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Confirm Action</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to <strong>{type}</strong> <strong>{order.full_name}</strong>'s order?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition"
            onClick={onCancel}
            disabled={loading}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            onClick={onConfirm}
            disabled={loading}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;