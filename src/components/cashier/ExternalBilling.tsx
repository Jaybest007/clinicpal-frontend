import OrderModal from "../OrderModal";
import { useState } from "react";
import { FiLoader, FiPlus } from "react-icons/fi";
import { useDashboard } from "../../context/DashboardContext";

type BillingData = {
  payers_name: string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  notes: string;
};

type Errors = {
  payers_name?: string;
  department?: string;
  service?: string;
  amount?: string;
  payment_method?: string;
  notes?: string;
};

type ExternalBillingProps = {
  onClose: () => void;
};

export function ExternalBilling({ onClose }: ExternalBillingProps) {
  const { externalBillingLoading, externalBilling, fetchExternalBilling } = useDashboard();

  const [errors, setErrors] = useState<Errors>({});
  const [billingData, setBillingData] = useState<BillingData>({
    payers_name: "",
    department: "",
    service: "",
    amount: 0,
    payment_method: "",
    notes: ""
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value
    }));
  }

  async function handleExternalBillingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: Errors = {};
    if (!billingData.payers_name) newErrors.payers_name = "Payer's name is required";
    if (!billingData.department) newErrors.department = "Department is required";
    if (!billingData.service) newErrors.service = "Service is required";
    if (billingData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!billingData.payment_method) newErrors.payment_method = "Payment method is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
      
      try {
        await externalBilling(billingData);
        setBillingData({
          payers_name: "",
          department: "",
          service: "",
          amount: 0,
          payment_method: "",
          notes: ""
        });
        setErrors({});
        await fetchExternalBilling();
        onClose();
      } catch (error) {
        
        // Handle error appropriately, e.g., show a notification
      }
    }
  }

  return (
    <OrderModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-blue-900 mb-5 text-center tracking-tight">
        External Customer Billing
      </h2>
      <form
        onSubmit={handleExternalBillingSubmit}
        className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payer's Name */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payer's Name
        </label>
        <input
          type="text"
          name="payers_name"
          placeholder="e.g., John Doe"
          value={billingData.payers_name}
          onChange={handleInputChange}
          autoComplete="off"
          className={`w-full px-3 py-2 text-sm border ${
            errors.payers_name ? "border-red-500" : "border-slate-300"
          } rounded-md focus:ring-2 focus:ring-blue-200 outline-none`}
        />
        {errors.payers_name && (
          <p className="text-xs text-red-500 mt-1">{errors.payers_name}</p>
        )}
          </div>

          {/* Department */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <select
          name="department"
          value={billingData.department}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 text-sm border ${
            errors.department ? "border-red-500" : "border-slate-300"
          } rounded-md focus:ring-2 focus:ring-blue-200 outline-none bg-white`}
        >
          <option value="" disabled>Select department</option>
          <option value="lab">Lab</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="ultrasound">Ultrasound</option>
          <option value="radiology">Radiology</option>
          <option value="mortuary">Mortuary</option>
        </select>
        {errors.department && (
          <p className="text-xs text-red-500 mt-1">{errors.department}</p>
        )}
          </div>

          {/* Service */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service
        </label>
        <input
          type="text"
          name="service"
          placeholder="e.g., X-ray, Lab Test"
          value={billingData.service}
          onChange={handleInputChange}
          autoComplete="off"
          className={`w-full px-3 py-2 text-sm border ${
            errors.service ? "border-red-500" : "border-slate-300"
          } rounded-md focus:ring-2 focus:ring-blue-200 outline-none`}
        />
        {errors.service && (
          <p className="text-xs text-red-500 mt-1">{errors.service}</p>
        )}
          </div>

          {/* Amount */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (₦)
        </label>
        <input
          type="text"
          name="amount"
          placeholder="₦ 0.00"
          value={billingData.amount === 0 ? "" : billingData.amount}
          onChange={handleInputChange}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          className={`w-full px-3 py-2 text-sm border ${
            errors.amount ? "border-red-500" : "border-slate-300"
          } rounded-md focus:ring-2 focus:ring-blue-200 outline-none`}
        />
        {errors.amount && (
          <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
        )}
          </div>

          {/* Payment Method */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>
        <select
          name="payment_method"
          value={billingData.payment_method}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 text-sm border ${
            errors.payment_method ? "border-red-500" : "border-slate-300"
          } rounded-md focus:ring-2 focus:ring-blue-200 outline-none bg-white`}
        >
          <option value="" disabled>Select payment method</option>
          <option value="cash">Cash</option>
          <option value="pos">POS</option>
          <option value="transfer">Transfer</option>
          <option value="other">Other</option>
        </select>
        {errors.payment_method && (
          <p className="text-xs text-red-500 mt-1">{errors.payment_method}</p>
        )}
          </div>

          {/* Notes */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          name="notes"
          placeholder="Any remarks..."
          value={billingData.notes}
          onChange={handleInputChange}
          autoComplete="off"
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none"
        />
        {errors.notes && (
          <p className="text-xs text-red-500 mt-1">{errors.notes}</p>
        )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
        type="submit"
        disabled={externalBillingLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
          >
        {externalBillingLoading ? <FiLoader className="animate-spin" /> : <FiPlus />}
        <span>Add Billing Entry</span>
          </button>
        </div>
      </form>

    </OrderModal>
  );
}
