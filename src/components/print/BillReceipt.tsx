import { useEffect } from "react";
import { BsCheckCircle, BsXCircle, BsPrinter, BsArrowLeft } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export function BillReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = location.state;
  
  useEffect(() => {
    document.title = `Receipt - ${tx?.payers_name || "Patient"} - ClinicPal`;
  }, [tx]);

  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center p-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full text-center"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-2">No Receipt Data</h2>
          <p className="text-gray-600 mb-4">No billing information available.</p>
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto text-sm"
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft /> Back
          </button>
        </motion.div>
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
  const notes = tx.notes || "";

  // Format date for better display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  const qrData = `CLINICPAL RECEIPT
    REF: ${referenceId}
    AMOUNT: ₦${Number(amount).toLocaleString()}
    PAYER: ${payersName}
    PATIENT: ${patientId}
    DATE: ${formatDate(createdAt)}
    STATUS: ${paymentStatus.toUpperCase()}`;



  return (
    <div className="bg-white py-4 px-2 print:p-0 print:m-0">
      {/* Screen-only controls */}
      <div className="max-w-sm mx-auto mb-3 flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1"
        >
          <BsArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
        >
          <BsPrinter size={14} /> Print
        </button>
      </div>
      
      {/* Receipt Document */}
      <div className="max-w-sm mx-auto bg-white border border-gray-200 print:border-0 print:shadow-none print:m-0">
        {/* Header */}
        <div className="border-b border-gray-200 p-3 print:p-2">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">
              ClinicPal Health Services
            </h1>
            <p className="text-xs text-gray-500">{hospitalId}</p>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium inline-block mt-1 print:bg-transparent print:border print:border-blue-300">
              RECEIPT
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-3 print:p-2">
          {/* Meta Information */}
          <div className="flex justify-between text-xs mb-3">
            <div>
              <p className="text-gray-500 uppercase">Date</p>
              <p className="font-medium">{formatDate(createdAt)}</p>
              
              <p className="text-gray-500 uppercase mt-1">Receipt By</p>
              <p className="font-medium">{createdBy}</p>
            </div>
            
            <div className="text-right">
              <p className="text-gray-500 uppercase">Reference ID</p>
              <p className="font-mono">{referenceId}</p>
              
              <div className="mt-1 hidden sm:block print:block">
                <QRCodeSVG 
                  value={qrData}
                  size={80}
                  level="M"
                  className="ml-auto"
                />
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="border border-gray-200 rounded p-2 mb-3 bg-gray-50 print:bg-white">
            <p className="text-xs font-medium mb-1 text-gray-700">Customer Information</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <div>
                <p className="text-gray-500">Payer's Name</p>
                <p className="font-medium">{payersName}</p>
              </div>
              <div>
                <p className="text-gray-500">Patient ID</p>
                <p className="font-mono">{patientId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Department</p>
                <p className="capitalize">{department}</p>
              </div>
            </div>
          </div>
          
          {/* Service Details */}
          <div className="mb-3">
            <p className="text-xs font-medium mb-1 text-gray-700">Service Details</p>
            <table className="w-full text-xs border-t border-b border-gray-200">
              <thead>
                <tr className="bg-gray-50 print:bg-white">
                  <th className="text-left py-1 px-2 text-gray-500">Description</th>
                  <th className="text-right py-1 px-2 text-gray-500 w-20">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-1 px-2">
                    <p>{description}</p>
                    {notes && <p className="text-gray-500 text-xs mt-0.5">{notes}</p>}
                  </td>
                  <td className="py-1 px-2 text-right">₦{Number(amount).toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50 print:bg-white">
                  <td className="py-1 px-2 font-medium">Total</td>
                  <td className="py-1 px-2 text-right font-bold">₦{Number(amount).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Payment Information */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="border border-gray-200 rounded p-2">
              <p className="font-medium text-gray-700 mb-1">Payment Method</p>
              <p className="capitalize">{paymentMethod}</p>
            </div>
            
            <div className="border border-gray-200 rounded p-2">
              <p className="font-medium text-gray-700 mb-1">Payment Status</p>
              <div className="flex items-center gap-1">
                {paymentStatus === "paid" ? (
                  <>
                    <BsCheckCircle className="text-green-600" size={12} />
                    <span className="font-medium text-green-700">PAID</span>
                  </>
                ) : (
                  <>
                    <BsXCircle className="text-red-600" size={12} />
                    <span className="font-medium text-red-700">UNPAID</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center border-t border-dashed border-gray-200 pt-2 text-xs">
            <p className="text-gray-600">Thank you for your patronage.</p>
            <p className="text-gray-500 mt-0.5">For questions, contact our accounts department.</p>
            
            {/* Larger QR Code for easy scanning */}
            <div className="flex justify-center my-4">
              <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
                <QRCodeSVG 
                  value={qrData}
                  size={140}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>
            
            <p className="mt-1 text-xs text-blue-700">Powered by ClinicPal</p>
          </div>
        </div>
      </div>
      
      {/* Print timestamp */}
      <div className="hidden print:block text-center text-xs text-gray-400 mt-1">
        {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
