import { useState } from "react";
import { FaTimes, FaUser, FaAddressCard, FaPhone, FaVenusMars, FaBirthdayCake, FaUserFriends } from "react-icons/fa";
import { FiChevronRight, FiChevronLeft, FiSave, FiWifi, FiWifiOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addPatientToLocalDB } from "../db/patientHelpers";
import { toast } from "react-toastify";

interface PatientsData {
  full_name: string;
  address: string;
  gender: string;
  age: string;
  phone: string;
  nok_full_name: string;
  nok_address: string;
  nok_phone: string;
  nok_relationship: string;
  done_by: string;
}

interface NewPatientProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPatient = ({ isOpen, onClose }: NewPatientProps) => {
  const { addNewPatient, loading, fetchAllPatients } = useDashboard();
  const { user } = useAuth();
  const name = user?.name || "";
  const navigate = useNavigate();
  const isOnline = navigator.onLine;
  
  // Form step state (1: Patient Info, 2: Next of Kin)
  const [formStep, setFormStep] = useState(1);

  const [patientData, setPatientData] = useState<PatientsData>({
    full_name: "",
    address: "",
    gender: "",
    age: "",
    phone: "",
    nok_full_name: "",
    nok_address: "",
    nok_phone: "",
    nok_relationship: "",
    done_by: name,
  });

  const [error, setError] = useState({
    full_name: "",
    address: "",
    gender: "",
    age: "",
    phone: "",
    nok_full_name: "",
    nok_address: "",
    nok_phone: "",
    nok_relationship: "",
    server: "",
    done_by: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
    setError(prev => ({ ...prev, [name]: "" }));

    if (name === "phone" || name === "nok_phone") {
      let cleanedPhone = value.replace(/[^\d]/g, "").slice(0, 11);
      setPatientData(prev => ({ ...prev, [name]: cleanedPhone }));
    }

    if (name === "age") {
      let cleanedAge = value.replace(/[^\d]/g, "").slice(0, 3);
      setPatientData(prev => ({ ...prev, [name]: cleanedAge }));
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const newErrors = {
        full_name: patientData.full_name.trim() === "" ? "Full name is required." : "",
        address: patientData.address.trim() === "" ? "Address is required." : "",
        gender: patientData.gender.trim() === "" ? "Gender is required." : "",
        age: patientData.age.trim() === "" ? "Age is required." : "",
        phone: patientData.phone.trim() === "" ? "Phone number is required." : 
               patientData.phone.length < 10 ? "Phone number must be at least 10 digits." : "",
      };
      
      const hasError = Object.values(newErrors).some(err => err !== "");
      
      if (hasError) {
        setError(prev => ({ ...prev, ...newErrors }));
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      const newErrors = {
        nok_full_name: patientData.nok_full_name.trim() === "" ? "Next of kin name is required." : "",
        nok_address: patientData.nok_address.trim() === "" ? "Next of kin address is required." : "",
        nok_phone: patientData.nok_phone.trim() === "" ? "Next of kin phone is required." : 
                  patientData.nok_phone.length < 10 ? "Phone number must be at least 10 digits." : "",
        nok_relationship: patientData.nok_relationship.trim() === "" ? "Relationship is required." : "",
      };
      
      const hasError = Object.values(newErrors).some(err => err !== "");
      
      if (hasError) {
        setError(prev => ({ ...prev, ...newErrors }));
        return false;
      }
      return true;
    }
    
    return false;
  };

  // Next step handler
  const goToNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(2);
    }
  };

  // Previous step handler
  const goToPrevStep = () => {
    setFormStep(1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateStep(formStep)) {
      return;
    }

    // Check if user is logged in
    if (patientData.done_by.trim() === "") {
      setError(prev => ({ ...prev, done_by: "User is not logged in" }));
      return;
    }

    // Reset server error
    setError(prev => ({ ...prev, server: "" }));

    if (!isOnline) {
      try {
        toast.info("You are offline. Patient data will be saved locally.");
        await addPatientToLocalDB({
          ...patientData,
          created_at: new Date().toISOString(),
        } as PatientsData & { created_at: string });
        
        toast.success("Patient data saved locally. Will sync when online.");
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error adding patient to local DB:", error);
        setError(prev => ({ ...prev, server: "Failed to save locally. Please try again." }));
      }
      return;
    }

    try {
      await addNewPatient(patientData);
      toast.success("Patient registered successfully!");
      resetForm();
      fetchAllPatients();
      navigate("/confirmation", { replace: true });
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(prev => ({ ...prev, server: errorMessage }));
    }
  };

