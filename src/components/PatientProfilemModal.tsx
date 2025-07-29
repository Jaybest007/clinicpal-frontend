import { FaTimes } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";




export interface patientInfo {
  full_name: string;
  patient_id: string;
  address: string;
  phone: string;
  age: number;
  admission_status: boolean;
  admission_reason: string;
  visit_on: string;
  visit_reason: string;
  discharged_on: string;
  admitted_on: string;
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
  nextOfKinList?: nextOfKinData[]; // <-- Accept nextOfKinList as prop
}

const PatientProfileModal = ({ isOpen, onClose, patient, nextOfKinList }: Props) => {
  const {
    nextOfKinData,
    admitPatient,
    loading,
    fetch_Admitted_Patient_Report,
    fetchAllPatients,
    quePatient, fetchQueList
  } = useDashboard();
  const { user } = useAuth();

  const [nextOfKin, setNextOfKin] = useState<nextOfKinData | null>(null);
  const [admissionReason, setAdmissionReason] = useState("");
  const [visitationReason, setVisitationReason] = useState("");
  const [wrote_by, setWrote_by] = useState("");
  const [error, setError] = useState("");

  // Online/offline state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // toast.success("You are online. Using live data.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      // toast.warn("You are offline. Using locally saved data.");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch local patients when offline
  // Fetch local patients when offline
  useEffect(() => {
    if (!isOnline) {
      fetchAllPatients();
    }
  }, [isOnline]);
  useEffect(() => {
    if (user?.name) {
      setWrote_by(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    if (!isOpen || !patient?.patient_id) {
      setNextOfKin(null);
      setAdmissionReason("");
      setVisitationReason("");
      setError("");
      return;
    }

    // Use local nextOfKinList if offline, else use context nextOfKinData
    const kinSource = !isOnline && nextOfKinList ? nextOfKinList : nextOfKinData;
    const match = kinSource?.find(
      (kin) => kin.patient_id.toLowerCase() === patient.patient_id.toLowerCase()
    );
    setNextOfKin(match || null);
  }, [isOpen, patient, nextOfKinData, nextOfKinList, isOnline]);


  if (!isOpen || !patient) return null;

  const handleAdmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (admissionReason.trim() === "") {
      setError("Admission Reason or condition is required");
      return;
    }
    try {
      await admitPatient({
        patient_id: patient.patient_id,
        reason: admissionReason,
        wrote_by,
      });
      setAdmissionReason("");
      fetch_Admitted_Patient_Report();
      fetchAllPatients();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to admit patient";
      setError(msg);
    }
  };
//============= que patient ============
  const handleQue = async (event: React.FormEvent) => {
    event.preventDefault();
    if (visitationReason.trim() === "") {
      setError("Visitation Reason is required");
      return;
    }
    try {
      await quePatient({
        patient_id: patient.patient_id,
        reason: visitationReason,
        wrote_by,
      });
      setVisitationReason("");
      fetchQueList();
      fetchAllPatients();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to add to queue";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-2 py-8 overflow-y-auto">
      <div className="relative w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 animate-fade-in mt-5">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 tracking-tight">Patient Profile</h2>
          <p className="text-xs text-gray-500 mt-1">
            Patient ID: <span className="font-mono">{patient.patient_id.toUpperCase()}</span>
          </p>
          {patient.admission_status === true && (
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-md mt-2 ring-1 ring-yellow-500">
              Admitted
            </span>
          )}
        </div>

        <div className="px-6 py-5 text-gray-700 text-[15px] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Full Name:</span> <span className="font-medium text-gray-800">{patient.full_name}</span></div>
                <div><span className="text-gray-500">Age:</span> <span className="font-medium">{patient.age}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{patient.phone}</span></div>
                <div><span className="text-gray-500">Address:</span> <span className="font-medium">{patient.address}</span></div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide">Next of Kin</h3>
              {nextOfKin ? (
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{nextOfKin.full_name}</span></div>
                  <div><span className="text-gray-500">Relationship:</span> <span className="font-medium text-gray-800">{nextOfKin.relationship}</span></div>
                  <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-800">{nextOfKin.phone}</span></div>
                  <div><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-800">{nextOfKin.address}</span></div>
                </div>
              ) : (
                <p className="text-red-500 text-sm">No next of kin record found for this patient.</p>
              )}
            </section>
          </div>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide border-b pb-1">Visit Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Last visit</p>
                <p className="font-medium text-gray-800">
                  {patient.visit_on ? new Date(patient.visit_on).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">N/A</span>}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Visit Reason</p>
                <p className="font-medium text-gray-800">{patient.visit_reason || <span className="text-gray-400">N/A</span>}</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide border-b pb-1">Admission Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Last Admission</p>
                <p className="font-medium text-gray-800">
                  {patient.admitted_on ? new Date(patient.admitted_on).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">N/A</span>}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Admission Reason</p>
                <p className="font-medium text-gray-800">{patient.admission_reason || <span className="text-gray-400">N/A</span>}</p>
              </div>
              <div>
                <p className="text-gray-500">Discharged On</p>
                <p className="font-medium text-gray-800">
                  {patient.admission_status === true ? "Still in taking treatment" : patient.discharged_on ? new Date(patient.discharged_on).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">N/A</span>}
                </p>
              </div>
            </div>
             <Link to={`/reports/${patient.patient_id}`} className="inline-block bg-gray-100 hover:bg-gray-200 text-blue-700 rounded-md px-4 py-2 text-sm font-medium">
              🧞 Read Patient Report
            </Link>
          </section>
         

          {user?.role === "doctor" && (
            <section className="space-y-3 border-t pt-4">
              <form onSubmit={handleAdmit} className="space-y-2">
                <label htmlFor="admissionReason" className="block text-sm text-gray-600">Admission Condition <span className="text-red-500">*</span></label>
                <input
                  id="admissionReason"
                  type="text"
                  placeholder="e.g. Severe malaria"
                  value={admissionReason}
                  onChange={(e) => { setAdmissionReason(e.target.value); setError(""); }}
                  className="w-full bg-gray-50 ring-1 ring-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {error && <p className="bg-red-50 ring-1 ring-red-300 text-red-500 rounded-sm p-1 text-center text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-yellow-600 hover:bg-yellow-700 text-white rounded-md px-5 py-2 font-medium shadow-sm transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Admitting..." : "Admit Patient"}
                </button>
              </form>
            </section>
          )}

          <section className="space-y-3 border-t pt-4">
            <form onSubmit={handleQue} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide pb-1">Add to Visit Queue</h3>
              <label htmlFor="visitationReason" className="block text-sm text-gray-600">Visitation Reason <span className="text-red-500">*</span></label>
              <input
                id="visitationReason"
                type="text"
                placeholder="e.g. Follow-up consultation"
                value={visitationReason}
                onChange={(e) => { setVisitationReason(e.target.value); setError(""); }}
                className="w-full bg-gray-50 ring-1 ring-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {error && <p className="bg-red-50 ring-1 ring-red-300 text-red-500 rounded-sm p-1 text-center text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 font-medium shadow-sm transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Adding to Queue..." : "Add to Queue"}
              </button>
            </form>
          </section>
        </div>

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
