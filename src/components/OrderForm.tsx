import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderData) => void;
}

interface OrderData {
  full_name: string;
  age: string;
  order_type: "lab" | "xray" | "ultrasound" | "motuary";
  description: string;
  sent_by: string;
}

const OrderForm = ({ isOpen, onClose, onSubmit }: OrderFormProps) => {
  const [formData, setFormData] = useState<OrderData>({
    full_name: "",
    age: "",
    order_type: "lab",
    description: "",
    sent_by: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderData, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof OrderData, string>> = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required.";
    if (!formData.age.trim()) newErrors.age = "Age is required.";
    if (!formData.description.trim()) newErrors.description = "Order details are required.";
    if (!formData.sent_by.trim()) newErrors.sent_by = "Sent by is required.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
    onClose();
    setFormData({
      full_name: "",
      age: "",
      order_type: "lab",
      description: "",
      sent_by: "",
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 py-12 overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl p-6 border border-blue-100 animate-fade-in mt-8">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-blue-900 mb-6 border-b pb-2">
          Submit Service Order
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
            <select
              name="order_type"
              value={formData.order_type}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="lab">Lab</option>
              <option value="xray">X-Ray</option>
              <option value="ultrasound">Ultrasound</option>
              <option value="motuary">Motuary</option>
            </select>
          </div>

          {/* Order Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Details</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe scan/test purpose..."
              className="w-full p-2 border rounded bg-blue-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Sent By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sent By</label>
            <input
              type="text"
              name="sent_by"
              value={formData.sent_by}
              onChange={handleChange}
              placeholder="Dr. John / Reception / Lab Desk"
              className="w-full p-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.sent_by && <p className="text-red-500 text-xs mt-1">{errors.sent_by}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 font-medium transition-colors focus:ring-2 focus:ring-blue-400"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
