import { FaTimes } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Types
interface patientInfo {
  full_name: string;
  patient_id: string;
  address: string;
  phone: string;
  age: number;
  admission_status: number;
}

interface nextOfKinData {
  id: number;
  full_name: string;
  address: string;
  phone: string;
  relationship: string;
  patient_id: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: patientInfo | null;
}

const PatientProfileModal = ({ isOpen, onClose, patient }: Props) => {
  const { nextOfKinData, admitPatient, loading } = useDashboard();
  const {user} = useAuth()
  const [nextOfKin, setNextOfKin] = useState<nextOfKinData | null>(null);
  const [admissionReason, setAdmissionReason] = useState("");
  const [wrote_by, setWrote_by] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
  if (user?.name) {
    setWrote_by(user.name );
  }
  },[]) 

  useEffect(() => {
  if (!isOpen || !patient?.patient_id || !nextOfKinData) {
    setNextOfKin(null);
    return;
  }

  //====filter and find patiet
  const match = nextOfKinData.find(
    (kin) => kin.patient_id.toLowerCase() === patient.patient_id.toLowerCase()
  );
  setNextOfKin(match || null);
}, [isOpen, patient, nextOfKinData]);

  if (!isOpen || !patient) {return null};


  //======admit function=====
  async function handleAdmit(event: React.FormEvent) {
  event.preventDefault();

  if (admissionReason.trim() === "") {
    setError("Admission Reason or condition is required");
    return;
  }
  if(patient && admissionReason ){
      try {
        await admitPatient({
          patient_id: patient.patient_id,
          reason: admissionReason,
          wrote_by: wrote_by,
        });
        setAdmissionReason(""); 
      } catch (err: any) {
        const errorMessage = err?.response?.data.message || err?.response?.data.error || "Failed to admit patient";
        setError(errorMessage);
      }
  }

}



  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4 py-8">
      <div className="bg-white w-full max-w-lg md:max-w-2xl rounded-xl shadow-xl overflow-y-auto max-h-[90vh] relative animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 tracking-tight">Patient Profile</h2>
          <p className="text-xs text-gray-500 mt-1">
            Patient ID: <span className="font-mono">{patient.patient_id.toUpperCase()}</span>
          </p>
          {patient.admission_status === 1 && (
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-md mt-2 ring-1 ring-yellow-500 ">
            Admitted
          </span>
        )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-gray-700 text-[15px] space-y-6">
          {/* Patient Info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{patient.full_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </div>
          </section>

          {/* Next of Kin Info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide border-b">
              Next of Kin
            </h3>
            {nextOfKin ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{nextOfKin.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Relationship</p>
                  <p className="font-medium text-gray-800">{nextOfKin.relationship}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{nextOfKin.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{nextOfKin.address}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-sm">
                No next of kin record found for this patient.
              </p>
            )}
          </section>

          <section className="space-y-3 border-t-2">
            <form onSubmit={handleAdmit} className="mt-4 space-y-2">
              <label htmlFor="admissionReason" className="block text-sm text-gray-600">
                Admission Condition <span className="text-red-500">*</span>
              </label>
              <input
                id="admissionReason"
                type="text"
                placeholder="e.g. Severe malaria"
                value={admissionReason}
                onChange={(event) => {
                  setAdmissionReason(event.target.value);
                  setError("");
                }}
                className="w-full bg-gray-50 outline-none ring-1 ring-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm"
              />

              {error && (
                <p className="bg-red-50 ring-1 ring-red-300 text-red-500 rounded-sm p-1 text-center text-sm">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md px-5 py-2 font-medium shadow-sm transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Admitting..." : "Admit Patient"}
              </button>
            </form>

          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
