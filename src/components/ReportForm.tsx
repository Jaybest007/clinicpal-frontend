import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";



interface reportData {
  patient_id: string;
  report: string;
  wrote_by: string;
}

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  patient_id: string;
}

const ReportForm = ({ isOpen, onClose, patient_id }: ReportFormProps) => {
  const { patientsData, loading, newReport, fetch_Admitted_Patient_Report, fetchPatientReport } = useDashboard();
  const { user } = useAuth();
  const [medications, setMedications] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string[]>([]);
  
  const [reportData, setReportData] = useState<reportData>({
    patient_id: "",
    report: "",
    wrote_by: "",
  });

  //====let fetch suggestions ===
  useEffect(() => {
  fetch("/medications.json")
    .then((res) => res.json())
    .then((data) => {
      const flatList = new Set<string>();
      for (const category in data) {
        data[category].forEach((med: any) => {
          if (med.Generic) flatList.add(med.Generic);
          med.Brands?.forEach((brand: string) => flatList.add(brand));
        });
      }
      setMedications(Array.from(flatList));
    })
    .catch((err) => console.error("Failed to load medications", err));
}, []);

//====get user name
  useEffect(() => {
    if (user?.name) {
      setReportData((prev) => ({ ...prev, wrote_by: user.name }));
    }
    
  }, [user?.name]);

  const [error, setError] = useState({
    patient_id: "",
    report: "",
    server: "",
  });


  //=============input  change=======
  const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = event.target;

  if (name === "report") {
    const words = value.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord.length > 1) {
      const match = medications.find((med) =>
        med.toLowerCase().startsWith(lastWord.toLowerCase())
      );
      setSuggestion(match && match.toLowerCase() !== lastWord.toLowerCase() ? match : null);
    } else {
      setSuggestion(null);
    }
  }

  setReportData((prev) => ({ ...prev, [name]: value }));
  setError((prev) => ({ ...prev, [name]: "" }));
};

//======handle submit=======================
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Use prop patient_id if provided, otherwise use from state
    const selectedPatientId = patient_id ? patient_id : reportData.patient_id;
    const { report } = reportData;

    const newError = {
      patient_id: selectedPatientId.trim() === "" ? "Please select a patient name or ID." : "",
      report: report.trim() === "" ? "Report can't be empty." : "",
    };
    const hasError = Object.values(newError).some((err) => err !== "");

    if (hasError) {
      return setError((prev) => ({ ...prev, ...newError }));
    }

    try {
      await newReport({
        ...reportData,
        patient_id: selectedPatientId,
      });
      setReportData({
        patient_id: "",
        report: "",
        wrote_by: user?.name || "",
      });
      setError({ patient_id: "", report: "", server: "" });
      fetch_Admitted_Patient_Report();
      if(patient_id){
        fetchPatientReport({patient_id});
      }
      onClose(); 
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError((prev) => ({ ...prev, server: errorMessage }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-2 py-8 overflow-y-auto">
      <div className="relative w-full max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 animate-fade-in mt-16">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-blue-900 border-b pb-3 mb-6">
          Submit Patient Report
        </h1>
        {error.server && (
          <p className="text-red-800 text-center bg-red-100 p-3 mb-4 rounded border border-red-300">
            {error.server}
          </p>
        )}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Patient Select */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Select Patient
            </label>
            <select
              name="patient_id"
              value={patient_id ? patient_id : reportData.patient_id}
              onChange={handleInputChange}
              className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              disabled={!!patient_id} // Disable if patient_id prop is provided
            >
              <option value="">Select patient</option>
              {patientsData
                .filter((patient) => patient.full_name && patient.patient_id)
                .map((patient) => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {`${patient.full_name.toUpperCase()}  |  ${patient.patient_id.toUpperCase()}`}
                  </option>
                ))}
            </select>
            {error.patient_id && (
              <p className="text-red-600 text-sm mt-1">{error.patient_id}</p>
            )}
          </div>

          {/* Report Textarea */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Report Details
            </label>
            <textarea
              rows={6}
              placeholder="Write detailed patient report..."
              name="report"
              value={reportData.report}
              onKeyDown={(e) => {
              if (e.key === "Tab" && suggestion) {
                e.preventDefault();
                const words = reportData.report.trimEnd().split(/\s+/);
                words[words.length - 1] = suggestion;
                const newReport = words.join(" ") + " ";
                setReportData((prev) => ({ ...prev, report: newReport }));
                setSuggestion(null);
              }
            }}

              className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleInputChange}
            ></textarea>
            {suggestion && (
              <div className="mt-1 text-sm text-gray-600">
                💡 Suggested: <span className="text-blue-600 font-medium">{suggestion}</span> (press `Tab` to insert)
              </div>
            )}

            {error.report && (
              <p className="text-red-600 text-sm mt-1">{error.report}</p>
            )}
          </div>

      
          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;