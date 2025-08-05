import { use, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { DischargeBtn } from './DischargeBtn';
import { ReportBtn } from './ReportBtn';
import { useAuth } from '../context/AuthContext';
import { MdWarning } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const AdmittedPage = () => {
  const { patientsData } = useDashboard();
  const { user } = useAuth();
  const admittedPatients = patientsData.filter(patient => patient.admission_status === true);
  const [confirmPage, setConfirmPage] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const navigate = useNavigate();

  return (
    <section className="mb-8 bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <h2 className="text-2xl font-bold text-blue-900">Admitted Patients</h2>
        <p className="text-sm text-gray-500">Patients receiving in-patient care see records, update status, and export reports.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-medium uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="hidden md:table-cell px-4 py-3">Date Admitted</th>
              <th className="px-4 py-3">Room</th>
              <th className="hidden sm:table-cell px-4 py-3">Condition</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {admittedPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  🎉 No admitted patients found.
                </td>
              </tr>
            ) : (
              admittedPatients.map((patient, index) => (
                <tr
                  key={patient.patient_id}
                  className="hover:bg-blue-50 transition"
                  onClick={() => navigate(`/reports/${patient.patient_id}`)}
                >
                  <td className="px-4 py-3 font-mono text-blue-700">{index + 1}</td>
                  <td className="px-4 py-3 font-mono text-blue-700 font-semibold">{patient.patient_id.toUpperCase()}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{patient.full_name.toUpperCase()}</td>
                  <td className="hidden md:table-cell px-4 py-3 font-mono text-blue-700">
                    {patient.admitted_on
                      ? new Date(patient.admitted_on).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">Room {101 + index}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-600">{patient.admission_reason || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {user?.role === 'doctor' || user?.role === 'super admin' && (
                        <button
                          className="bg-green-600 hover:bg-green-500 px-4 py-2 text-xs rounded-md text-white font-medium transition"
                          onClick={e => {
                            e.stopPropagation();
                            setConfirmPage(true);
                            setSelectedPatientId(patient.patient_id);
                          }}
                        >
                          Discharge
                        </button>
                      )}
                      <span
                        onClick={e => e.stopPropagation()}
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

      {confirmPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="max-w-md w-full bg-white shadow-xl rounded-xl border border-blue-200 p-6 text-center space-y-4">
            <MdWarning className="mx-auto text-yellow-500" size={60} />
            <h2 className="text-xl font-bold text-gray-800">Confirm Discharge</h2>
            <p className="text-gray-600">Are you sure you want to discharge this patient? This action cannot be undone.</p>
            <div className="flex justify-center gap-4 pt-2">
              <DischargeBtn patient_id={selectedPatientId} />
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md px-5 py-2 transition"
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
