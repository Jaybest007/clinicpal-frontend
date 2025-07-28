import { FiLoader } from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import OrderModal from "./OrderModal";
import { useState } from "react";



export function PatientPaymentHistory({ onClose }: { onClose: () => void }) {

    const {loading, patientPaymentHistory, fetchPatientPaymentHistory} = useDashboard()
    const [patient_id, setPatientId] = useState<string>("");
    const [error, setError] = useState<string>("");


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
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-3">Patient Payment History</h2>
              <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="patient_history_id"
                  placeholder="Enter Patient ID"
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm flex-1"
                  value={patient_id}
                  onChange={(e) => { setPatientId(e.target.value); setError(""); }}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiLoader />
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </form>
              {error && (
                <div className="text-red-500 text-sm mt-1 ml-1">{error}</div>
              )}
            </div>

            <div>
                {patientPaymentHistory.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 py-4 px-2 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-base text-slate-800">{transaction.payers_name}</span>
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    {transaction.name}
                                </span>
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                <span className="font-medium">Amount:</span> <span className="text-green-600 font-semibold">₦{Number(transaction.amount).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-right md:w-48">
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
          </OrderModal>
     )
}