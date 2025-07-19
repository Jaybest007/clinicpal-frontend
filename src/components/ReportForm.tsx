import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

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
  const [reportData, setReportData] = useState<reportData>({ patient_id: "", report: "", wrote_by: "" });
  const [medications, setMedications] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [orderToPharmacy, setOrderToPharmacy] = useState(false);
  const [orderToLab, setOrderToLab] = useState(false);
  const [ultrasoundOrder, setUltrasoundOrder] = useState(false);
  const [error, setError] = useState({ patient_id: "", report: "", server: "" });

  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Load medications
  useEffect(() => {
    fetch("/medications.json")
      .then((res) => res.json())
      .then((data) => {
        const flatList = new Set<string>();
        for (const category in data) {
          data[category].forEach((med: any) => {
            if (med.Generic) flatList.add(med.Generic.toLowerCase());
            med.Brands?.forEach((brand: string) => flatList.add(brand.toLowerCase()));
          });
        }
        setMedications(Array.from(flatList));
      })
      .catch((err) => console.error("Failed to load medications", err));
  }, []);

  useEffect(() => {
    if (user?.name) {
      setReportData((prev) => ({ ...prev, wrote_by: user.name }));
    }
  }, [user?.name]);

  // Merge transcript on stop + refine
  useEffect(() => {
    if (!listening && transcript.trim()) {
      const corrected = refineTranscript(transcript.trim());
      setReportData(prev => ({
        ...prev,
        report: (prev.report + " " + corrected).trim()
      }));
      resetTranscript();
    }
  }, [listening]);

  const refineTranscript = (text: string) => {
    const words = text.split(/\s+/);
    return words.map((word) => {
      const lower = word.toLowerCase();
      const match = medications.find((med) => med.startsWith(lower));
      return match ? capitalize(match) : word;
    }).join(" ");
  };

  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "report") {
      const words = value.split(/\s+/);
      const lastWord = words[words.length - 1].toLowerCase();
      const match = medications.find((med) => med.startsWith(lastWord));
      setSuggestion(match && match !== lastWord ? match : null);
    }
    setReportData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  //========handle submit========
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const selectedPatientId = patient_id || reportData.patient_id;
    const { report } = reportData;

    const newError = {
      patient_id: selectedPatientId.trim() ? "" : "Please select a patient.",
      report: report.trim() ? "" : "Report can't be empty.",
    };
    const hasError = Object.values(newError).some((e) => e !== "");
    if (hasError) return setError((prev) => ({ ...prev, ...newError }));

    try {
      await newReport({
        ...reportData,
        patient_id: selectedPatientId,
        order_to_pharmacy: orderToPharmacy,
        order_to_lab: orderToLab,
        ultrasound_order: ultrasoundOrder,
      });
      setReportData({ patient_id: "", report: "", wrote_by: user?.name || "" });
      setError({ patient_id: "", report: "", server: "" });
      fetch_Admitted_Patient_Report();
      if (patient_id) fetchPatientReport({ patient_id });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Something went wrong.";
      setError((prev) => ({ ...prev, server: msg }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-2 py-8 overflow-y-auto">
      <div className="relative w-full max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 mt-16">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold text-blue-900 border-b pb-3 mb-6">
          Submit Patient Report
        </h1>

        {error.server && (
          <p className="bg-red-100 border border-red-300 text-red-800 p-3 mb-4 rounded text-center">
            {error.server}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-2 font-medium">Select Patient</label>
            <select
              name="patient_id"
              disabled={!!patient_id}
              value={patient_id || reportData.patient_id}
              onChange={handleInputChange}
              className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select patient</option>
              {patientsData
                .filter(p => p.full_name && p.patient_id)
                .map((p) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {`${p.full_name.toUpperCase()} | ${p.patient_id.toUpperCase()}`}
                  </option>
                ))}
            </select>
            {error.patient_id && (
              <p className="text-red-600 text-sm mt-1">{error.patient_id}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Report Details</label>
            <textarea
              name="report"
              value={reportData.report + (listening ? " " + refineTranscript(interimTranscript) : "")}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Tab" && suggestion) {
                  e.preventDefault();
                  const words = reportData.report.trimEnd().split(/\s+/);
                  words[words.length - 1] = suggestion;
                  setReportData((prev) => ({ ...prev, report: words.join(" ") + " " }));
                  setSuggestion(null);
                }
              }}
              rows={6}
              className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write or dictate the report here..."
            ></textarea>
            {suggestion && (
              <div className="mt-1 text-sm text-gray-600">
                💡 Suggested: <span className="text-blue-600 font-medium">{suggestion}</span> (Press Tab to use)
              </div>
            )}
            {error.report && (
              <p className="text-red-600 text-sm mt-1">{error.report}</p>
            )}
          </div>

          {/* Recording indicator */}
          {browserSupportsSpeechRecognition && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => SpeechRecognition.startListening({ continuous: true })}
                disabled={listening}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                🎙️ Start Dictation
              </button>
              <button
                type="button"
                onClick={() => SpeechRecognition.stopListening()}
                disabled={!listening}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                🛑 Stop Dictation
              </button>
              {listening && <span className="text-sm text-red-500 animate-pulse">● Recording in progress...</span>}
            </div>
          )}

          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={orderToPharmacy}
                onChange={() => setOrderToPharmacy(prev => !prev)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-blue-900">Forward prescription to Pharmacy</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={orderToLab}
                onChange={() => setOrderToLab(prev => !prev)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-blue-900">Forward test request to Laboratory</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={ultrasoundOrder}
                onChange={() => setUltrasoundOrder(prev => !prev)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-blue-900">Forward test request to Ultrasound</span>
            </label>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow font-semibold transition"
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
