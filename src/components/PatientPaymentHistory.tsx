import { FiLoader, FiPrinter } from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "./OrderModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export function PatientPaymentHistory({ onClose }: { onClose: () => void }) {

    const {loading, patientPaymentHistory, fetchPatientPaymentHistory} = useDashboard()
    const [patient_id, setPatientId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!patient_id.trim() || patient_id.trim() === "") {
            setError("Please enter a valid Patient ID.");
            return;
        }

        try{
            await fetchPatientPaymentHistory(patient_id.toLowerCase());
        } catch (error) {
            setError("Failed to fetch patient payment history.");
        }


    }

     return (
        <OrderModal
            onClose={onClose}
          >
           <div className="p-5 bg-white border rounded-lg shadow-sm max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Patient Payment History</h2>

              <form className="flex gap-3 items-center flex-wrap mb-5" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="patient_history_id"
                  placeholder="Enter Patient ID"
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patient_id}
                  onChange={(e) => { setPatientId(e.target.value); setError(""); }}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                  disabled={loading}
                >
                  {loading ? <FiLoader className="animate-spin" /> : "Search"}
                </button>
              </form>

              {error && (
                <div className="text-red-500 text-sm mb-3">{error}</div>
              )}

              <div className="space-y-3">
                {patientPaymentHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col md:flex-row md:items-center justify-between border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-base">{transaction.payers_name}</span>
                        <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded">
                          {transaction.name}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        <strong>For:</strong> <span className="text-blue-600">{transaction.description}</span> &nbsp;|&nbsp;
                        <strong>Amount:</strong> <span className="text-green-600 font-semibold">₦{Number(transaction.amount).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right md:min-w-[160px]">
                      <span className="block text-xs text-slate-400">Date</span>
                      <span className="text-sm text-slate-700 font-medium">
                        {new Date(transaction.created_at).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right mt-6">
                <button
                  onClick={() => navigate("/sales-report", { state: patientPaymentHistory })}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition"
                >
                  <FiPrinter />
                  Print Report
                </button>
              </div>
            </div>

          </OrderModal>
     )
}