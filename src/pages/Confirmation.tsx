import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { FiPrinter, FiUser, FiMapPin, FiPhone, FiArrowRight, FiClipboard } from "react-icons/fi";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react"; // Updated import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmationPage: React.FC = () => {
  const { newPatient, setNewPatient } = useDashboard();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  // Redirect only after mount to avoid React render issues
  useEffect(() => {
    if (
      !newPatient ||
      typeof newPatient !== "object" ||
      !("full_name" in newPatient) ||
      !("address" in newPatient) ||
      !("patient_id" in newPatient) ||
      !("phone" in newPatient)
    ) {
      navigate("/patients", { replace: true });
    }
  }, [newPatient, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (
    !newPatient ||
    typeof newPatient !== "object" ||
    !("full_name" in newPatient) ||
    !("address" in newPatient) ||
    !("patient_id" in newPatient) ||
    !("phone" in newPatient)
  )
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm p-4 print:bg-white print:p-0">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative border border-blue-100 overflow-hidden print:shadow-none print:border-0"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 print:bg-blue-600">
          <div className="flex justify-between items-center">
            <h1 className="text-white font-bold text-xl">ClinicPal</h1>
            <button
              onClick={() => navigate("/patients", { replace: true })}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-blue-500/20 transition-colors print:hidden"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Success Message */}
        <div className="flex flex-col items-center p-6 pb-0">
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-green-400 rounded-full p-3 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-4 text-center">
            Registration Successful!
          </h2>
          <p className="text-center text-gray-600 mt-1 mb-4">
            Patient has been registered successfully in the system
          </p>
        </div>
        
        {/* Patient ID Card */}
        <div className="mx-6 mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl overflow-hidden border border-blue-200">
          <div className="bg-blue-600 py-3 px-4">
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase">Patient Information</h3>
          </div>
          
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* QR Code Section - FIXED */}
              <div className="flex flex-col items-center">
                <div 
                  className="bg-white p-2 rounded-lg shadow-sm border border-blue-200 mb-2"
                  onClick={() => setShowQR(!showQR)}
                >
                  <QRCodeSVG 
                    value={`CLINICPAL
                    ID: ${String(newPatient.patient_id).toUpperCase()}
                    Name: ${String(newPatient.full_name)}
                    Phone: ${String(newPatient.phone)}
                    Date: ${new Date().toLocaleDateString()}`} 
                    size={120} // Increased size for better scanning
                    level="H" // High error correction
                    includeMargin={true}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-500 text-center">
                  Scan to access patient details
                </span>
              </div>
              
              {/* Patient Details */}
              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiUser className="mt-0.5 w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Full Name</div>
                      <div className="font-bold text-gray-900">{String(newPatient.full_name).toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="mt-0.5 w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Address</div>
                      <div className="text-gray-700">{String(newPatient.address)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiPhone className="mt-0.5 w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Phone Number</div>
                      <div className="text-gray-700">{String(newPatient.phone)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-gray-500 font-medium mb-1">Patient ID</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-700 text-white px-3 py-2 rounded-md font-mono font-bold tracking-wider text-sm select-all">
                      {String(newPatient.patient_id).toUpperCase()}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(String(newPatient.patient_id).toUpperCase());
                        toast.success("Patient ID copied to clipboard");
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Copy to clipboard"
                    >
                      <FiClipboard className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600/10 px-5 py-3 border-t border-blue-200">
            <p className="text-xs text-blue-700 font-medium">
              Please keep this information for future reference. The Patient ID is required for all future visits.
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-white border border-blue-300 text-blue-700 px-4 py-3 rounded-lg shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FiPrinter className="w-5 h-5" />
            Print Details
          </button>
          
          <button
            onClick={() => { 
              navigate("/patients", { replace: true }); 
              setNewPatient([]); 
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 font-medium"
          >
            Go to Patients
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      
      {/* Print-optimized version - with improved mobile support */}
      <div className="hidden print:block print:p-8 my-8 sm:my-12">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">ClinicPal Patient Registration</h1>
          <p className="text-gray-600">Registration Date: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="border-2 border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Patient Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-bold">{String(newPatient.full_name).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{String(newPatient.address)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p>{String(newPatient.phone)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center mt-4 sm:mt-0">
              <p className="text-sm text-gray-500 mb-2">Patient ID</p>
              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-3 text-center">
                <p className="font-mono text-lg sm:text-xl font-bold">{String(newPatient.patient_id).toUpperCase()}</p>
              </div>
              <div className="mt-4">
                <QRCodeSVG 
                  value={`CLINICPAL
                  ID: ${String(newPatient.patient_id).toUpperCase()}
                  Name: ${String(newPatient.full_name)}
                  Phone: ${String(newPatient.phone)}
                  Date: ${new Date().toLocaleDateString()}`}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>This document serves as proof of registration at ClinicPal system.</p>
          <p className="mt-1">Please keep this information for future reference.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;