import React, { useEffect, useRef } from "react";
import { useDashboard } from "../context/DashboardContext";
import { FiAlertTriangle } from "react-icons/fi";

// Make the interface more flexible to handle different entity types
interface GenericEntity {
  id?: string;
  patient_id?: string;
  full_name?: string;
  [key: string]: any; // Allow for additional properties
}

interface ConfirmActionModalProps {
  open: boolean;
  type: string;
  order: GenericEntity;
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
  // Keep your existing logic
  if (!open || !order) return null;
  const { loading } = useDashboard();
  
  // Reference to the confirm button for auto-focus
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  
  // Auto-focus on the confirm button when the modal opens
  useEffect(() => {
    if (open && confirmButtonRef.current) {
      setTimeout(() => confirmButtonRef.current?.focus(), 50);
    }
  }, [open]);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);
  
  // Determine the entity name to display
  const entityName = order.full_name || order.id || order.patient_id || 'selected item';
  
  // Determine action color based on type
  const actionColor = 
    type.toLowerCase().includes('delete') || type.toLowerCase().includes('remove') 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-green-600 hover:bg-green-700';
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onCancel} // Close when clicking background
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-200 scale-100"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        <div className="flex items-center mb-4">
          <div className="mr-4 p-2 rounded-full bg-amber-50 border border-amber-100">
            <FiAlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Confirm {type}</h2>
        </div>
        
        <p className="text-sm text-gray-700 mb-6 pl-12">
          Are you sure you want to <span className="font-medium">{type}</span>{" "}
          <span className="font-medium text-blue-600">{entityName}</span>?
          <br/>
          <span className="text-gray-500 text-xs mt-1 block">
            This action {type.toLowerCase().includes('delete') ? 'cannot' : 'may not'} be undone.
          </span>
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            ref={confirmButtonRef}
            className={`px-4 py-2 ${actionColor} text-white rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              type.toLowerCase().includes('delete') ? 'focus:ring-red-500' : 'focus:ring-green-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Confirm ${type}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;