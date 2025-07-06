import React, { useEffect, useState } from "react"
import { useDashboard } from "../context/DashboardContext"
import { useAuth } from "../context/AuthContext";

interface reportData{
    patient_id: string;
    report: string;
    wrote_by: string;
}

const Reports = () => {

    const {patientsData, loading, newReport,} = useDashboard();
    const {user} = useAuth();

    const [reportData, setReportData] = useState<reportData>({
        patient_id: "",
        report: "",
        wrote_by: "",
    })
    //wrote_by value
    useEffect(() => {
        if (user?.name) {
            setReportData(prev => ({ ...prev, wrote_by: user.name }));
        }
    })
    const [error, setError] = useState({
        patient_id: "",
        report: "",
        server: "",
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setReportData(prev => ({...prev, [name]: value}));
        setError(prev => ({...prev, [name]: ""}))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const {patient_id, report} = reportData 

        const newError = {
            patient_id: patient_id.trim() === "" ? "Please select a patient name or id" : "",
            report: report.trim() === "" ? "Report cant be empty" : "",
        };
        const hasError = Object.values(newError).some(err => err !== "");

        if(hasError){
            return setError(newError);
        }

        try{
            await newReport(reportData);
            setReportData({
                patient_id: "",
                report: "",
                wrote_by: "",
            })

        }catch(err: any){
            const errorMessage = 
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setError(errorMessage)
        }
    }

    return (
       <div className="w-full max-w-5xl mx-auto bg-white drop-shadow-md p-6 rounded-lg space-y-4 ">
            <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2">Submit Patient Report</h1>
            {error.server && (
                  <p className="text-red-800 text-center bg-red-100 p-2 mb-2 rounded border border-red-300">
                      {error.server}
                  </p>
              )}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <select
                        name="patient_id"
                        value={reportData.patient_id}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-blue-100 rounded focus:outline-none focus:bg-blue-50  text-sm"
                        
                        >
                        <option value="">Select patient</option>
                        {patientsData
                            .filter(patient => patient.full_name && patient.patient_id)
                            .map((patient) => (
                            <option key={patient.patient_id} value={patient.patient_id}>
                               {`${patient.full_name.toUpperCase().padEnd(35)}  == || == ${patient.patient_id.toUpperCase()}`}
                            </option>
                            ))}
                    </select>
                    
                    {error.patient_id && (
                    <p className="text-red-600 text-sm mt-1">{error.patient_id}</p>
                    )}
                    
                </div>
                    

                    {/* Report Textarea */}
                    <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">Report: </label>
                    <textarea
                        rows="6"
                        placeholder="Write detailed patient report..."
                        name="report"
                        value={reportData.report}
                        className="w-full p-2 bg-blue-100 rounded resize-none focus:outline-none focus:bg-blue-50"
                        onChange={handleInputChange}
                    ></textarea>
                    {error.report && (
                    <p className="text-red-600 text-sm mt-1">{error.report}</p>
                    )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        {loading ? "Submiting..." :"Submit Report"}
                    </button>
                </div>
            </form>
        </div>


    )
}
export default Reports