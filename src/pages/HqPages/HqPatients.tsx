import React from "react";
import { HqNavBar } from "../../components/HqNavBar";
import { useDashboard } from "../../context/DashboardContext";


export const HqPatients: React.FC = () => {
    const { patientsData } = useDashboard();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
        {/* =======nav bar=========== */}
        <HqNavBar/>

        <main className="flex-1 pt-8 px-2 md:px-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Overview Bar */}
                <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-semibold">Patients</h1>
                </div>

                 <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-100 text-gray-700 font-medium">
                        <tr>
                            <th className="px-6 py-3 text-left border-b">No</th>
                            <th className="px-6 py-3 text-left border-b">Name</th>
                            <th className="px-6 py-3 text-left border-b">Patient ID</th>
                            <th className="px-6 py-3 text-left border-b">Gender</th>
                            <th className="px-6 py-3 text-left border-b">Age</th>
                            <th className="px-6 py-3 text-left border-b">Phone</th>
                            <th className="px-6 py-3 text-left border-b">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-800">
                           {patientsData.map((patient, index) => (
                            <tr className="hover:bg-gray-50 transition" key={index}>
                                <td className="px-6 py-4 border-b">{index + 1}</td>
                                <td className="px-6 py-4 border-b">{patient.full_name.toUpperCase()}</td>
                                <td className="px-6 py-4 border-b">{patient.patient_id.toUpperCase()}</td>
                                <td className="px-6 py-4 border-b">{patient.gender}</td>
                                <td className="px-6 py-4 border-b">{patient.age}</td>
                                <td className="px-6 py-4 border-b">{patient.phone}</td>
                                <td className="px-6 py-4 border-b">
                                    <button className="text-blue-600 hover:underline">View</button>
                                    <button className="ml-2 text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                           ))}
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
  );
}