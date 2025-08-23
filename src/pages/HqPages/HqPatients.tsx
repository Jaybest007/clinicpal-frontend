import React, { useState, useEffect, useMemo, useCallback } from "react";
import { HqNavBar } from "../../components/hq_components/HqNavBar";

import PatientProfileModal from "../../components/patient/PatientProfilemModal";
import type { patientInfo } from "../../components/patient/PatientProfilemModal";
import { useHospital } from "../../context/HospitalContext";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import { FaSearch, FaUserPlus, FaFileExport, FaSortAmountDown, FaSortAmountUp, FaEye, FaTrash } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { usePatients } from "../../context/DashboardContext/hooks/usePatients";

// StatusBadge component
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  let color = "bg-gray-100 text-gray-600";
  
  if (status === "admitted") {
    color = "bg-blue-100 text-blue-800";
  } else if (status === "discharged") {
    color = "bg-green-100 text-green-800";
  } else if (status === "critical") {
    color = "bg-red-100 text-red-800";
  } else if (status === "pending") {
    color = "bg-yellow-100 text-yellow-800";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
});

// PatientAnalytics component
const PatientAnalytics: React.FC<{ patients: patientInfo[] }> = React.memo(({ patients }) => {
  // Calculate analytics using useMemo
  const analytics = useMemo(() => {
    const totalPatients = patients?.length || 0;
    const admittedPatients = patients?.filter((p: patientInfo) => p.admission_status === true)?.length || 0;
    const malePatients = patients?.filter((p: patientInfo) => p.gender?.toLowerCase() === "male")?.length || 0;
    const femalePatients = patients?.filter((p: patientInfo) => p.gender?.toLowerCase() === "female")?.length || 0;
    
    return [
      { label: "Total Patients", value: totalPatients, color: "bg-blue-100 text-blue-800" },
      { label: "Currently Admitted", value: admittedPatients, color: "bg-purple-100 text-purple-800" },
      { label: "Male", value: malePatients, color: "bg-indigo-100 text-indigo-800" },
      { label: "Female", value: femalePatients, color: "bg-pink-100 text-pink-800" },
    ];
  }, [patients]);
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {analytics.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className={`inline-block rounded-lg px-3 py-1 ${item.color} mb-2`}>
            {item.label}
          </div>
          <div className="text-2xl font-bold text-gray-800">{item.value}</div>
        </div>
      ))}
    </div>
  );
});

