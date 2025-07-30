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

  // Fallbacks for external billing data
  const patientId = tx.patient_id ? tx.patient_id.toUpperCase() : "N/A";
  const createdBy = tx.created_by || tx.receipt_by || "N/A";
  const hospitalId = tx.hospital_id || "External";
  const department = tx.department || "N/A";
  const payersName = tx.payers_name || "N/A";
  const description = tx.description || tx.service || "N/A";
  const paymentMethod = tx.payment_method || "N/A";
  const paymentStatus = tx.payment_status || "paid";
  const amount = tx.amount || 0;
  const createdAt = tx.created_at ? new Date(tx.created_at).toLocaleString() : "N/A";
  const referenceId = tx.id || tx.reference_id || "N/A";

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-300 print:shadow-none print:border-0 print:rounded-none print:max-w-full print:mt-0 print:p-0">
      {/* Header Branding */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-2xl font-bold tracking-wide text-gray-900">
          ClinicPal Health Services
        </span>
        <span className="text-xs text-gray-500 italic">{hospitalId}</span>
      </div>

      {/* Meta Info */}
      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Date</span>
          <span>{createdAt}</span>
        </div>
        <div className="flex justify-between">
          <span>Receipt By</span>
          <span>{createdBy}</span>
        </div>
        <div className="flex justify-between">
          <span>Reference ID</span>
          <span className="text-xs text-gray-400 italic">{referenceId}</span>
        </div>
      </div>

      <hr className="my-2 border-dashed border-gray-300" />

      {/* Payee Info */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between text-base font-semibold text-gray-700">
          <span>Payers's Name</span>
          <span>{payersName}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Patient ID</span>
          <span>{patientId}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Department</span>
          <span>{department}</span>
        </div>
      </div>

      <hr className="my-2 border-dashed border-gray-300" />

      {/* Billing Details */}
      <div className="mb-4 space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Description</span>
          <span>{description}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Method</span>
          <span className="capitalize">{paymentMethod}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Status</span>
          <span className="text-gray-600">
            <span className="flex items-center gap-1">
              {paymentStatus === "paid" ? (
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
        <span>₦{Number(amount).toLocaleString()}</span>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-gray-500 border-t border-dashed pt-2">
        Thank you for your patronage. <br />
        <span className="font-semibold text-gray-600 italic">Powered by ClinicPal</span>
      </div>
    </div>
  );
}
