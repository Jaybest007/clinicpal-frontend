import { useMemo, useState, useCallback } from "react";
import { FiRefreshCw, FiDownload, FiPrinter, FiEdit, FiX, FiAlertCircle } from "react-icons/fi";
import { BsReceipt, BsCheckCircle, BsXCircle, BsFilter, BsSearch } from "react-icons/bs";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TransactionDetails from ".././components/cashier/TransactionsDetails";

// Extracted utility for CSV operations
const csvUtils = {
  convertToCSV: (objArray: any[]) => {
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
  },

  downloadCSV: (csvContent: string, filename: string) => {
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
    
    // Clean up by revoking the URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  },
  
  exportTransactions: (transactions: any[], filterType: string) => {
    // Generate a filename with the current date
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const filename = `transactions_${formattedDate}_${filterType}.csv`;
    
    // Get data and sort it (same as in the table)
    const dataToExport = [...transactions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Convert to CSV and download
    const csvContent = csvUtils.convertToCSV(dataToExport);
    csvUtils.downloadCSV(csvContent, filename);
  }
};

// Extracted filter types
type FilterType = "today" | "yesterday" | "search";

// Extracted date utils
const dateUtils = {
  isToday: (dateStr: string) => {
    const txDate = new Date(dateStr);
    const today = new Date();
    return (
      txDate.getFullYear() === today.getFullYear() &&
      txDate.getMonth() === today.getMonth() &&
      txDate.getDate() === today.getDate()
    );
  },
  
  isYesterday: (dateStr: string) => {
    const txDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    return (
      txDate.getFullYear() === yesterday.getFullYear() &&
      txDate.getMonth() === yesterday.getMonth() &&
      txDate.getDate() === yesterday.getDate()
    );
  },
  
  formatDateTime: (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
};

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

// Table Header Component
interface TableHeaderProps {
  onRefresh: () => void;
  onExportCSV: () => void;
  onPrintSummary: () => void;
  isLoading: boolean;
  hasData: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  onRefresh, 
  onExportCSV, 
  onPrintSummary, 
  isLoading,
  hasData
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <h2 className="font-semibold text-lg">Transactions</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh transactions"
        >
          {isLoading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}{" "}
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button 
          className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onExportCSV}
          disabled={!hasData}
          title="Export transactions to CSV"
        >
          <FiDownload /> <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button
          className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPrintSummary}
          disabled={!hasData}
          title="Print transaction summary"
        >
          <BsReceipt /> <span className="hidden sm:inline">Print Summary</span>
        </button>
      </div>
    </div>
  );
};

