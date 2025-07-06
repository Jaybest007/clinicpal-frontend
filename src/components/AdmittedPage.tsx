import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const AdmittedPage = () => {
  const { patientsData } = useDashboard();
  const admittedPatients = patientsData.filter(patient => patient.admission_status === 1);

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
              <th className="px-6 py-3 text-left">Room No</th>
              <th className="px-6 py-3 text-left">Condition</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {admittedPatients.map((patient, index) => (
              <tr key={patient.patient_id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-3 font-mono text-blue-700 font-medium">{patient.patient_id.toUpperCase()}</td>
                <td className="px-6 py-3 font-semibold text-gray-800">{patient.full_name}</td>
                <td className="px-6 py-3">Room {101 + index}</td>
                <td className="px-6 py-3 text-gray-700">{patient.admission_reason || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700 flex flex-col-1 gap-3">
                  <button className='bg-lime-600 hover:bg-lime-500 px-3 py-2 rounded-md text-white '>Discharge</button>
                  <button className='bg-yellow-600 hover:bg-yellow-500 px-3 py-2 rounded-md text-white'>Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdmittedPage;
