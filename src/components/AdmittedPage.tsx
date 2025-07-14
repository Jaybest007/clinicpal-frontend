import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {DischargeBtn} from './DischargeBtn'
import { ReportBtn } from './ReportBtn';
import { useAuth } from '../context/AuthContext';
import { MdWarning } from 'react-icons/md';

const AdmittedPage = () => {
  const { patientsData } = useDashboard();
  const { user } = useAuth()
  const admittedPatients = patientsData.filter(patient => patient.admission_status === 1);
  const [confirmPage, setConfirmPage] = useState(false);

  return (
    <section className="mt-8 bg-white shadow rounded-lg overflow-hidden mb-4">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Admitted Patients</h2>
        <p className="text-sm text-gray-500">Currently receiving in-patient care</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Patient ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">DOA </th>
              <th className="px-6 py-3 text-left">Room No</th>
              <th className="px-6 py-3 text-left">Condition</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {admittedPatients.map((patient, index) => (
              <tr key={patient.patient_id} className="hover:bg-blue-50 transition border-b border-neutral-300">
                <td className="px-6 py-3 font-mono text-blue-700 border-r border-neutral-300 font-medium">{patient.patient_id.toUpperCase()}</td>
                <td className="px-6 py-3 font-semibold text-gray-800 border-r border-neutral-300">{patient.full_name.toUpperCase()}</td>
                <td className="px-6 py-3 font-mono text-blue-700 font-medium border-r border-neutral-300">
                  {patient.admitted_on ? new Date(patient.admitted_on).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                </td>

                <td className="px-6 py-3 border-r border-neutral-300">Room {101 + index}</td>
                <td className="px-6 py-3 text-gray-700 border-r border-neutral-300">{patient.admission_reason || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700 flex flex-col-1 gap-3">
                  { user?.role === "doctor" && 
                  <button  className='bg-lime-600 hover:bg-lime-500 px-5 py-3 rounded-md text-white'
                   onClick={()=> setConfirmPage(true)}>Discharge</button>}
                  <ReportBtn patient_id={patient.patient_id}/>
                </td>
                {confirmPage && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
                    <div className="relative w-full max-w-xl mx-auto bg-white shadow-xl rounded-xl border border-blue-200 animate-fade-in transition-all">
                      
                      {/* Modal Content */}
                      <div className="px-8 pt-8 pb-6 text-center space-y-6">
                        <MdWarning className="mx-auto text-red-500" size={60} />

                        <h2 className="text-2xl font-semibold text-gray-800">
                          Confirm Discharge
                        </h2>
                        <p className="text-gray-600">
                          Are you sure you want to discharge this patient? This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-2">
                          <button onClick={() => setConfirmPage(false)}>
                            <DischargeBtn patient_id={patient.patient_id} />
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md px-5 py-2 transition"
                            onClick={() => setConfirmPage(false)}
                          >
                            No, Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </section>
    
  );
};

export default AdmittedPage;