  const resetForm = () => {
    setPatientData({
      full_name: "",
      address: "",
      gender: "",
      age: "",
      phone: "",
      nok_full_name: "",
      nok_address: "",
      nok_phone: "",
      nok_relationship: "",
      done_by: name,
    });
    setFormStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              {formStep === 1 ? (
                <FaUser className="mr-2" />
              ) : (
                <FaUserFriends className="mr-2" />
              )}
              {formStep === 1 ? "Patient Registration" : "Next of Kin Details"}
            </h2>
            <button
              className="text-white hover:text-red-200 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress steps */}
          <div className="flex mt-6 mb-2">
            <div className="w-full">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                  ${formStep >= 1 ? "bg-white text-blue-600" : "bg-blue-400 text-white"} 
                  font-bold text-sm`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${formStep >= 2 ? "bg-white" : "bg-blue-400"}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                  ${formStep >= 2 ? "bg-white text-blue-600" : "bg-blue-400 text-white"} 
                  font-bold text-sm`}>
                  2
                </div>
              </div>
              <div className="flex text-xs text-blue-100 mt-2">
                <div className="flex-1 text-center">Patient Information</div>
                <div className="flex-1 text-center">Next of Kin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection status indicator */}
        <div className={`text-xs px-4 py-2 flex items-center ${isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isOnline ? (
            <>
              <FiWifi className="mr-1" /> 
              <span>Online Mode - Data will be saved to the cloud</span>
            </>
          ) : (
            <>
              <FiWifiOff className="mr-1" /> 
              <span>Offline Mode - Data will be saved locally and synced later</span>
            </>
          )}
        </div>

        {/* Server error message */}
        {error.server && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error.server}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            {formStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FaUser className="mr-2 text-blue-500" /> Full Name
                    </label>
                    <input
                      name="full_name"
                      type="text"
                      onChange={handleInputChange}
                      value={patientData.full_name}
                      className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                        ${error.full_name ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter patient's full name"
                    />
                    {error.full_name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error.full_name}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FaAddressCard className="mr-2 text-blue-500" /> Address
                    </label>
                    <input
                      name="address"
                      type="text"
                      onChange={handleInputChange}
                      value={patientData.address}
                      className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                        ${error.address ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter patient's address"
                    />
                    {error.address && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error.address}
                      </p>
                    )}
                  </div>

                  {/* Two-column layout for Gender and Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Gender */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <FaVenusMars className="mr-2 text-blue-500" /> Gender
                      </label>
                      <select
                        name="gender"
                        onChange={handleInputChange}
                        value={patientData.gender}
                        className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                          ${error.gender ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {error.gender && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error.gender}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <FaBirthdayCake className="mr-2 text-blue-500" /> Age
                      </label>
                      <input
                        name="age"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={handleInputChange}
                        value={patientData.age}
                        className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                          ${error.age ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="Enter age in years"
                      />
                      {error.age && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error.age}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FaPhone className="mr-2 text-blue-500" /> Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      onChange={handleInputChange}
                      value={patientData.phone}
                      className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                        ${error.phone ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter patient's phone number"
                    />
                    {error.phone && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error.phone}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {formStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  {/* Next of Kin Full Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FaUser className="mr-2 text-blue-500" /> Next of Kin Full Name
                    </label>
                    <input
                      name="nok_full_name"
                      type="text"
                      onChange={handleInputChange}
                      value={patientData.nok_full_name}
                      className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                        ${error.nok_full_name ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter next of kin's full name"
                    />
                    {error.nok_full_name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error.nok_full_name}
                      </p>
                    )}
                  </div>

                  {/* Next of Kin Address */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FaAddressCard className="mr-2 text-blue-500" /> Next of Kin Address
                    </label>
                    <input
                      name="nok_address"
                      type="text"
                      onChange={handleInputChange}
                      value={patientData.nok_address}
                      className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                        ${error.nok_address ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter next of kin's address"
                    />
                    {error.nok_address && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error.nok_address}
                      </p>
                    )}
                  </div>

                  {/* Two-column layout for Phone and Relationship */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Next of Kin Phone */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <FaPhone className="mr-2 text-blue-500" /> Next of Kin Phone
                      </label>
                      <input
                        name="nok_phone"
                        type="tel"
                        onChange={handleInputChange}
                        value={patientData.nok_phone}
                        className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                          ${error.nok_phone ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="Enter next of kin's phone"
                      />
                      {error.nok_phone && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error.nok_phone}
                        </p>
                      )}
                    </div>

                    {/* Next of Kin Relationship */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <FaUserFriends className="mr-2 text-blue-500" /> Relationship
                      </label>
                      <input
                        name="nok_relationship"
                        type="text"
                        onChange={handleInputChange}
                        value={patientData.nok_relationship}
                        className={`w-full p-3 mt-1 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 
                          ${error.nok_relationship ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="e.g. Mother, Brother, Spouse"
                      />
                      {error.nok_relationship && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error.nok_relationship}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {formStep === 1 ? (
              <div></div> // Empty div to maintain flex spacing
            ) : (
              <button
                type="button"
                onClick={goToPrevStep}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center transition-colors"
              >
                <FiChevronLeft className="mr-1" /> Previous
              </button>
            )}

            {formStep === 1 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center ml-auto transition-colors"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                  text-white rounded-lg flex items-center transition-colors`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-1" /> Register Patient
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewPatient;
