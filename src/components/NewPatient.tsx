import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import {  useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

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

  const handInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
    setError(prev => ({ ...prev, [name]: "" }));

    if (name === "phone" || name === "nok_phone") {
      let cleanedPhone = value.replace(/[^\d]/g, "").slice(0, 11);
      setPatientData(prev => ({ ...prev, [name]: cleanedPhone }));
      setError(prev => ({ ...prev, [name]: "" }));
    }

    if (name === "age") {
      let cleanedAge = value.replace(/[^\d]/g, "").slice(0, 11);
      setPatientData(prev => ({ ...prev, [name]: cleanedAge }));
      setError(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const {
      full_name,
      address,
      gender,
      age,
      phone,
      nok_full_name,
      nok_address,
      nok_phone,
      nok_relationship,
      done_by,
    } = patientData;

    const newErrors = {
      full_name: full_name.trim() === "" ? "Full name is required." : "",
      address: address.trim() === "" ? "Address is required." : "",
      gender: gender.trim() === "" ? "Gender is required." : "",
      age: age.trim() === "" ? "Age is required." : "",
      phone: phone.trim() === "" ? "Phone number is required." : "",
      nok_full_name: nok_full_name.trim() === "" ? "Next of kin full name is required." : "",
      nok_address: nok_address.trim() === "" ? "Next of kin address is required." : "",
      nok_phone: nok_phone.trim() === "" ? "Next of kin phone number is required." : "",
      nok_relationship: nok_relationship.trim() === "" ? "Next of kin relationship is required." : "",
      done_by: done_by.trim() === "" ? "User is not logged in" : "",
    };

    const hasError = Object.values(newErrors).some(err => err !== "");

    if (hasError) {
      setError({ ...newErrors, server: "" });
      return;
    }

    setError({
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

    try {
      await addNewPatient(patientData);
      setError(prev => ({ ...prev, server: "" }));

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

      fetchAllPatients();
      navigate("/confirmation", {replace:true});
      onClose(); // Close modal after successful submit
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(prev => ({ ...prev, server: errorMessage }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-2 py-8 overflow-y-auto">
      <div className="relative w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-12 border border-blue-100 animate-fade-in mt-5">
        
        <form onSubmit={handleSubmit} className="space-y-8">
         
          <section>
            <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes className="w-6 h-6" />
        </button>
         {/* Patient Information */}
            <h2 className="text-2xl font-bold text-blue-900 border-b pb-3 mb-6">
              Patient Information
            </h2>

            {error.server && (
              <p className="text-red-800 text-center bg-red-100 p-3 mb-4 rounded border border-red-300">
                {error.server}
              </p>
            )}
            {error.done_by && <p className="text-red-600 text-sm mt-1">{error.done_by}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="font-medium text-gray-700">Full name</label>
                <input
                  name="full_name"
                  type="text"
                  onChange={handInputChange}
                  value={patientData.full_name}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter patient full name"
                />
                {error.full_name && <p className="text-red-600 text-sm mt-1">{error.full_name}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700">Address</label>
                <input
                  name="address"
                  type="text"
                  onChange={handInputChange}
                  value={patientData.address}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter patient address"
                />
                {error.address && <p className="text-red-600 text-sm mt-1">{error.address}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  onChange={handInputChange}
                  value={patientData.gender}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {error.gender && <p className="text-red-600 text-sm mt-1">{error.gender}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700">Age</label>
                <input
                  name="age"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={handInputChange}
                  value={patientData.age}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter patient age"
                />
                {error.age && <p className="text-red-600 text-sm mt-1">{error.age}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Phone number</label>
                <input
                  name="phone"
                  type="tel"
                  onChange={handInputChange}
                  value={patientData.phone}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter patient phone number"
                />
                {error.phone && <p className="text-red-600 text-sm mt-1">{error.phone}</p>}
              </div>
            </div>
          </section>

          {/* Next of Kin */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 border-b pb-3 mb-6">
              Next of Kin
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="font-medium text-gray-700">Full name</label>
                <input
                  name="nok_full_name"
                  type="text"
                  onChange={handInputChange}
                  value={patientData.nok_full_name}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter next of kin's full name"
                />
                {error.nok_full_name && <p className="text-red-600 text-sm mt-1">{error.nok_full_name}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700">Address</label>
                <input
                  name="nok_address"
                  type="text"
                  onChange={handInputChange}
                  value={patientData.nok_address}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter next of kin's address"
                />
                {error.nok_address && <p className="text-red-600 text-sm mt-1">{error.nok_address}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700">Phone number</label>
                <input
                  name="nok_phone"
                  type="tel"
                  onChange={handInputChange}
                  value={patientData.nok_phone}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Next of kin phone"
                />
                {error.nok_phone && <p className="text-red-600 text-sm mt-1">{error.nok_phone}</p>}
              </div>

              <div>
                <label className="font-medium text-gray-700">Relationship</label>
                <input
                  name="nok_relationship"
                  type="text"
                  onChange={handInputChange}
                  value={patientData.nok_relationship}
                  className="w-full p-3 mt-1 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. Sister, Father"
                />
                {error.nok_relationship && <p className="text-red-600 text-sm mt-1">{error.nok_relationship}</p>}
              </div>
            </div>
          </section>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? "Adding New Patient..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatient;
