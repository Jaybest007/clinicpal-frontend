import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

export function BillReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = location.state;

  if (!tx) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold mb-4">No bill data to print.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-300 print:shadow-none print:border-0 print:rounded-none print:max-w-full print:mt-0 print:p-0">
      {/* Header Branding */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-2xl font-bold tracking-wide text-gray-900">
          ClinicPal Health Services
        </span>
        <span className="text-xs text-gray-500 italic">{tx.hospital_id}</span>
      </div>

      {/* Meta Info */}
      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Date</span>
          <span>{new Date(tx.created_at).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Receipt By</span>
          <span>{tx.created_by}</span>
        </div>
        <div className="flex justify-between">
          <span>Reference ID</span>
          <span className="text-xs text-gray-400 italic">{tx.id}</span>
        </div>
      </div>

      <hr className="my-2 border-dashed border-gray-300" />

      {/* Payee Info */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between text-base font-semibold text-gray-700">
          <span>Payers's Name</span>
          <span>{tx.payers_name}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Patient ID</span>
          <span>{tx.patient_id.toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Department</span>
          <span>{tx.department}</span>
        </div>
      </div>

      <hr className="my-2 border-dashed border-gray-300" />

      {/* Billing Details */}
      <div className="mb-4 space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Description</span>
          <span>{tx.description}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Method</span>
          <span className="capitalize">{tx.payment_method}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Status</span>
          <span
            className= "text-gray-600"
          >
            <span className="flex items-center gap-1">
                {tx.payment_status && tx.payment_status === "paid" ? (
                    <>
                        <BsCheckCircle className="text-green-600 text-lg" />
                        <span>PAID</span>
                    </>
                ) : (
                    <>
                        <BsXCircle className="text-red-500 text-lg" />
                        <span>UNPAID</span>
                    </>
                )}
            </span>
          </span>
        </div>
      </div>

      <hr className="my-2 border-dashed border-gray-300" />

      {/* Total */}
      <div className="flex justify-between items-center mt-4 font-bold text-lg text-gray-800">
        <span>Total</span>
        <span>₦{Number(tx.amount).toLocaleString()}</span>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-gray-500 border-t border-dashed pt-2">
        Thank you for your patronage. <br />
        <span className="font-semibold text-gray-600 italic">Powered by ClinicPal</span>
      </div>
    </div>
  );
}
