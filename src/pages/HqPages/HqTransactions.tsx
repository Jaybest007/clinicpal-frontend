import  { useState } from "react";
import { HqNavBar } from "../../components/hq_components/HqNavBar";
import { useDashboard } from "../../context/DashboardContext";
import { TodaysTransaction } from "../../components/TodaysTransaction";
import { PatientPaymentHistory } from "../../components/patient/PatientPaymentHistory";
import TransactionStats from "../../components/hq_components/TransactionStats";
import TransactionHeader from "../../components/hq_components/TransactionHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export function HqTransactions() {
  const { loading, transactions } = useDashboard();
  const [patientHistory, setPatientHistory] = useState(false);
  
  const handleViewPatientHistory = () => {
    setPatientHistory(true);
  };
  
  const handleClosePatientHistory = () => {
    setPatientHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <HqNavBar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 space-y-10">
        {/* Overview Header */}
        <TransactionHeader onViewPatientHistory={handleViewPatientHistory} />

        {/* Transaction Statistics */}
        <TransactionStats transactions={transactions} />

        {/* Today's Transactions */}
        {loading ? (
          <LoadingSpinner message="Loading today's transactions..." />
        ) : (
          <TodaysTransaction />
        )}
      </main>

      {/* Patient Payment History Modal */}
      {patientHistory && (
        <PatientPaymentHistory onClose={handleClosePatientHistory} />
      )}
    </div>
  );
}