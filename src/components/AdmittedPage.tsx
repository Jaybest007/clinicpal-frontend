import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { DischargeBtn } from './DischargeBtn';
import { ReportBtn } from './ReportBtn';
import { useAuth } from '../context/AuthContext';
import { MdWarning, MdOutlineLocalHospital } from 'react-icons/md';
import { FaBed, FaRegCalendarAlt, FaUser, FaIdCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdmittedPage = () => {
  const { patientsData } = useDashboard();
  const { user } = useAuth();
  const admittedPatients = patientsData.filter(patient => patient.admission_status === true);
  const [confirmPage, setConfirmPage] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatientName, setSelectedPatientName] = useState<string>('');
  const navigate = useNavigate();

  return (
    <section className="mb-8 bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="flex items-center">
          <FaBed className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-blue-900">Admitted Patients</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Patients receiving in-patient care. View records, update status, and export reports.
        </p>
        <div className="mt-3 flex items-center text-xs text-blue-600 font-medium">
          <div className="flex items-center mr-4">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
            <span>Total: {admittedPatients.length}</span>
          </div>
          {admittedPatients.length > 0 && (
            <div className="flex items-center mr-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-1"></div>
              <span>Occupancy: {Math.round((admittedPatients.length / 30) * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-medium uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FaIdCard className="mr-1 text-gray-500" />
                  ID
                </div>
              </th>
              <th className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FaUser className="mr-1 text-gray-500" />
                  Name
                </div>
              </th>
              <th className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FaRegCalendarAlt className="mr-1 text-gray-500" />
                  Date Admitted
                </div>
              </th>
              <th className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FaBed className="mr-1 text-gray-500" />
                  Room
                </div>
              </th>
              <th className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <MdOutlineLocalHospital className="mr-1 text-gray-500" />
                  Condition
                </div>
              </th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {admittedPatients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-blue-50 rounded-full p-4 mb-4">
                      <FaBed className="h-10 w-10 text-blue-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">No admitted patients</p>
                    <p className="text-gray-500 text-sm mb-6">All beds are currently available</p>
                    
                  </div>
                </td>
              </tr>
            ) : (
              admittedPatients.map((patient, index) => (
                <tr
                  key={patient.patient_id}
                  className="hover:bg-blue-50 transition cursor-pointer"
                  onClick={() => navigate(`/reports/${patient.patient_id}`)}
                >
                  <td className="px-4 py-3 font-mono text-blue-700">{index + 1}</td>
                  <td className="px-4 py-3 font-mono text-blue-700 font-semibold">{patient.patient_id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-800">{patient.full_name.toUpperCase()}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {patient.gender}, {patient.age} years
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 font-mono text-gray-700">
                    {patient.admitted_on
                      ? new Date(patient.admitted_on).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                      Room {101 + index}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-600">
                    <div className="max-w-xs truncate">
                      {patient.admission_reason || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(user?.role === 'doctor' || user?.role === 'super admin') && (
                        <button
                          className="bg-green-600 hover:bg-green-500 px-4 py-2 text-xs rounded-md text-white font-medium transition flex items-center"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedPatientId(patient.patient_id);
                            setSelectedPatientName(patient.full_name);
                            setConfirmPage(true);
                          }}
                        >
                          Discharge
                        </button>
                      )}
                      <span
                        onClick={e => e.stopPropagation()}
                        className="inline-block"
                      >
                        <ReportBtn patient_id={patient.patient_id} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Discharge confirmation modal */}
      {confirmPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in" onClick={() => setConfirmPage(false)}>
          <div className="max-w-md w-full bg-white shadow-xl rounded-xl border border-blue-200 p-6 text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="h-16 w-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
              <MdWarning className="text-amber-500" size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Confirm Discharge</h2>
            <p className="text-gray-600">
              Are you sure you want to discharge <span className="font-semibold text-blue-700">{selectedPatientName}</span>?
              <br />
              <span className="text-sm text-gray-500 block mt-1">This action cannot be undone.</span>
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <DischargeBtn patient_id={selectedPatientId} onClose={() => setConfirmPage(false)} />
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-5 py-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                onClick={() => setConfirmPage(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdmittedPage;