// Filter Controls Component
interface FilterControlsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  search: string;
  setSearch: (search: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  filter, 
  setFilter, 
  search, 
  setSearch 
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex bg-slate-100 p-0.5 rounded-lg">
        <button
          className={`px-3 py-1.5 rounded-md transition-colors ${filter === "today" ? "bg-blue-600 text-white" : "hover:bg-slate-200"}`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
        <button
          className={`px-3 py-1.5 rounded-md transition-colors ${filter === "yesterday" ? "bg-blue-600 text-white" : "hover:bg-slate-200"}`}
          onClick={() => setFilter("yesterday")}
        >
          Yesterday
        </button>
        <button
          className={`px-3 py-1.5 rounded-md transition-colors ${filter === "search" ? "bg-blue-600 text-white" : "hover:bg-slate-200"}`}
          onClick={() => setFilter("search")}
        >
          <BsSearch className="inline mr-1" /> Search
        </button>
      </div>
      
      {filter === "search" && (
        <div className="relative">
          <input
            type="text"
            className="pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Transaction Table Component
interface TransactionTableProps {
  transactions: any[];
  onViewDetails: (tx: any) => void;
  onPrint: (tx: any) => void;
  onMarkPaid: (tx: any) => void;
  onCancel: (tx: any) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onViewDetails, 
  onPrint, 
  onMarkPaid, 
  onCancel 
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-8 rounded-lg text-center">
        <BsFilter className="mx-auto h-8 w-8 mb-2 text-blue-400" />
        <p className="font-medium text-lg">No transactions found</p>
        <p className="text-sm mt-1">Try changing your filters or time period</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-blue-50">
            <th className="px-4 py-3 border-b border-slate-200 text-left">#</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Payers Name</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Dept.</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Service</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Amount</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Paid?</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Method</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Time</th>
            <th className="px-4 py-3 border-b border-slate-200 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((tx, index) => (
              <tr 
                key={tx.id} 
                className="even:bg-slate-50 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => onViewDetails(tx)}
              >
                <td className="px-4 py-3 border-b border-slate-100">{index + 1}</td>
                <td className="px-4 py-3 border-b border-slate-100 font-medium">{tx.payers_name}</td>
                <td className="px-4 py-3 border-b border-slate-100">{tx.department}</td>
                <td className="px-4 py-3 border-b border-slate-100">{tx.description}</td>
                <td className="px-4 py-3 border-b border-slate-100 font-semibold">
                  ₦{Number(tx.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 border-b border-slate-100">
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
                <td className="px-4 py-3 border-b border-slate-100">{tx.payment_method?.toUpperCase()}</td>
                <td className="px-4 py-3 border-b border-slate-100">
                  {dateUtils.formatDateTime(tx.created_at)}
                </td>
                <td className="px-4 py-3 border-b border-slate-100">
                  <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-xs transition-colors"
                      onClick={() => onPrint(tx)}
                      title="Print receipt"
                    >
                      <FiPrinter /> <span className="hidden sm:inline">Print</span>
                    </button>
                    
                    {tx.payment_status !== "paid" && (
                      <>
                        <button 
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded flex items-center gap-1 text-xs transition-colors"
                          onClick={() => onMarkPaid(tx)}
                          title="Mark as paid"
                        >
                          <FiEdit /> <span className="hidden sm:inline">Mark Paid</span>
                        </button>
                        
                        <button 
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1 text-xs transition-colors"
                          onClick={() => onCancel(tx)}
                          title="Cancel transaction"
                        >
                          <FiX /> <span className="hidden sm:inline">Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// Main component
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
    isExternal: true, // flag if you want to distinguish
  })), [externalBillingData]);

  // 2. Merge transactions and mappedExternal
  const allTransactions = useMemo(
    () => [...transactions, ...mappedExternal],
    [transactions, mappedExternal]
  );

  // 3. Filtering logic using the extracted utility functions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (filter === "today") {
        return dateUtils.isToday(tx.created_at);
      }
      if (filter === "yesterday") {
        return dateUtils.isYesterday(tx.created_at);
      }
      if (filter === "search" && search.trim()) {
        return (
          tx.id?.toString().includes(search.trim()) ||
          tx.payers_name?.toLowerCase().includes(search.trim().toLowerCase())
        );
      }
      return false;
    });
  }, [allTransactions, filter, search]);

  // Handler for CSV export - now uses the extracted utility
  const handleExportCSV = useCallback(() => {
    csvUtils.exportTransactions(filteredTransactions, filter);
  }, [filteredTransactions, filter]);

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

  // Handlers for table actions
  const handlePrintReceipt = useCallback((tx: any) => {
    navigate("/bill-receipt", { state: tx });
  }, [navigate]);

  const handlePrintSummary = useCallback(() => {
    navigate("/sales-report", { state: filteredTransactions });
  }, [navigate, filteredTransactions]);

  const handleMarkPaid = useCallback((tx: any) => {
    setConfirmModal({
      type: "paid",
      transactionId: tx.id?.toString() || "",
      payersName: tx.payers_name || "Unknown",
      amount: Number(tx.amount) || 0
    });
  }, []);

  const handleCancel = useCallback((tx: any) => {
    setConfirmModal({
      type: "cancel",
      transactionId: tx.id?.toString() || "",
      payersName: tx.payers_name || "Unknown",
      amount: Number(tx.amount) || 0
    });
  }, []);

  return (
    <div>
      {/* Transaction section with modular components */}
      <section className="bg-white rounded-xl shadow p-5 mb-8">
        {/* Header with action buttons */}
        <TableHeader 
          onRefresh={fetchTransactions}
          onExportCSV={handleExportCSV}
          onPrintSummary={handlePrintSummary}
          isLoading={loading}
          hasData={filteredTransactions.length > 0}
        />

        {/* Filter controls */}
        <FilterControls 
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
        />

        {/* Transaction table - now a separate component */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
            <p className="text-blue-600 font-medium">Loading transactions...</p>
          </div>
        ) : (
          <TransactionTable 
            transactions={filteredTransactions}
            onViewDetails={setSelectedTransaction}
            onPrint={handlePrintReceipt}
            onMarkPaid={handleMarkPaid}
            onCancel={handleCancel}
          />
        )}
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

      {/* Transaction Details Modal */}
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