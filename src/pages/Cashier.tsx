import { useEffect, useState } from "react";
import {  FiPlus, FiRefreshCw, FiDownload, FiPrinter, FiEdit, FiX, FiLoader } from "react-icons/fi";
import { BsReceipt, BsCheckCircle, BsXCircle, BsFileText, BsFileEarmark, BsBuilding } from "react-icons/bs";
import { useDashboard } from "../context/DashboardContext";
import StatCard from "../components/StatCard";
import NavBar from "../components/NavBar";
import SearchPatientReport from "../components/SearchPatientReport";




interface BillingDetails {
  patient_name: string;
  patient_id: string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  notes: string;
}

interface BillingErrors {
  patient_name: string;
  patient_id: string;
  department: string;
  service: string;
  amount: string;
  payment_method: string;
  searchValue?: string;
}





export const Cashier = () => {
  
  const { newBilling, loading, token, transactions, fetchTransactions, } = useDashboard();
  const [billingData, setBillingData] = useState<BillingDetails>({
    patient_name: "",
    patient_id: "",
    department: "",
    service: "",
    amount: 0,
    payment_method: "",
    notes: "",
    payment_status: "",
  });
  const [errors, setErrors] = useState<BillingErrors>({
    patient_name: "",
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
      }
    }, [token, transactions, fetchTransactions]);
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

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: BillingErrors = {
      patient_name: billingData.patient_name.trim() ? "" : "Patient name is required.",
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
        patient_name: "",
        patient_id: "",
        department: "",
        service: "",
        amount: 0,
        payment_method: "",
        notes: "",
        payment_status: "",
      });
      setErrors({
        patient_name: "",
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
        {/* Stats: Use horizontal scroll on mobile */}
        <section className="flex gap-3 mb-8 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <StatCard
            title="Total Collected"
            value={`₦${(
              transactions
                .filter((tx) => String(tx.payment_status).toLowerCase() === "paid")
                .reduce((sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0), 0)
            ).toLocaleString()}`}
            icon={BsReceipt}
          />

          <StatCard title="Bills Created" value={`${transactions.length}`} icon={BsFileText} />
          <StatCard title="Unpaid Bills" value={`${transactions.filter(tx => tx.payment_status === 'unpaid').length}`} icon={BsFileEarmark} />
          <StatCard title="Departments Covered" value={`${new Set(transactions.map(tx => tx.department)).size}`} icon={BsBuilding} />
        </section>

        {/* Section 1: Search & Add Billing */}
        <section className="flex flex-col md:grid md:grid-cols-2 gap-6 mb-8">
          {/* Search Patient */}
            <SearchPatientReport />

          
          {/* Add New Billing */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-lg mb-2">Add New Billing</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleBillingSubmit}>
              <div className="flex flex-col">
                <input
                  className={`px-3 py-2 border ${errors.patient_name ? "border-red-500" : "border-slate-300"} rounded-lg text-sm`}
                  placeholder="Patient Name"
                  name="patient_name"
                  value={billingData.patient_name}
                  onChange={handleInputChange}
                />
                {errors.patient_name && (
                  <span className="text-xs text-red-600 mt-1">{errors.patient_name}</span>
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
                  <option value="radiology">Radiology</option>
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
        <section className="bg-white rounded-xl shadow p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="font-semibold text-lg">Today's Transactions</h2>
            <div className="flex flex-wrap gap-2">
              <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
                onClick={fetchTransactions}
                disabled={loading}
              >
                {loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />} <span className="hidden sm:inline">Refresh</span>
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
                <FiDownload /> <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
                <BsReceipt /> <span className="hidden sm:inline">Print Summary</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 border-b border-slate-200">#</th>
                  <th className="px-4 py-2 border-b border-slate-200">Patient Name</th>
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
                {transactions
                  .filter(tx => {
                    const txDate = new Date(tx.created_at);
                    const today = new Date();
                    return (
                      txDate.getFullYear() === today.getFullYear() &&
                      txDate.getMonth() === today.getMonth() &&
                      txDate.getDate() === today.getDate()
                    );
                  })
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((tx, index) => (
                    <tr key={tx.id} className="even:bg-slate-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{tx.patient_name}</td>
                      <td className="px-4 py-2">{tx.department}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                      <td className="px-4 py-2 font-semibold">₦{Number(tx.amount).toLocaleString()}</td>
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
                        {new Date(tx.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-xs">
                          <FiPrinter /> <span className="hidden sm:inline">Print</span>
                        </button>
                        <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded flex items-center gap-1 text-xs">
                          <FiEdit /> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1 text-xs">
                          <FiX /> <span className="hidden sm:inline">Cancel</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};