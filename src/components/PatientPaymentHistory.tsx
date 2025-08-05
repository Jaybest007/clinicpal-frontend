import { useState } from "react";
import { FiLoader, FiPrinter, FiSearch, FiDollarSign, FiX } from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "./OrderModal";
import { useNavigate } from "react-router-dom";

export function PatientPaymentHistory({ onClose }: { onClose: () => void }) {
  const { loading, patientPaymentHistory, fetchPatientPaymentHistory, setPatientPaymentHistory } = useDashboard();
  const [patient_id, setPatientId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const navigate = useNavigate();

  // Calculate total amount
  const totalAmount = patientPaymentHistory.reduce(
    (sum, tx) => sum + Number(tx.amount || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSearched(true);

    if (!patient_id.trim()) {
      setError("Please enter a valid Patient ID");
      return;
    }

    try {
      await fetchPatientPaymentHistory(patient_id.trim().toLowerCase());
      setError("");
    } catch (error) {
      setError("Failed to fetch payment history. Please try again.");
    }
  };

  // Function to clear search results
  const handleClear = () => {
    setPatientId("");
    setError("");
    setHasSearched(false);
    setPatientPaymentHistory([]);
  };

  return (
    <OrderModal onClose={onClose}>
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-1">Patient Payment History</h2>
            <p className="text-sm text-slate-500">
              View and print transaction records for a specific patient
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FiDollarSign className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        {/* Search Form */}
        <form 
          className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5" 
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                name="patient_history_id"
                placeholder="Enter Patient ID (e.g., PAT-12345)"
                className="px-4 py-2.5 pl-10 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                value={patient_id}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  setError("");
                }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 min-w-[120px]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin h-4 w-4" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FiSearch className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-2 text-red-600 text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Results Area */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          {/* Simple Summary */}
          {patientPaymentHistory.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
              <div className="font-medium text-blue-900">
                Found {patientPaymentHistory.length} transactions | Total: ₦{totalAmount.toLocaleString()}
              </div>
            </div>
          )}

          {/* Transaction List */}
          <div>
            {!hasSearched ? (
              <div className="text-center py-8 text-slate-500">
                Enter a patient ID to view their payment history
              </div>
            ) : loading ? (
              <div className="text-center py-8 text-slate-500">
                Loading payment history...
              </div>
            ) : patientPaymentHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No payment records found for this patient
              </div>
            ) : (
              <div className="max-h-[350px] overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {patientPaymentHistory.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-900">
                          {transaction.description || "Payment"}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-600">
                          {transaction.department || "General"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                          ₦{Number(transaction.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-5">
          <div>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium"
            >
              Close
            </button>
            
            {patientPaymentHistory.length > 0 && (
              <button
                onClick={handleClear}
                className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <FiX className="h-4 w-4" />
                Clear Results
              </button>
            )}
          </div>
          
          {patientPaymentHistory.length > 0 && (
            <button
              onClick={() => navigate("/sales-report", { state: patientPaymentHistory })}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <FiPrinter className="h-4 w-4" />
              Print Report
            </button>
          )}
        </div>
      </div>
    </OrderModal>
  );
}