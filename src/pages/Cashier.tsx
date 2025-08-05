import { useEffect, useState } from "react";
import { FiPlus, FiDollarSign, FiClock, } from "react-icons/fi";


import { useDashboard } from "../context/DashboardContext";

import NavBar from "../components/NavBar";
import SearchPatientReport from "../components/SearchPatientReport";
import { TodaysTransaction } from "../components/TodaysTransaction";

import { ExternalBilling } from "../components/ExternalBilling";

import { PatientPaymentHistory } from "../components/PatientPaymentHistory";
import { CashierStatCard } from "../components/cashier/CashierStatCard";
import { BillingForm } from "../components/cashier/BillingForm";


export interface BillingDetails {
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
  [key: string]: string | undefined;
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
  const [formSubmitted, setFormSubmitted] = useState(false);
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
      payers_name: billingData.payers_name.trim() ? "" : "Payer's name is required.",
      patient_id: billingData.patient_id.trim() ? "" : "Patient ID is required.",
      department: billingData.department.trim() ? "" : "Department is required.",
      service: billingData.service.trim() ? "" : "Service is required.",
      amount: billingData.amount > 0 ? "" : "Amount must be greater than 0.",
      payment_method: billingData.payment_method.trim() ? "" : "Payment method is required.",
      payment_status: billingData.payment_status ? "" : "Payment status is required.",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      return;
    }

    try {
      await newBilling(billingData);
      fetchTransactions();
      setFormSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
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
        setFormSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting billing data:", error);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  
  
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <NavBar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Enhanced Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm 
                         flex flex-col md:flex-row items-center justify-between 
                         px-5 py-4 mb-6 rounded-xl transition-all duration-200">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 
                          bg-clip-text text-transparent">
              Cashier Dashboard
            </h1>
          </div>
          <div className="flex flex-row items-center gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={() => setExternalBilling(true)}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-blue-500 
                         hover:bg-blue-600 text-white text-xs md:text-sm font-medium shadow-sm 
                         hover:shadow transition-all duration-200 flex-1 md:flex-none"
            >
              <FiPlus className="w-3.5 h-3.5 md:w-4 md:h-4" /> External Billing
            </button>
            <button
              onClick={() => setPatientHistory(true)}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-yellow-500 
                         hover:bg-yellow-600 text-white text-xs md:text-sm font-medium shadow-sm 
                         hover:shadow transition-all duration-200 flex-1 md:flex-none"
            >
              <FiClock className="w-3.5 h-3.5 md:w-4 md:h-4" /> Patient History
            </button>
          </div>
        </header>

        {/* Enhanced Stats Card */}
        <div className="mb-6 md:mb-8">
          <CashierStatCard />
        </div>

        {/* Enhanced Search & Billing Section */}
        <section className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <SearchPatientReport />

          {/* Premium Billing Form */}
          <BillingForm 
            billingData={billingData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBillingSubmit={handleBillingSubmit}
            loading={loading}
            formSubmitted={formSubmitted}
            formatCurrency={formatCurrency}
          />
          
        </section>

        {/* Enhanced Transactions Section */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          <TodaysTransaction />
        </div>

        {/* Modals */}
        {externalBilling && (
          <ExternalBilling onClose={() => setExternalBilling(false)} />
        )}

        {patientHistory && (
          <PatientPaymentHistory onClose={() => setPatientHistory(false)} />
        )}
      </main>
    </div>
  );
};