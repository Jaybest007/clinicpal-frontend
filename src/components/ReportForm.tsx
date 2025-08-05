import React, { useEffect, useState, useRef } from "react";
import { FaTimes, FaMicrophone, FaMicrophoneSlash, FaRegClipboard, FaPills, FaFlask, FaXRay, FaHospital } from "react-icons/fa";
import { FiSave, FiAlertCircle, FiCheck } from "react-icons/fi";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { motion, AnimatePresence } from "framer-motion";

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

const TEMPLATE_SUGGESTIONS = [
  {
    name: "General Assessment",
    text: "Patient presents with [symptoms]. Physical examination reveals [findings]. Vital signs are within normal limits. Assessment: [diagnosis]. Plan: [treatment plan]."
  },
  {
    name: "Follow-up Visit",
    text: "Follow-up for [condition]. Patient reports [status update]. Current medications: [medications]. Assessment: [assessment]. Plan: [plan]."
  },
  {
    name: "Post-Procedure",
    text: "Post-procedure follow-up for [procedure] performed on [date]. Patient reports [symptoms]. Wound site shows [description]. Plan: Continue [instructions]."
  }
];

const ReportForm = ({ isOpen, onClose, patient_id }: ReportFormProps) => {
  const { patientsData, loading, newReport, fetch_Admitted_Patient_Report, fetchPatientReport } = useDashboard();
  const { user } = useAuth();
  const [reportData, setReportData] = useState<reportData>({ patient_id: "", report: "", wrote_by: "" });
  const [medications, setMedications] = useState<string[]>([]);
  const [commonMeds, setCommonMeds] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [orderToPharmacy, setOrderToPharmacy] = useState(false);
  const [orderToLab, setOrderToLab] = useState(false);
  const [ultrasoundOrder, setUltrasoundOrder] = useState(false);
  const [xrayOrder, setXrayOrder] = useState(false);
  const [error, setError] = useState({ patient_id: "", report: "", server: "" });
  const [showTemplates, setShowTemplates] = useState(false);
  const [dictationTime, setDictationTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Timer for dictation
  useEffect(() => {
    if (listening) {
      timerRef.current = setInterval(() => {
        setDictationTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDictationTime(0);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [listening]);

  // Format dictation time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Load medications
  useEffect(() => {
    fetch("/medications.json")
      .then((res) => res.json())
      .then((data) => {
        const flatList = new Set<string>();
        const common = new Set<string>();
        
        // Process all medications
        for (const category in data) {
          data[category].forEach((med: any) => {
            if (med.Generic) {
              flatList.add(med.Generic.toLowerCase());
              // Add to common meds if it has the common flag
              if (med.Common) common.add(med.Generic);
            }
            med.Brands?.forEach((brand: string) => flatList.add(brand.toLowerCase()));
          });
        }
        
        setMedications(Array.from(flatList));
        setCommonMeds(Array.from(common).slice(0, 8)); // Limit to 8 common meds
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

  const insertMedication = (med: string) => {
    setReportData(prev => ({
      ...prev,
      report: (prev.report.trim() + " " + med + " ").trimStart()
    }));
    
    // Focus back on textarea after inserting
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const applyTemplate = (template: string) => {
    setReportData(prev => ({
      ...prev,
      report: template
    }));
    setShowTemplates(false);
    
    // Focus and position cursor at first placeholder
    if (textareaRef.current) {
      const position = template.indexOf('[');
      textareaRef.current.focus();
      if (position !== -1) {
        textareaRef.current.setSelectionRange(position, position + 10);
      }
    }
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
        xray_order: xrayOrder,
      });
      setReportData({ patient_id: "", report: "", wrote_by: user?.name || "" });
      resetOrderCheckboxes();
      setError({ patient_id: "", report: "", server: "" });
      fetch_Admitted_Patient_Report();
      if (patient_id) fetchPatientReport({ patient_id });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Something went wrong.";
      setError((prev) => ({ ...prev, server: msg }));
    }
  };

  const resetOrderCheckboxes = () => {
    setOrderToPharmacy(false);
    setOrderToLab(false);
    setUltrasoundOrder(false);
    setXrayOrder(false);
  };

  if (!isOpen) return null;

  const selectedPatient = patientsData.find(p => p.patient_id === (patient_id || reportData.patient_id));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl border border-blue-100 mt-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaRegClipboard className="mr-3 w-6 h-6" />
              <h1 className="text-xl font-bold">Medical Report</h1>
            </div>
            <button
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => {
                resetOrderCheckboxes();
                onClose();
              }}
              aria-label="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          
          {selectedPatient && (
            <div className="mt-4 bg-white/10 rounded-lg p-3 text-sm">
              <span className="font-medium">Patient:</span>{" "}
              <span className="font-semibold">{selectedPatient.full_name}</span>
              <span className="mx-2">•</span>
              <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded">
                {selectedPatient.patient_id.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Form content */}
        <div className="p-6">
          {error.server && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
              <div className="flex">
                <FiAlertCircle className="text-red-500 w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-red-700">{error.server}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection - only show if no patient_id was passed */}
            {!patient_id && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block mb-2 font-medium text-gray-700">Select Patient</label>
                <select
                  name="patient_id"
                  value={reportData.patient_id}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-white border rounded-lg text-sm transition-colors ${error.patient_id ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
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
                  <p className="flex items-center text-red-600 text-sm mt-1">
                    <FiAlertCircle className="mr-1 w-3.5 h-3.5" />
                    {error.patient_id}
                  </p>
                )}
              </div>
            )}

            {/* Report Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-medium text-gray-700">Report Details</label>
                
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Templates
                  </button>
                </div>
              </div>
              
              {/* Template dropdown */}
              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                      <h3 className="text-sm font-medium text-blue-700 mb-2">Select a template:</h3>
                      <div className="space-y-2">
                        {TEMPLATE_SUGGESTIONS.map((template, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => applyTemplate(template.text)}
                            className="w-full text-left text-sm p-2 bg-white hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                          >
                            <span className="font-medium text-blue-800">{template.name}</span>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{template.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Quick medication buttons */}
              {commonMeds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonMeds.map((med, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertMedication(capitalize(med))}
                      className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 transition-colors flex items-center"
                    >
                      <FaPills className="mr-1 w-3 h-3" />
                      {capitalize(med)}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Text area with listening indicator */}
              <div className={`relative rounded-lg overflow-hidden ${listening ? 'ring-2 ring-green-500' : ''}`}>
                {listening && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-green-100">
                    <div className="h-full bg-green-500 animate-pulse" style={{ width: `${Math.min(100, dictationTime * 2)}%` }}></div>
                  </div>
                )}
                
                <textarea
                  ref={textareaRef}
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
                  rows={8}
                  className={`w-full p-4 bg-white border text-sm resize-none transition-colors ${error.report ? 'border-red-300' : 'border-gray-300'} focus:outline-none ${listening ? 'bg-green-50' : ''}`}
                  placeholder="Write or dictate the report here..."
                ></textarea>
                
                {listening && (
                  <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <span className="animate-pulse mr-1">●</span> Recording {formatTime(dictationTime)}
                  </div>
                )}
              </div>
              
              {suggestion && (
                <div className="mt-1 text-sm text-gray-600 bg-blue-50 border border-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 font-medium">💡 Tab to insert:</span> {suggestion}
                </div>
              )}
              
              {error.report && (
                <p className="flex items-center text-red-600 text-sm">
                  <FiAlertCircle className="mr-1 w-3.5 h-3.5" />
                  {error.report}
                </p>
              )}
            </div>

            {/* Dictation Controls */}
            {browserSupportsSpeechRecognition && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Voice Dictation</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => SpeechRecognition.startListening({ continuous: true })}
                    disabled={listening}
                    className={`px-4 py-2 rounded text-sm font-medium flex items-center ${listening ? 'bg-gray-200 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'} transition-colors`}
                  >
                    <FaMicrophone className="mr-2 w-4 h-4" />
                    Start Dictation
                  </button>
                  <button
                    type="button"
                    onClick={() => SpeechRecognition.stopListening()}
                    disabled={!listening}
                    className={`px-4 py-2 rounded text-sm font-medium flex items-center ${!listening ? 'bg-gray-200 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700'} transition-colors`}
                  >
                    <FaMicrophoneSlash className="mr-2 w-4 h-4" />
                    Stop Dictation
                  </button>
                  
                  {listening && (
                    <span className="text-sm text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      Listening... Speak clearly
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Dictation automatically corrects medication names and will be inserted when you stop recording.
                </p>
              </div>
            )}

            {/* Department Orders */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-3">Forward Orders</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center bg-white p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderToPharmacy}
                    onChange={() => setOrderToPharmacy(prev => !prev)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${orderToPharmacy ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {orderToPharmacy && <FiCheck className="text-white w-3 h-3" />}
                  </div>
                  <div className="flex items-center">
                    <FaPills className={`mr-2 ${orderToPharmacy ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm ${orderToPharmacy ? 'font-medium text-blue-900' : 'text-gray-700'}`}>Pharmacy</span>
                  </div>
                </label>
                
                <label className="flex items-center bg-white p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderToLab}
                    onChange={() => setOrderToLab(prev => !prev)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${orderToLab ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {orderToLab && <FiCheck className="text-white w-3 h-3" />}
                  </div>
                  <div className="flex items-center">
                    <FaFlask className={`mr-2 ${orderToLab ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm ${orderToLab ? 'font-medium text-blue-900' : 'text-gray-700'}`}>Laboratory</span>
                  </div>
                </label>
                
                <label className="flex items-center bg-white p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ultrasoundOrder}
                    onChange={() => setUltrasoundOrder(prev => !prev)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${ultrasoundOrder ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {ultrasoundOrder && <FiCheck className="text-white w-3 h-3" />}
                  </div>
                  <div className="flex items-center">
                    <FaHospital className={`mr-2 ${ultrasoundOrder ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm ${ultrasoundOrder ? 'font-medium text-blue-900' : 'text-gray-700'}`}>Ultrasound</span>
                  </div>
                </label>
                
                <label className="flex items-center bg-white p-3 rounded border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={xrayOrder}
                    onChange={() => setXrayOrder(prev => !prev)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${xrayOrder ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {xrayOrder && <FiCheck className="text-white w-3 h-3" />}
                  </div>
                  <div className="flex items-center">
                    <FaXRay className={`mr-2 ${xrayOrder ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm ${xrayOrder ? 'font-medium text-blue-900' : 'text-gray-700'}`}>X-Ray</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm font-medium transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportForm;
