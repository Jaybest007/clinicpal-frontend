import React from 'react';
import { motion } from "framer-motion";
import { FiClipboard, FiLoader, FiPlus, FiCreditCard, FiArchive } from "react-icons/fi";

// Streamlined form field component
const FormField = ({ id, label, required = false, error, children }: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-medium text-gray-600 flex items-center">
      {required && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>}
      {label}
    </label>
    {children}
    {error && (
      <motion.span 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 flex items-center"
      >
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </motion.span>
    )}
  </div>
);

// Streamlined input field
const InputField = ({ 
  id, name, value, onChange, placeholder, error, icon, pattern, inputMode
}: { 
  id: string; 
  name: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder: string;
  error?: string;
  icon?: React.ReactNode;
  pattern?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "url" | "search" | "none";
}) => (
  <div className="relative">
    {icon && (
      <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
        {icon}
      </div>
    )}
    <input
      id={id}
      className={`${icon ? 'pl-8' : 'px-3'} pr-3 py-2 border ${
        error ? "border-red-300 bg-red-50" : "border-gray-200"
      } rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 focus:ring-1`}
      placeholder={placeholder}
      name={name}
      value={value === 0 ? "" : value}
      onChange={onChange}
      pattern={pattern}
      inputMode={inputMode}
    />
  </div>
);

// Streamlined select field
const SelectField = ({ id, name, value, onChange, options, error, icon }: { 
  id: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  options: { value: string; label: string; disabled?: boolean }[];
  error?: string;
  icon?: React.ReactNode;
}) => (
  <div className="relative">
    {icon && (
      <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
        {icon}
      </div>
    )}
    <select
      id={id}
      className={`${icon ? 'pl-8' : 'px-3'} pr-8 py-2 border appearance-none ${
        error ? "border-red-300 bg-red-50" : "border-gray-200"
      } rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 focus:ring-1`}
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

interface BillingFormProps {
  billingData: {
    payers_name: string;
    patient_id: string;
    department: string;
    service: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    notes: string;
  };
  errors: {
    payers_name?: string;
    patient_id?: string;
    department?: string;
    service?: string;
    amount?: string;
    payment_method?: string;
    payment_status?: string;
    [key: string]: string | undefined;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBillingSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  formSubmitted: boolean;
  formatCurrency: (amount: number) => string;
}

export const BillingForm = ({
  billingData,
  errors,
  handleInputChange,
  handleBillingSubmit,
  loading,
  formSubmitted,
  formatCurrency,
}: BillingFormProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Compact header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-md">
              <FiClipboard className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-medium text-gray-800 leading-tight">Add New Billing</h2>
              <p className="text-xs text-gray-500">Enter payment details</p>
            </div>
          </div>
        </div>
      </div>
      
      <form className="p-4" onSubmit={handleBillingSubmit}>
        {/* Grid layout for all fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          {/* Row 1: Customer Information */}
          <div className="col-span-2 pb-1 border-b border-gray-100">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Customer Information</h3>
          </div>
          
          <FormField id="payers_name" label="Payer's Name" required error={errors.payers_name}>
            <InputField
              id="payers_name"
              name="payers_name"
              value={billingData.payers_name}
              onChange={handleInputChange}
              placeholder="Enter payer's full name"
              error={errors.payers_name}
            />
          </FormField>
          
          <FormField id="patient_id" label="Patient ID" required error={errors.patient_id}>
            <InputField
              id="patient_id"
              name="patient_id"
              value={billingData.patient_id}
              onChange={handleInputChange}
              placeholder="Enter patient ID"
              error={errors.patient_id}
            />
          </FormField>
          
          {/* Row 2: Service Details */}
          <div className="col-span-2 pb-1 border-b border-gray-100 mt-1">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Service Details</h3>
          </div>
          
          <FormField id="department" label="Department" required error={errors.department}>
            <SelectField
              id="department"
              name="department"
              value={billingData.department}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select department", disabled: true },
                { value: "lab", label: "Laboratory" },
                { value: "pharmacy", label: "Pharmacy" },
                { value: "consult", label: "Consultation" },
                { value: "ultrasound", label: "Ultrasound" },
                { value: "xray", label: "X-Ray" },
                { value: "mortuary", label: "Mortuary" }
              ]}
              error={errors.department}
              icon={
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
          </FormField>
          
          <FormField id="service" label="Service" required error={errors.service}>
            <InputField
              id="service"
              name="service"
              value={billingData.service}
              onChange={handleInputChange}
              placeholder="Describe service provided"
              error={errors.service}
              icon={
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
          </FormField>
          
          {/* Row 3: Payment Details */}
          <div className="col-span-2 pb-1 border-b border-gray-100 mt-1">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Payment Details</h3>
          </div>
          
          <FormField id="amount" label="Amount" required error={errors.amount}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 font-medium">₦</span>
              </div>
              <input
                id="amount"
                className={`pl-7 pr-3 py-2 border ${
                  errors.amount ? "border-red-300 bg-red-50" : "border-gray-200"
                } rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 focus:ring-1`}
                placeholder="0.00"
                name="amount"
                value={billingData.amount === 0 ? "" : billingData.amount}
                onChange={handleInputChange}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            {billingData.amount > 0 && !errors.amount && (
              <span className="text-xs text-gray-500 inline-block mt-0.5">
                {formatCurrency(billingData.amount)}
              </span>
            )}
          </FormField>
          
          <FormField id="payment_method" label="Payment Method" required error={errors.payment_method}>
            <SelectField
              id="payment_method"
              name="payment_method"
              value={billingData.payment_method}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select payment method", disabled: true },
                { value: "cash", label: "Cash" },
                { value: "pos", label: "POS" },
                { value: "transfer", label: "Transfer" },
                { value: "other", label: "Other" }
              ]}
              error={errors.payment_method}
              icon={<FiCreditCard className="w-4 h-4 text-gray-500" />}
            />
          </FormField>
          
          {/* Payment Status - Updated to be required */}
          <FormField id="payment_status" label="Payment Status" required error={errors.payment_status}>
            <SelectField
              id="payment_status"
              name="payment_status"
              value={billingData.payment_status}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select status", disabled: true },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "Unpaid" },
                { value: "partially_paid", label: "Partially Paid" }
              ]}
              error={errors.payment_status}
              icon={<FiArchive className="w-4 h-4 text-gray-500" />}
            />
          </FormField>
          
          <FormField id="notes" label="Notes (Optional)">
            <InputField
              id="notes"
              name="notes"
              value={billingData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes"
              icon={
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </FormField>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            disabled={loading || formSubmitted}
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 
                    hover:from-blue-600 hover:to-blue-700 text-white
                    rounded-lg flex items-center gap-2 justify-center font-medium
                    shadow-sm hover:shadow transition-all duration-300
                    disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : formSubmitted ? (
              <>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Billing Added Successfully!</span>
              </>
            ) : (
              <>
                <FiPlus className="w-4 h-4" />
                <span>Add Billing Entry</span>
              </>
            )}
          </button>
          
          {/* Compact footer message */}
          <div className="text-center text-xs text-gray-500 mt-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mx-1 align-middle"></span> Required fields
          </div>
        </div>
      </form>
    </div>
  );
};