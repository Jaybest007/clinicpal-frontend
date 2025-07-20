import React, { useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";

const ConfirmationPage: React.FC = () => {
  const { newPatient, setNewPatient } = useDashboard();
  const navigate = useNavigate();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100/70 backdrop-blur-[2px] px-1 py-3">
      <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6 w-full max-w-xs sm:max-w-md md:max-w-xl relative animate-fade-in border border-blue-100">
        <button
          onClick={() => navigate("/patients", { replace: true })}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-5">
          <div className="bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-200 rounded-full p-2 shadow-lg mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.1" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-1 text-center tracking-tight drop-shadow">
            Registration Successful!
          </h2>
          <p className="text-center text-gray-600 mb-2 text-sm sm:text-base font-medium">
            Thank you for registering. Here are your details:
          </p>
        </div>
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="font-semibold text-slate-500 w-24">Name:</span>
            <span className="font-bold tracking-wide text-blue-900">
              {String(newPatient.full_name).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="font-semibold text-slate-500 w-24">Address:</span>
            <span className="font-medium">
              {String(newPatient.address).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="font-semibold text-slate-500 w-24">Phone:</span>
            <span className="font-medium">
              {String(newPatient.phone).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <span className="uppercase text-xs tracking-widest text-blue-700 font-semibold mb-1">
              Patient ID
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-white bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 shadow-lg px-6 py-3 rounded-2xl border-4 border-blue-200 select-all break-all">
              {String(newPatient.patient_id).toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 mt-2">
              Please keep this Patient ID safe!
            </span>
          </div>
        </div>
        <button
          onClick={() =>{ navigate("/patients", { replace: true }); setNewPatient([]); }}
          className="mt-8 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-3 rounded-xl shadow-lg text-base font-semibold transition-all flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 -ml-1"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 14h18M10 6h4v12h-4z"
            />
          </svg>
          Go to Patients
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;