export const HqPatients: React.FC = React.memo(() => {
    const hospitalDetail = localStorage.getItem("hospital_data");
    const token = JSON.parse(hospitalDetail || "{}").token;
    const { patientsData, fetchAllPatients } = usePatients(token);
    const { deletePatient } = useHospital();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = useState<patientInfo | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ order: any; type: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [sortConfig, setSortConfig] = useState<{ key: keyof patientInfo; direction: string }>({ 
        key: "full_name", 
        direction: "ascending" 
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const patientsPerPage = 10;

    useEffect(() => {
        if (!patientsData || patientsData.length === 0) {
            setIsLoading(true);
            fetchAllPatients().finally(() => setIsLoading(false));
        }
    }, [patientsData, fetchAllPatients]);

    // Memoize action handlers
    const handleActionConfirm = useCallback(async () => {
        if (!confirmModal) return;
        if (confirmModal.type === "delete") {
            setIsLoading(true);
            try {
                await deletePatient(confirmModal.order.patient_id);
                await fetchAllPatients();
            } finally {
                setIsLoading(false);
                setConfirmModal(null);
            }
        }
    }, [confirmModal, deletePatient, fetchAllPatients]);

    // Refresh patients data - memoized
    const refreshPatients = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchAllPatients();
        } finally {
            setIsLoading(false);
        }
    }, [fetchAllPatients]);

    // Handle sorting - memoized
    const requestSort = useCallback((key: keyof patientInfo) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    // Filter and sort patients
    const filteredAndSortedPatients = useMemo(() => {
        if (!Array.isArray(patientsData)) return [];
        
        // First filter by search term and status
        let filteredPatients = patientsData.filter(patient => {
            const matchesSearch = 
                patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phone?.includes(searchTerm);
                
            const matchesStatus = 
                filterStatus === "all" || 
                (filterStatus === "admitted" && patient.admission_status === true) ||
                (filterStatus === "non-admitted" && patient.admission_status !== true);
                
            return matchesSearch && matchesStatus;
        });
        
        // Then sort
        if (sortConfig.key) {
            filteredPatients.sort((a: patientInfo, b: patientInfo) => {
                const aValue = a[sortConfig.key as keyof patientInfo];
                const bValue = b[sortConfig.key as keyof patientInfo];
                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1;
                if (bValue == null) return -1;
                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        
        return filteredPatients;
    }, [patientsData, searchTerm, filterStatus, sortConfig]);
    
    // Get current patients for pagination - memoized
    const { currentPatients, totalPages, pageInfo } = useMemo(() => {
        const indexOfLastPatient = currentPage * patientsPerPage;
        const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
        const currentPatients = filteredAndSortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
        const totalPages = Math.ceil(filteredAndSortedPatients.length / patientsPerPage);
        
        // Generate an array of page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        
        return { 
            currentPatients, 
            totalPages,
            pageInfo: {
                indexOfFirstPatient,
                indexOfLastPatient,
                pageNumbers
            }
        };
    }, [filteredAndSortedPatients, currentPage, patientsPerPage]);

    // Export to CSV - memoized
    const exportToCSV = useCallback(() => {
        if (!filteredAndSortedPatients.length) return;
        
        const headers = ["Patient ID", "Name", "Gender", "Age", "Phone", "Status"];
        const csvData = filteredAndSortedPatients.map(patient => [
            patient.patient_id,
            patient.full_name,
            patient.gender,
            patient.age,
            patient.phone,
            patient.admission_status ? "Admitted" : "Not Admitted"
        ]);
        
        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "patients.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [filteredAndSortedPatients]);

    // Get sort icon - memoized
    const getSortIcon = useCallback((columnName: keyof patientInfo) => {
        if (sortConfig.key !== columnName) {
            return null;
        }
        return sortConfig.direction === "ascending" ? 
            <FaSortAmountUp className="h-3 w-3 ml-1" /> : 
            <FaSortAmountDown className="h-3 w-3 ml-1" />;
    }, [sortConfig]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
            <HqNavBar/>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage and view all patient information
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={refreshPatients} 
                            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            <FiRefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>
                        
                        <button 
                            onClick={exportToCSV}
                            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <FaFileExport className="h-4 w-4" />
                            <span>Export</span>
                        </button>
                        
                        <button 
                            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <FaUserPlus className="h-4 w-4" />
                            <span>Add Patient</span>
                        </button>
                    </div>
                </div>
                
                {/* Analytics section */}
                <div className="mb-6">
                    <PatientAnalytics patients={patientsData} />
                </div>
                
                {/* Search and filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search patients by name, ID or phone..."
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Status:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="all">All Patients</option>
                                <option value="admitted">Currently Admitted</option>
                                <option value="non-admitted">Not Admitted</option>
                            </select>
                        </div>
                    </div>
                    
                    {searchTerm || filterStatus !== "all" ? (
                        <div className="mt-3 text-sm text-gray-600">
                            Found {filteredAndSortedPatients.length} patient{filteredAndSortedPatients.length !== 1 ? 's' : ''} matching your criteria
                        </div>
                    ) : null}
                </div>
                
                {/* Patients table */}
                <div className="bg-white shadow-lg rounded-lg border border-gray-200 mb-6 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort("full_name" as keyof patientInfo)}
                                    >
                                        <div className="flex items-center">
                                            Name {getSortIcon("full_name" as keyof patientInfo)}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort("patient_id" as keyof patientInfo)}
                                    >
                                        <div className="flex items-center">
                                            Patient ID {getSortIcon("patient_id" as keyof patientInfo)}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort("gender" as keyof patientInfo)}
                                    >
                                        <div className="flex items-center">
                                            Gender {getSortIcon("gender" as keyof patientInfo)}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort("age" as keyof patientInfo)}
                                    >
                                        <div className="flex items-center">
                                            Age {getSortIcon("age" as keyof patientInfo)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center">
                                            <div className="flex justify-center">
                                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">Loading patient records...</p>
                                        </td>
                                    </tr>
                                ) : currentPatients.length > 0 ? (
                                    currentPatients.map((patient, index) => (
                                        <tr key={patient.patient_id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pageInfo.indexOfFirstPatient + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {patient.full_name?.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-mono">
                                                    {patient.patient_id?.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {patient.gender}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {patient.age}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {patient.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={patient.admission_status ? "admitted" : "discharged"} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-700 transition"
                                                        onClick={() => {
                                                            setSelectedPatient(patient);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <FaEye className="h-3 w-3" />
                                                        <span>View</span>
                                                    </button>
                                                    <button
                                                        className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-red-700 transition"
                                                        onClick={() => setConfirmModal({ order: patient, type: "delete" })}
                                                    >
                                                        <FaTrash className="h-3 w-3" />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <FaUserPlus className="h-10 w-10 text-gray-300 mb-2" />
                                                <p className="text-lg font-medium">No patient records found</p>
                                                <p className="text-sm mt-1">
                                                    {searchTerm || filterStatus !== "all" ? 
                                                        "Try adjusting your search or filters" : 
                                                        "Add your first patient to get started"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {filteredAndSortedPatients.length > patientsPerPage && (
                        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{pageInfo.indexOfFirstPatient + 1}</span> to{" "}
                                        <span className="font-medium">
                                            {Math.min(pageInfo.indexOfLastPatient, filteredAndSortedPatients.length)}
                                        </span>{" "}
                                        of <span className="font-medium">{filteredAndSortedPatients.length}</span> patients
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                                currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-500 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {pageInfo.pageNumbers.map(number => (
                                            <button
                                                key={number}
                                                onClick={() => setCurrentPage(number)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === number
                                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                {number}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                                currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-500 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Patient Profile Modal */}
            <PatientProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patient={selectedPatient}
            />

            {/* Confirmation Modal */}
            <ConfirmActionModal
                open={!!confirmModal}
                order={confirmModal?.order}
                type={confirmModal?.type ?? ""}
                onCancel={() => setConfirmModal(null)}
                onConfirm={handleActionConfirm}
            />
        </div>
    );
});