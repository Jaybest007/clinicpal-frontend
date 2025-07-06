import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import NavBar from "../components/NavBar";
import NewPatient from "../components/NewPatient";
import PatientProfileModal from "../components/PatientProfilemModal";
import { useDashboard } from "../context/DashboardContext";
import AdmittedPage from "../components/AdmittedPage";


interface PatientInfo {
  full_name: string;
  patient_id: string;
  address: string;
  phone: string;
  age: number;
  admission_status: number;
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<PatientInfo[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { patientsData } = useDashboard();

  function searchPatient(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setSearchTerm(input);

    const matches = patientsData.filter((patient) =>
      patient.full_name.toLowerCase().includes(input.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredPatients(matches);
  }
  useEffect(() => {
    document.title = "Patients -ClinicPal App"
  },[])

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <NavBar />

      <main className="flex-1 pt-10 px-4 md:px-8">
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
          <header className="flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
            <button
              onClick={() => setShowNewForm(prev => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md shadow-sm"
            >
              {showNewForm ? "Close Form" : "Register Patient"}
            </button>
          </header>

          <section>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={searchTerm}
                onChange={searchPatient}
                placeholder="Search by name or ID"
                className="bg-blue-100 text-black outline-none p-2 rounded-md w-full pr-10 focus:ring-2 ring-blue-400"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredPatients([]);
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </section>

          {searchTerm && (
            <section className="mt-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Search Results
              </h2>

              {filteredPatients.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => (
                    <li key={patient.patient_id}>
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsModalOpen(true);
                        }}
                        className="group w-full text-left bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 transition duration-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 font-mono tracking-wide">
                            ID: {patient.patient_id.toUpperCase()}
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            VIEW
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                          {patient.full_name}
                        </h3>

                        <dl className="mt-2 text-sm text-gray-600 space-y-1">
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
                <p className="text-sm text-red-500 italic">No matching patients found for “{searchTerm}”.</p>
              )}
            </section>
          )}

          {/* SHOW NEW FORM */}
          {showNewForm && <NewPatient />}


          {/* SHOW ADMITTED PATIENTS */}
          <AdmittedPage/>

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
