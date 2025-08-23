import { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaRegCalendarAlt, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FiPlus, FiFilter, FiUser, FiUserCheck, FiUsers } from "react-icons/fi";
import NavBar from "../components/NavBar";
import NewPatient from "../components/NewPatient";
import PatientProfileModal from "../components/patient/PatientProfilemModal";
import type { patientInfo } from "../components/patient/PatientProfilemModal";
import { useDashboard } from "../context/DashboardContext";
import AdmittedPage from "../components/AdmittedPage";
import { useAuth } from "../context/AuthContext";
import { fetchAllPatients } from "../db/patientHelpers";
import { toast } from "react-toastify";

interface PatientInfo {
  full_name: string;
  patient_id: string;
  address: string;
  phone: string;
  age: number;
  admission_status: boolean;
  admission_reason: string;
  visit_on: string;
  visit_reason: string;
  discharged_on: string | null;
  admitted_on: string | null;
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<PatientInfo[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<patientInfo | null>(null);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { patientsData } = useDashboard();
  const { user } = useAuth();

  // Online/offline and local patients state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [localPatients, setLocalPatients] = useState<PatientInfo[]>([]);

  // Listen for online/offline changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are online. Using live data.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warn("You are offline. Using locally saved data.");
    };
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
      fetchAllPatients().then(setLocalPatients);
    }
  }, [isOnline]);

  // Use correct patients list
  const patientsList = isOnline ? patientsData : localPatients;

  // Search logic
  function searchPatient(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setSearchTerm(input);

    const matches = patientsList.filter((patient) =>
      patient.full_name.toLowerCase().includes(input.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredPatients(matches);
  }

  useEffect(() => {
    document.title = "Patients - ClinicPal App";
  }, []);

  // Stats for the dashboard cards
  const totalPatients = patientsList.length;
  const admittedCount = patientsList.filter(p => p.admission_status).length;
  const recentVisits = patientsList.filter(p => {
    const visitDate = new Date(p.visit_on);
    const now = new Date();
    const daysDiff = (now.getTime() - visitDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7; // Patients who visited in the last 7 days
  }).length;

  return user?.role === "unactivated" ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto border border-red-200">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h1>
        <p className="text-gray-700 mb-6">
          Your account is inactive. Please contact your hospital administrator to activate access to the dashboard.
        </p>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      {/* Online/Offline Status Indicator */}
      <div className="fixed top-20 right-4 z-50">
        <span
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm
            ${isOnline 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
            }`}
        >
          <span className={`h-2 w-2 rounded-full animate-pulse ${isOnline ? "bg-green-500" : "bg-yellow-500"}`} />
          {isOnline ? "Online - Live Data" : "Offline - Local Data"}
        </span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
                <p className="text-sm text-gray-500">Manage and view all patient information</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewPatient((prev) => !prev)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
              aria-label={showNewPatient ? "Close registration form" : "Register new patient"}
            >
              {showNewPatient ? <FaTimes /> : <FiPlus />} 
              {showNewPatient ? "Close Form" : "Register Patient"}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPatients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUser className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admitted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{admittedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiUserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Visits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{recentVisits}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaRegCalendarAlt className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Registration Form */}
          {showNewPatient && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
              <NewPatient isOpen={showNewPatient} onClose={() => setShowNewPatient(false)} />
            </div>
          )}

          {/* Search and Filter Section */}
          {(user?.role === "nurse" || user?.role === "doctor" || user?.role === "super admin") && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Find Patients</h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:w-80">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={searchPatient}
                      placeholder="Search by name or ID"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-10 pr-10 p-2.5"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilteredPatients([]);
                        }}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <FiFilter className="mr-2 w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Search Results */}
              {searchTerm && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600">
                      Search Results
                    </h3>
                    <span className="text-xs text-gray-500">
                      Found {filteredPatients.length} patients
                    </span>
                  </div>
                  
                  {filteredPatients.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.patient_id}
                          onClick={() => {
                            setSelectedPatient({
                              ...patient,
                              gender: (patient as any).gender ?? "",
                              discharged_on: patient.discharged_on ?? "",
                              admitted_on: patient.admitted_on ?? ""
                            });
                            setIsModalOpen(true);
                          }}
                          className="text-left group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                {patient.full_name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {patient.full_name}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                    {patient.patient_id.toUpperCase()}
                                  </span>
                                  {patient.admission_status && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                      Admitted
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              View
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaRegCalendarAlt className="mr-2 w-3 h-3" />
                              <span>Age: {patient.age}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaPhoneAlt className="mr-2 w-3 h-3" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="col-span-2 flex items-start text-gray-600 truncate">
                              <FaMapMarkerAlt className="mr-2 w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="truncate">{patient.address}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      No matching patients found for "{searchTerm}".
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admitted Patients Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <AdmittedPage />
          </div>
        </div>
      </main>

      <PatientProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default Patients;
