import { useEffect, useState } from "react";
import {  FiPlus,  FiLoader } from "react-icons/fi";

import { useDashboard } from "../context/DashboardContext";

import NavBar from "../components/NavBar";
import SearchPatientReport from "../components/SearchPatientReport";
import { TodaysTransaction } from "../components/TodaysTransaction";

import { ExternalBilling } from "../components/ExternalBilling";

import { PatientPaymentHistory } from "../components/PatientPaymentHistory";
import { CashierStatCard } from "../components/cashier/CashierStatCard";


interface BillingDetails {
  payers_name: string;
  patient_id: string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  notes: string;
}

interface BillingErrors {
  payers_name: string;
  patient_id: string;
  department: string;
  service: string;
  amount: string;
  payment_method: string;
  searchValue?: string;
}

export const Cashier = () => {
  
  const [externalBilling, setExternalBilling] = useState(false);
  const [patientHistory, setPatientHistory] = useState(false);
  const { newBilling, loading, token, transactions, fetchTransactions, fetchExternalBilling,  } = useDashboard();
  const [billingData, setBillingData] = useState<BillingDetails>({
    payers_name: "",
    patient_id: "",
    department: "",
    service: "",
    amount: 0,
    payment_method: "",
    notes: "",
    payment_status: "",
  });
  const [errors, setErrors] = useState<BillingErrors>({
    payers_name: "",
    patient_id: "",
    department: "",
    service: "",
    amount: "",
    payment_method: "",
    searchValue: "",
  });

  //===fetch transaction===
  useEffect(() => {
      if (!token) return;
      if (transactions.length === 0) {
        fetchTransactions();
        fetchExternalBilling();
      }
    }, [token, transactions, fetchTransactions, fetchExternalBilling]);
  //===============
  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "amount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setBillingData((prev) => ({
        ...prev,
        amount: numericValue === "" ? 0 : parseInt(numericValue, 10),
      }));
    } else if (type === "checkbox") {
      setBillingData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setBillingData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  //======= handle billing submit =======
  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: BillingErrors = {
      payers_name: billingData.payers_name.trim() ? "" : "Payers name is required.",
      patient_id: billingData.patient_id.trim() ? "" : "Patient ID is required.",
      department: billingData.department.trim() ? "" : "Department is required.",
      service: billingData.service.trim() ? "" : "Service is required.",
      amount: billingData.amount > 0 ? "" : "Amount must be greater than 0.",
      payment_method: billingData.payment_method.trim() ? "" : "Payment method is required.",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      return;
    }

    try {
      await newBilling(billingData);
      fetchTransactions();
      setBillingData({
        payers_name: "",
        patient_id: "",
        department: "",
        service: "",
        amount: 0,
        payment_method: "",
        notes: "",
        payment_status: "",
      });
      setErrors({
        payers_name: "",
        patient_id: "",
        department: "",
        service: "",
        amount: "",
        payment_method: "",
      });
      
    } catch (error) {
     
      
    }
  };

  
  
  return (
    <div className="bg-[#F7F9FC] text-gray-900 min-h-screen">

    {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 md:px-6 py-6">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white shadow flex flex-col md:flex-row items-center justify-between px-4 py-3 mb-6 rounded-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <h1 className="text-2xl font-bold text-[#2788E3]">Cashier</h1>
        </div>
        <div className="flex flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
        onClick={() => setExternalBilling(true)}
        className="px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium shadow-sm transition-colors flex-1 md:flex-none"
          >
        External Billing
          </button>
          <button
        onClick={() => setPatientHistory(true)}
        className="px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium shadow-sm transition-colors flex-1 md:flex-none"
          >
        Patient history
          </button>
        </div>
      </header>

        {/* Stats: Use horizontal scroll on mobile */}
        <CashierStatCard/>

        {/* Section 1: Search & Add Billing */}
        <section className="flex flex-col md:grid md:grid-cols-2 gap-6 mb-8">
          {/* Search Patient */}
            <SearchPatientReport />

          
          {/* Add New Billing */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-lg">Add New Billing</h2>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleBillingSubmit}>
              <div className="flex flex-col">
                <input
                  className={`px-3 py-2 border ${errors.payers_name ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  placeholder="Payers name"
                  name="payers_name"
                  value={billingData.payers_name}
                  onChange={handleInputChange}
                />
                {errors.payers_name && (
                  <span className="text-xs text-red-600 mt-1">{errors.payers_name}</span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  className={`px-3 py-2 border ${errors.patient_id ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  placeholder="Patient ID"
                  name="patient_id"
                  value={billingData.patient_id}
                  onChange={handleInputChange}
                />
                {errors.patient_id && (
                  <span className="text-xs text-red-600 mt-1">{errors.patient_id}</span>
                )}
              </div>
              <div className="flex flex-col">
                <select
                  className={`px-3 py-2 border ${errors.department ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  name="department"
                  value={billingData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Department</option>
                  <option value="lab">Lab</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="consult">Consult</option>
                  <option value="ultrasound">Ultrasound</option>
                  <option value="xray">X-Ray</option>
                  <option value="mortuary">Mortuary</option>
                </select>
                {errors.department && (
                  <span className="text-xs text-red-600 mt-1">{errors.department}</span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  className={`px-3 py-2 border ${errors.service ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  placeholder="Service"
                  name="service"
                  value={billingData.service}
                  onChange={handleInputChange}
                />
                {errors.service && (
                  <span className="text-xs text-red-600 mt-1">{errors.service}</span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  className={`px-3 py-2 border ${errors.amount ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  placeholder="₦ Amount"
                  name="amount"
                  value={billingData.amount === 0 ? "" : billingData.amount}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {errors.amount && (
                  <span className="text-xs text-red-600 mt-1">{errors.amount}</span>
                )}
              </div>
              <div className="flex flex-col">
                <select
                  className={`px-3 py-2 border ${errors.payment_method ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  name="payment_method"
                  value={billingData.payment_method}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="pos">POS</option>
                  <option value="transfer">Transfer</option>
                  <option value="other">Other</option>
                </select>
                {errors.payment_method && (
                  <span className="text-xs text-red-600 mt-1">{errors.payment_method}</span>
                )}
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <select
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    name="payment_status"
                    value={billingData.payment_status}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partially_paid">Partially Paid</option>
                </select>
                <input
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Add Notes"
                  name="notes"
                  value={billingData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="col-span-2 mt-2 bg-[#2788E3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center font-semibold"
              >
                {loading ? <FiLoader className="animate-spin" /> : <FiPlus />} <span>Add Billing Entry</span>
              </button>
            </form>
          </div>
        </section>

        {/* Section 2: Today's Transactions */}
        <TodaysTransaction/>

        {/* external bill modal */}
        {externalBilling && (
          <ExternalBilling 
          onClose={() => setExternalBilling(false)} 
          />
        )}

        {patientHistory && (
          <PatientPaymentHistory
            onClose={() => setPatientHistory(false)}
          />
        )}

      </main>
    </div>
  );
};