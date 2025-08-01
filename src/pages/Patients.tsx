import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import NavBar from "../components/NavBar";
import NewPatient from "../components/NewPatient";
import PatientProfileModal from "../components/PatientProfilemModal";
import type { patientInfo } from "../components/PatientProfilemModal";
import { useDashboard } from "../context/DashboardContext";
import AdmittedPage from "../components/AdmittedPage";
import { useAuth } from "../context/AuthContext";
import { FiPlus } from "react-icons/fi";
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      {/* Online/Offline Status Indicator */}
      <div className="flex justify-end px-4 pt-2">
        <span
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
            ${isOnline ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
          `}
        >
          <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-yellow-500"} inline-block`} />
          {isOnline ? "Online - Live Data" : "Offline - Local Data"}
        </span>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-8 py-4 rounded-t-xl shadow-sm mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight">
            Patient Records
          </h1>
          <button
            onClick={() => setShowNewPatient((prev) => !prev)}
            className="col-span-2 mt-2 bg-[#2788E3] hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 justify-center font-semibold text-sm sm:px-4 sm:py-2 sm:text-base"
            aria-label={showNewPatient ? "Close registration form" : "Register new patient"}
          >
            {showNewPatient ? "Close Form" : <FiPlus />} Register Patient
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8 space-y-8">
          {/* Registration Form */}
          {showNewPatient && (
            <div className="mb-8 animate-fade-in">
              <NewPatient isOpen={showNewPatient} onClose={() => setShowNewPatient(false)} />
            </div>
          )}

          {/* Search Bar */}
          {(user?.role === "nurse" || user?.role === "doctor" || user?.role === "super admin") && (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={searchPatient}
                  placeholder="Search by name or ID"
                  className="bg-blue-100 text-black outline-none p-2 pl-10 rounded-md w-full pr-10 focus:ring-2 ring-blue-400 transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredPatients([]);
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchTerm && (
            <section className="mt-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Search Results
              </h2>
              {filteredPatients.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPatients.map((patient) => (
                    <li key={patient.patient_id}>
                      <button
                        onClick={() => {
                          setSelectedPatient({
                            ...patient,
                            discharged_on: patient.discharged_on ?? "",
                            admitted_on: patient.admitted_on ?? ""
                          });
                          setIsModalOpen(true);
                        }}
                        className="group w-full text-left bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-500 hover:shadow-lg rounded-xl p-5 transition duration-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-blue-400 font-mono tracking-wide">
                            ID: {patient.patient_id.toUpperCase()}
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            VIEW
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-blue-900 group-hover:text-blue-600 truncate">
                          {patient.full_name}
                        </h3>
                        <dl className="mt-2 text-sm text-slate-700 space-y-1">
                          <div className="flex items-center justify-between">
                            <dt>Age</dt>
                            <dd className="font-medium">{patient.age}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt>Phone</dt>
                            <dd className="font-medium">{patient.phone}</dd>
                          </div>
                          <div className="flex">
                            <dt className="truncate w-[25%]">Address</dt>
                            <dd className="ml-auto text-right truncate max-w-[70%]">{patient.address}</dd>
                          </div>
                        </dl>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-500 italic">
                  No matching patients found for “{searchTerm}”.
                </p>
              )}
            </section>
          )}

          {/* Admitted Patients Section */}
          <div className="">
            <header className="mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold text-blue-800">
                Admitted Patients
              </h2>
              <p className="text-sm text-slate-500">
                View all currently admitted patients.
              </p>
            </header>
            <AdmittedPage />
          </div>
        </section>
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
