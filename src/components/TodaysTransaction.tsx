import { useMemo, useState } from "react";
import { FiRefreshCw, FiDownload, FiPrinter, FiEdit, FiX, FiAlertCircle } from "react-icons/fi";
import { BsReceipt, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TransactionDetails from ".././components/cashier/TransactionsDetails";

const convertToCSV = (objArray: any[]) => {
  // Define columns and headers
  const columns = [
    'id', 
    'payers_name', 
    'department', 
    'description', 
    'amount', 
    'payment_status', 
    'payment_method', 
    'created_at'
  ];
  
  const headers = [
    'Transaction ID', 
    'Payer', 
    'Department', 
    'Service', 
    'Amount (₦)', 
    'Payment Status', 
    'Payment Method', 
    'Date & Time'
  ];
  
  // Create the header row
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  objArray.forEach(obj => {
    // Format data properly, escaping commas and quotes
    const row = columns.map(col => {
      let value = obj[col];
      
      // Format amount as number
      if (col === 'amount') {
        value = Number(value).toString();
      }
      
      // Format date nicely
      if (col === 'created_at') {
        value = new Date(value).toLocaleString();
      }
      
      // Format payment status
      if (col === 'payment_status') {
        value = value === 'paid' ? 'Paid' : 'Unpaid';
      }
      
      // Escape quotes and commas for CSV format
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string and handle special characters
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
};

const downloadCSV = (csvContent: string, filename: string) => {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  // Add the link to the document, click it, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

type FilterType = "today" | "yesterday" | "search";

// Confirmation modal component
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  confirmText?: string;
  confirmColor?: string;
  icon?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isLoading,
  confirmText = "Confirm",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
  icon = <FiAlertCircle className="text-amber-500 w-5 h-5" />
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          </div>
        </div>
        
        <div className="p-5">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-white transition-colors text-sm font-medium flex items-center gap-2 ${confirmColor}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export function TodaysTransaction() {
  const { transactions, loading, fetchTransactions, externalBillingData, updatePaymentStatus } = useDashboard();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("today");
  const [search, setSearch] = useState("");
  
  // State for confirmation modals
  const [confirmModal, setConfirmModal] = useState<null | {
    type: "paid" | "cancel";
    transactionId: string;
    payersName: string;
    amount: number;
  }>(null);

  // State for transaction details modal
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Handler to execute payment update after confirmation
  const handleConfirmedAction = async () => {
    if (!confirmModal) return;
    
    await updatePaymentStatus({
      transaction_id: confirmModal.transactionId,
      action: confirmModal.type
    });
    
    setConfirmModal(null);
    fetchTransactions();
  };

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

  // Function to handle CSV export
  const handleExportCSV = () => {
    // Generate a filename with the current date
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const filename = `transactions_${formattedDate}_${filter}.csv`;
    
    // Get data and sort it (same as in the table)
    const dataToExport = [...filteredTransactions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Convert to CSV and download
    const csvContent = convertToCSV(dataToExport);
    downloadCSV(csvContent, filename);
  };

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
            {/* Update the Export CSV button with the onClick handler */}
            <button 
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
            >
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
                  <tr 
                    key={tx.id} 
                    className="even:bg-slate-50 cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => setSelectedTransaction(tx)}
                  >
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          navigate("/bill-receipt", { state: tx });
                        }}
                      >
                        <FiPrinter /> <span className="hidden sm:inline">Print</span>
                      </button>
                      
                      {/* Updated Edit Button with Confirmation */}
                      {tx.payment_status !== "paid" && <button 
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded flex items-center gap-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          setConfirmModal({
                            type: "paid",
                            transactionId: tx.id?.toString() || "",
                            payersName: tx.payers_name || "Unknown",
                            amount: Number(tx.amount) || 0
                          });
                        }}
                        disabled={tx.payment_status === "paid" }
                      >
                        <FiEdit /> <span className="hidden sm:inline">Mark Paid</span>
                      </button>}
                      
                      {/* Updated Cancel Button with Confirmation */}
                      <button 
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          setConfirmModal({
                            type: "cancel",
                            transactionId: tx.id?.toString() || "",
                            payersName: tx.payers_name || "Unknown",
                            amount: Number(tx.amount) || 0
                          });
                        }}
                        disabled={tx.payment_status === "paid" }
                      >
                        <FiX /> <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {confirmModal && confirmModal.type === "paid" && (
          <ConfirmModal
            isOpen={true}
            title="Mark as Paid"
            message={`Are you sure you want to mark the payment of ₦${confirmModal.amount.toLocaleString()} for ${confirmModal.payersName} as paid?`}
            onConfirm={handleConfirmedAction}
            onCancel={() => setConfirmModal(null)}
            isLoading={loading}
            confirmText="Mark as Paid"
            confirmColor="bg-green-600 hover:bg-green-700"
            icon={<BsCheckCircle className="text-green-500 w-5 h-5" />}
          />
        )}
        
        {confirmModal && confirmModal.type === "cancel" && (
          <ConfirmModal
            isOpen={true}
            title="Cancel Transaction"
            message={`Are you sure you want to cancel the payment of ₦${confirmModal.amount.toLocaleString()} for ${confirmModal.payersName}? This action cannot be undone.`}
            onConfirm={handleConfirmedAction}
            onCancel={() => setConfirmModal(null)}
            isLoading={loading}
            confirmText="Cancel Transaction"
            confirmColor="bg-red-600 hover:bg-red-700"
            icon={<FiX className="text-red-500 w-5 h-5" />}
          />
        )}
      </AnimatePresence>

      {/* Transaction Details Modal - Using the imported component */}
      <AnimatePresence>
        {selectedTransaction && (
          <TransactionDetails 
            transaction={selectedTransaction} 
            onClose={() => setSelectedTransaction(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}