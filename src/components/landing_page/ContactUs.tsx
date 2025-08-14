import React, { useState } from "react";
import { FiPhone, FiMail, FiMapPin,  FiSend, FiArrowRight, FiCheckCircle, FiHelpCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 opacity-5 transform -skew-y-6"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-400 rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-300 rounded-full opacity-5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Get In Touch
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl max-w-2xl mx-auto"
          >
            We're Here to <span className="text-blue-600">Support</span> Your Healthcare Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions about ClinicPal's hospital management system? Our team is ready to assist you with personalized support and guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h3 className="text-xl font-semibold">Contact Information</h3>
                <p className="mt-2 text-blue-100">
                  Reach out to us through any of these channels for support or inquiries.
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FiPhone className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="mt-1 text-sm text-gray-600">
                      <a href="tel:+2349134769873" className="hover:text-blue-600 transition-colors">
                        +234 913 476 9873
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Mon-Fri from 8am to 5pm
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FiMail className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="mt-1 text-sm text-gray-600">
                      <a href="mailto:care@clinicpal.org" className="hover:text-blue-600 transition-colors">
                        care@clinicpal.org
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FiMapPin className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Office</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Lagos, Nigeria
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Serving hospitals across Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Why Choose Us Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Hospitals Choose ClinicPal</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="ml-3 text-sm text-gray-700">Streamlined patient management system</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="ml-3 text-sm text-gray-700">Reduced administrative workload by 60%</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="ml-3 text-sm text-gray-700">Improved patient data accuracy and security</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="ml-3 text-sm text-gray-700">24/7 technical support and continuous updates</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send Us a Message</h3>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-green-800">Message Sent!</h3>
                  <p className="mt-2 text-sm text-green-700">
                    Thank you for reaching out. We've received your message and will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Pricing & Plans">Pricing & Plans</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Demo Request">Request a Demo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <FiSend className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
            <p className="mt-2 text-lg text-gray-600">Common questions about ClinicPal's services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiHelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">What services does ClinicPal offer?</h4>
                  <p className="mt-2 text-gray-600">
                    ClinicPal offers a comprehensive hospital management system including patient registration, appointment scheduling, billing, pharmacy management, laboratory management, and administrative dashboards.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiHelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">How secure is patient data with ClinicPal?</h4>
                  <p className="mt-2 text-gray-600">
                    ClinicPal employs industry-standard encryption, secure authentication, and regular security audits to ensure patient data remains protected. We comply with healthcare data protection regulations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiHelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Can ClinicPal work offline?</h4>
                  <p className="mt-2 text-gray-600">
                    Yes, ClinicPal has offline capabilities that allow basic functions to continue during internet outages. Data synchronizes automatically when connection is restored.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiHelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">How do I get started with ClinicPal?</h4>
                  <p className="mt-2 text-gray-600">
                    Getting started is easy! Register for an account, complete your hospital profile, and our team will guide you through setup and training. Most hospitals are fully operational within a week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-white">Ready to transform your hospital management?</h3>
            <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
              Join hundreds of healthcare facilities already benefiting from ClinicPal's streamlined solutions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/onboarding"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Start Free Trial
                <FiArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "tel:+2349134769873";
                }}
                className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-lg shadow-sm text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiPhone className="mr-2 h-5 w-5" />
                Call Us Directly
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
