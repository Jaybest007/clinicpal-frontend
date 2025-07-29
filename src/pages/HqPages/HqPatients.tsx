import React, { useState, useEffect } from "react";
import { HqNavBar } from "../../components/hq_components/HqNavBar";
import { useDashboard } from "../../context/DashboardContext";
import PatientProfileModal from "../../components/PatientProfilemModal";
import type { patientInfo } from "../../components/PatientProfilemModal";
import { useHospital } from "../../context/HospitalContext";
import ConfirmActionModal from "../../components/ConfirmActionModal";

export const HqPatients: React.FC = () => {
    const { patientsData, fetchAllPatients } = useDashboard();
    const { deletePatient } = useHospital();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<patientInfo | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ order: any; type: string } | null>(null);
    

    useEffect(() => {
        if (!patientsData || patientsData.length === 0) {
            fetchAllPatients();
        }
    }, [patientsData, fetchAllPatients]);

    const handleActionConfirm = async () => {
        if (!confirmModal) return;
        if (confirmModal.type === "delete") {
            await deletePatient(confirmModal.order.patient_id);
            fetchAllPatients();
        }
        setConfirmModal(null);
    };

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

                 <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 overflow-x-auto">
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
                          {(Array.isArray(patientsData) && patientsData.length > 0) ? (
                            patientsData.map((patient, index) => (
                              <tr className="hover:bg-gray-50 transition" key={index}>
                                  <td className="px-6 py-4 border-b">{index + 1}</td>
                                  <td className="px-6 py-4 border-b">{patient.full_name.toUpperCase()}</td>
                                  <td className="px-6 py-4 border-b">{patient.patient_id.toUpperCase()}</td>
                                  <td className="px-6 py-4 border-b">{patient.gender}</td>
                                  <td className="px-6 py-4 border-b">{patient.age}</td>
                                  <td className="px-6 py-4 border-b">{patient.phone}</td>
                                  <td className="px-6 py-4 border-b">
                                      <div className="grid grid-cols-1 gap-2 sm:flex sm:space-x-2">
                                          <button 
                                              className="bg-blue-600 text-white px-2 py-1 hover:bg-blue-700 rounded w-full"
                                              onClick={() => {
                                                  setSelectedPatient(patient);
                                                  setIsModalOpen(true);
                                              }}
                                          >
                                              View
                                          </button>
                                          <button 
                                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded w-full"
                                              onClick={() => setConfirmModal({ order: patient, type: "delete" })}
                                          >
                                              Delete
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-6 text-gray-400">
                                No patient records found.
                              </td>
                            </tr>
                          )}
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        <PatientProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            patient={selectedPatient}
        />

        {/* confirmation modal */}
        <ConfirmActionModal
          open={!!confirmModal}
          order={confirmModal?.order}
          type={confirmModal?.type ?? ""}
          onCancel={() => setConfirmModal(null)}
          onConfirm={handleActionConfirm}
        />
    </div>
  );
}