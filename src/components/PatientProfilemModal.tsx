import { FaTimes, FaClipboard, FaUser, FaPhone,  FaUserFriends, FaCalendarAlt, FaHospital, FaClock } from "react-icons/fa";
import { FiAlertCircle,  FiUserPlus, FiFilePlus } from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

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
  nextOfKinList?: nextOfKinData[];
}

const PatientProfileModal = ({ isOpen, onClose, patient, nextOfKinList }: Props) => {
  const {
    nextOfKinData,
    admitPatient,
    loading,
    fetch_Admitted_Patient_Report,
    fetchAllPatients,
    quePatient, 
    fetchQueList
  } = useDashboard();
  const { user } = useAuth();

  const [nextOfKin, setNextOfKin] = useState<nextOfKinData | null>(null);
  const [admissionReason, setAdmissionReason] = useState("");
  const [visitationReason, setVisitationReason] = useState("");
  const [wrote_by, setWrote_by] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'queue' | 'admit'>('profile');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Online/offline state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch local patients when offline
  useEffect(() => {
    if (!isOnline) {
      fetchAllPatients();
    }
  }, [isOnline, fetchAllPatients]);

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
      setFormSubmitted(false);
      setActiveTab('profile');
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
    
    setFormSubmitted(true);
    
    try {
      await admitPatient({
        patient_id: patient.patient_id,
        reason: admissionReason,
        wrote_by,
      });
      setAdmissionReason("");
      fetch_Admitted_Patient_Report();
      fetchAllPatients();
      toast.success("Patient admitted successfully");
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to admit patient";
      setError(msg);
      setFormSubmitted(false);
    }
  };

  const handleQue = async (event: React.FormEvent) => {
    event.preventDefault();
    if (visitationReason.trim() === "") {
      setError("Visitation Reason is required");
      return;
    }
    
    setFormSubmitted(true);
    
    try {
      await quePatient({
        patient_id: patient.patient_id,
        reason: visitationReason,
        wrote_by,
      });
      setVisitationReason("");
      fetchQueList();
      fetchAllPatients();
      toast.success("Patient added to queue successfully");
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to add to queue";
      setError(msg);
      setFormSubmitted(false);
    }
  };

  const copyPatientId = () => {
    navigator.clipboard.writeText(patient.patient_id.toUpperCase());
    toast.success("Patient ID copied to clipboard");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-2 py-8 overflow-y-auto"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl border border-blue-100 overflow-hidden mt-5"
          >
            {/* Header with patient info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                  <FaUser className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{patient.full_name}</h2>
                  <div className="flex items-center mt-1 space-x-3">
                    <div className="flex items-center text-white/80 text-sm">
                      <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{patient.patient_id.toUpperCase()}</span>
                      <button 
                        onClick={copyPatientId}
                        className="ml-1 p-1 hover:bg-white/10 rounded-full"
                        title="Copy ID"
                      >
                        <FaClipboard className="w-3 h-3" />
                      </button>
                    </div>
                    {patient.admission_status && (
                      <span className="inline-flex items-center bg-yellow-500/20 text-yellow-100 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                        <FaHospital className="mr-1 w-3 h-3" /> Admitted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-3 px-4 flex items-center text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
                >
                  <FaUser className={`mr-2 h-4 w-4 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'}`} />
                  Profile
                </button>
                
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`py-3 px-4 flex items-center text-sm font-medium ${
                    activeTab === 'queue'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
                >
                  <FiUserPlus className={`mr-2 h-4 w-4 ${activeTab === 'queue' ? 'text-blue-500' : 'text-gray-400'}`} />
                  Add to Queue
                </button>
                
                {user?.role === "doctor" && (
                  <button
                    onClick={() => setActiveTab('admit')}
                    className={`py-3 px-4 flex items-center text-sm font-medium ${
                      activeTab === 'admit'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                }
                >
                  <FaHospital className={`mr-2 h-4 w-4 ${activeTab === 'admit' ? 'text-blue-500' : 'text-gray-400'}`} />
                  Admit Patient
                </button>
                )}
              </nav>
            </div>

            {/* Content Area */}
            <div className="px-6 py-6 text-gray-700 text-[15px]">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-4 flex items-center">
                        <FaUser className="mr-2 text-blue-500" /> Basic Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex">
                          <span className="text-gray-500 w-24">Full Name:</span> 
                          <span className="font-medium text-gray-800">{patient.full_name}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 w-24">Age:</span> 
                          <span className="font-medium">{patient.age} years</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 w-24">Phone:</span> 
                          <span className="font-medium flex items-center">
                            {patient.phone}
                            <a href={`tel:${patient.phone}`} className="ml-2 text-blue-600 hover:text-blue-800">
                              <FaPhone className="w-3 h-3" />
                            </a>
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 w-24">Address:</span> 
                          <span className="font-medium">{patient.address}</span>
                        </div>
                      </div>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-4 flex items-center">
                        <FaUserFriends className="mr-2 text-blue-500" /> Next of Kin
                      </h3>
                      {nextOfKin ? (
                        <div className="space-y-3 text-sm">
                          <div className="flex">
                            <span className="text-gray-500 w-24">Name:</span>
                            <span className="font-medium text-gray-800">{nextOfKin.full_name}</span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-500 w-24">Relationship:</span>
                            <span className="font-medium text-gray-800">{nextOfKin.relationship}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24">Phone:</span>
                            <span className="font-medium flex items-center">
                              {nextOfKin.phone}
                              <a href={`tel:${nextOfKin.phone}`} className="ml-2 text-blue-600 hover:text-blue-800">
                                <FaPhone className="w-3 h-3" />
                              </a>
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 w-24">Address:</span>
                            <span className="font-medium text-gray-800">{nextOfKin.address}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-24 text-center bg-red-50 rounded-lg p-4">
                          <div>
                            <FiAlertCircle className="mx-auto h-6 w-6 text-red-400 mb-1" />
                            <p className="text-red-500 text-sm">No next of kin record found for this patient.</p>
                          </div>
                        </div>
                      )}
                    </section>
                  </div>

                  <section className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-4 flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" /> Visit Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-md border border-gray-100">
                        <p className="text-gray-500 font-medium mb-1 flex items-center text-xs">
                          <FaClock className="mr-1 text-blue-400" /> Last visit
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.visit_on ? new Date(patient.visit_on).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-100">
                        <p className="text-gray-500 font-medium mb-1 flex items-center text-xs">
                          <FaClipboard className="mr-1 text-blue-400" /> Visit Reason
                        </p>
                        <p className="font-medium text-gray-800">{patient.visit_reason || <span className="text-gray-400">N/A</span>}</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-4 flex items-center">
                      <FaHospital className="mr-2 text-blue-500" /> Admission Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-md border border-gray-100">
                        <p className="text-gray-500 font-medium mb-1 flex items-center text-xs">
                          <FaClock className="mr-1 text-blue-400" /> Last Admission
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.admitted_on ? new Date(patient.admitted_on).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-100">
                        <p className="text-gray-500 font-medium mb-1 flex items-center text-xs">
                          <FaClipboard className="mr-1 text-blue-400" /> Admission Reason
                        </p>
                        <p className="font-medium text-gray-800">{patient.admission_reason || <span className="text-gray-400">N/A</span>}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-100">
                        <p className="text-gray-500 font-medium mb-1 flex items-center text-xs">
                          <FaClock className="mr-1 text-blue-400" /> Discharged On
                        </p>
                        <p className="font-medium text-gray-800">
                          {patient.admission_status === true ? (
                            <span className="text-yellow-600 font-semibold">Currently admitted</span>
                          ) : patient.discharged_on ? new Date(patient.discharged_on).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                      <Link 
                        to={`/reports/${patient.patient_id}`} 
                        className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md px-4 py-2 text-sm font-medium transition-colors border border-blue-200"
                      >
                        <FiFilePlus className="mr-2" /> View Patient Reports
                      </Link>
                      
                      {patient.admission_status && (
                        <span className="inline-flex items-center bg-yellow-50 text-yellow-700 rounded-md px-4 py-2 text-sm font-medium border border-yellow-200">
                          <FaHospital className="mr-2" /> Currently Admitted
                        </span>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* Queue Tab */}
              {activeTab === 'queue' && (
                <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiUserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Add Patient to Visit Queue</h3>
                  </div>
                  
                  <form onSubmit={handleQue} className="space-y-4">
                    <div>
                      <label htmlFor="visitationReason" className="block text-sm font-medium text-gray-700 mb-1">
                        Visitation Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="visitationReason"
                        rows={3}
                        placeholder="e.g. Follow-up consultation, General check-up, etc."
                        value={visitationReason}
                        onChange={(e) => { setVisitationReason(e.target.value); setError(""); }}
                        className={`w-full bg-white border ${error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      />
                      {error && (
                        <p className="mt-2 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" /> {error}
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      {!isOnline && (
                        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">
                                You are currently offline. Changes will be saved locally and synced when you're back online.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setActiveTab('profile')}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={loading || formSubmitted}
                          className={`inline-flex items-center px-4 py-2 ${loading || formSubmitted ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md text-sm font-medium shadow-sm transition-colors`}
                        >
                          {loading || formSubmitted ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adding to Queue...
                            </>
                          ) : (
                            <>Add to Queue</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </section>
              )}

              {/* Admit Tab */}
              {activeTab === 'admit' && user?.role === "doctor" && (
                <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                      <FaHospital className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Admit Patient</h3>
                  </div>
                  
                  <form onSubmit={handleAdmit} className="space-y-4">
                    <div>
                      <label htmlFor="admissionReason" className="block text-sm font-medium text-gray-700 mb-1">
                        Admission Condition <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="admissionReason"
                        rows={3}
                        placeholder="e.g. Severe malaria, Post-surgical recovery, etc."
                        value={admissionReason}
                        onChange={(e) => { setAdmissionReason(e.target.value); setError(""); }}
                        className={`w-full bg-white border ${error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      />
                      {error && (
                        <p className="mt-2 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4 flex-shrink-0" /> {error}
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      {!isOnline && (
                        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">
                                You are currently offline. Changes will be saved locally and synced when you're back online.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setActiveTab('profile')}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={loading || formSubmitted}
                          className={`inline-flex items-center px-4 py-2 ${loading || formSubmitted ? 'bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-700'} text-white rounded-md text-sm font-medium shadow-sm transition-colors`}
                        >
                          {loading || formSubmitted ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Admitting Patient...
                            </>
                          ) : (
                            <>Admit Patient</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PatientProfileModal;
