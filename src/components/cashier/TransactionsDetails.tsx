import React from "react";
import { FiX, FiPrinter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface TransactionDetailsProps {
  transaction: any;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;
  
  // Format date concisely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short"
    });
  };

  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Transaction Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main content */}
        <div className="p-4">
          {/* Status and amount */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                transaction.payment_status === "paid" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {transaction.payment_status === "paid" ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div className="text-xl font-bold">
              ₦{Number(transaction.amount).toLocaleString()}
            </div>
          </div>
          
          {/* Transaction info in 2-column layout */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <div className="text-gray-500">Payer</div>
              <div>{transaction.payers_name || "N/A"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Patient</div>
              <div>{transaction.name || "N/A"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Department</div>
              <div>{transaction.department || "General"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Payment Method</div>
              <div>{transaction.payment_method?.toUpperCase() || "N/A"}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Date</div>
              <div>{formatDate(transaction.created_at)}</div>
            </div>
            
            <div>
              <div className="text-gray-500">ID</div>
              <div className="font-mono text-xs">{transaction.id}</div>
            </div>
            
            <div className="col-span-2">
              <div className="text-gray-500">Description</div>
              <div>{transaction.description || "N/A"}</div>
            </div>
            
            {transaction.notes && (
              <div className="col-span-2">
                <div className="text-gray-500">Notes</div>
                <div className="italic">{transaction.notes}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end border-t">
          <button
            onClick={() => navigate("/bill-receipt", { state: transaction })}
            className="ml-3 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-1 text-sm"
          >
            <FiPrinter className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;