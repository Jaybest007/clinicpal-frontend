
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiClock, FiAlertCircle, FiActivity, FiLink, FiClipboard } from "react-icons/fi";
import { RiMedicineBottleLine, RiTestTubeLine, RiHospitalLine } from "react-icons/ri";
import { TbRadar, TbReportMedical } from "react-icons/tb";

export const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    
    // Define TypeScript interface for feature
    interface Feature {
        title: string;
        included: boolean;
        divider?: boolean;
        coming?: boolean;
    }
    
    // Calculate yearly prices (20% discount)
    const getYearlyPrice = (monthlyPrice: number) => {
        const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
        return Math.round(yearlyPrice);
    };

    // Department features highlighting integration points
    const departments = [
        {
            id: "pharmacy",
            name: "Pharmacy",
            icon: <RiMedicineBottleLine className="w-6 h-6" />,
            description: "Inventory management, dispensing, and prescription tracking",
            features: [
                "Real-time inventory tracking",
                "Prescription management",
                "Automatic reorder notifications",
                "Integrated billing with main system",
                "Drug interaction warnings",
                "Patient medication history"
            ]
        },
        {
            id: "laboratory",
            name: "Laboratory",
            icon: <RiTestTubeLine className="w-6 h-6" />,
            description: "Lab test management, results reporting, and sample tracking",
            features: [
                "Digital test requisitions",
                "Results reporting with normal ranges",
                "Sample tracking system",
                "Integration with EMR",
                "Automatic notifications when results are ready",
                "Historical test result comparison"
            ]
        },
        {
            id: "xray",
            name: "X-Ray",
            icon: <RiHospitalLine className="w-6 h-6" />,
            description: "Radiology order management and digital imaging",
            features: [
                "Digital imaging storage",
                "Radiologist note system",
                "Integration with main patient records",
                "Film usage tracking",
                "Appointment scheduling",
                "Study comparison tools"
            ]
        },
        {
            id: "ultrasound",
            name: "Ultrasound",
            icon: <TbRadar className="w-6 h-6" />,
            description: "Ultrasound studies management and reporting",
            features: [
                "Digital image storage",
                "Structured reporting templates",
                "Integration with patient history",
                "Appointment scheduling",
                "Result notifications",
                "Measurement tools and tracking"
            ]
        },
        {
            id: "reporting",
            name: "Reporting System",
            icon: <TbReportMedical className="w-6 h-6" />,
            description: "Comprehensive reporting across all departments",
            features: [
                "Cross-department analytics",
                "Custom report builder",
                "Scheduled report generation",
                "Export capabilities (PDF, Excel)",
                "Visual dashboards",
                "Regulatory compliance reporting"
            ]
        }
    ];

    interface Tier {
        name: string;
        subtitle: string;
        monthlyPrice: number;
        yearlyPrice: number;
        highlighted: boolean;
        popular?: boolean;
        features: Feature[];
        ctaText: string;
        ctaLink: string;
    }

    const tiers: Tier[] = [
        {
            name: "Standard",
            subtitle: "Perfect for small clinics & individual practitioners",
            monthlyPrice: 25000,
            yearlyPrice: getYearlyPrice(25000),
            highlighted: false,
            features: [
                { title: "Patient Records Management", included: true },
                { title: "Appointment Scheduling", included: true },
                { title: "Basic Reporting", included: true },
                { title: "Billing & Invoicing", included: true },
                { title: "Secure Data Storage", included: true },
                { title: "User Role Management (3 roles)", included: true },
                { title: "Email Support", included: true },
                { title: "SMS Notifications", included: false, coming: true },
                { title: "Pharmacy Module (Basic)", included: false },
                { title: "Laboratory Module", included: false },
                { title: "X-Ray Department", included: false },
                { title: "Ultrasound Department", included: false },
                { title: "Offline-First Capability", included: false, coming: true },
                { title: "Cross-Department Integration", included: false },
                { title: "Data Analytics Dashboard", included: false },
            ],
            ctaText: "Start 14-Day Trial",
            ctaLink: "/signup"
        },
        {
            name: "Professional",
            subtitle: "Ideal for growing clinics with multiple departments",
            monthlyPrice: 35000,
            yearlyPrice: getYearlyPrice(35000),
            highlighted: true,
            popular: true,
            features: [
                { title: "Everything in Standard, plus:", included: true, divider: true },
                { title: "Multi-department Support (up to 5)", included: true },
                { title: "Pharmacy Inventory Management", included: true },
                { title: "Laboratory Test Management", included: true },
                { title: "X-Ray Order & Result System", included: true },
                { title: "Ultrasound Reporting", included: true },
                { title: "Cross-Department Integration", included: true },
                { title: "Advanced Reporting", included: true },
                { title: "Patient Portal Access", included: true },
                { title: "Internal Order System", included: true },
                { title: "Audit Trails & Transaction Logging", included: true },
                { title: "Priority Email & Phone Support", included: true },
                { title: "SMS Notifications", included: true },
                { title: "Custom Branding", included: false },
                { title: "Advanced Analytics", included: false },
                { title: "Offline-First Capability", included: false, coming: true },
            ],
            ctaText: "Start 14-Day Trial",
            ctaLink: "/signup"
        },
        {
            name: "Enterprise",
            subtitle: "Complete solution for hospitals & healthcare networks",
            monthlyPrice: 60000,
            yearlyPrice: getYearlyPrice(60000),
            highlighted: false,
            features: [
                { title: "Everything in Professional, plus:", included: true, divider: true },
                { title: "Unlimited Departments", included: true },
                { title: "Advanced Pharmacy Inventory Analytics", included: true },
                { title: "Complete Laboratory Information System", included: true },
                { title: "Enhanced Radiology Information System", included: true },
                { title: "Comprehensive Ultrasound Reporting", included: true },
                { title: "Full Cross-Department Workflows", included: true },
                { title: "Custom Integrations", included: true },
                { title: "Advanced Analytics & Business Intelligence", included: true },
                { title: "Custom Branding", included: true },
                { title: "Multi-location Support", included: true },
                { title: "Dedicated Account Manager", included: true },
                { title: "API Access", included: true },
                { title: "Training & Onboarding Support", included: true },
                { title: "SLA with 99.9% Uptime Guarantee", included: true },
                { title: "Custom Reports", included: true },
                { title: "Offline-First Capability", included: true },
            ],
            ctaText: "Contact Sales",
            ctaLink: "/contact"
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-gradient-to-br from-white via-blue-50 to-white px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4"
                    >
                        Flexible Pricing
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        Choose the Perfect Plan for Your Healthcare Facility
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 text-lg max-w-3xl mx-auto"
                    >
                        Scale your digital healthcare operations with a plan that grows with you. All plans include our core patient management features.
                    </motion.p>
                </div>

                {/* Department Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-16"
                >
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Seamlessly Connected Departments</h3>
                    <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
                        ClinicPal connects all your critical departments into one unified system, ensuring smooth workflows and comprehensive patient care.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {departments.map((dept) => (
                            <motion.div
                                key={dept.id}
                                className={`cursor-pointer p-4 rounded-lg text-center transition-all duration-200 ${
                                    selectedDepartment === dept.id 
                                        ? "bg-blue-600 text-white shadow-lg" 
                                        : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md"
                                }`}
                                onClick={() => setSelectedDepartment(dept.id === selectedDepartment ? null : dept.id)}
                                whileHover={{ y: -5 }}
                            >
                                <div className={`mx-auto flex justify-center mb-3 ${
                                    selectedDepartment === dept.id ? "text-white" : "text-blue-600"
                                }`}>
                                    {dept.icon}
                                </div>
                                <h4 className="font-semibold text-sm">{dept.name}</h4>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Department Detail View */}
                    <AnimatePresence>
                        {selectedDepartment && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden"
                            >
                                {departments.map((dept) => (
                                    dept.id === selectedDepartment && (
                                        <div key={dept.id} className="p-6">
                                            <div className="flex items-center mb-4">
                                                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                                                    {dept.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900">{dept.name}</h4>
                                                    <p className="text-gray-600">{dept.description}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                        <FiClipboard className="mr-2 text-blue-600" /> Key Features
                                                    </h5>
                                                    <ul className="space-y-2">
                                                        {dept.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-start">
                                                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                                                <span className="text-gray-700 text-sm">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                        <FiLink className="mr-2 text-blue-600" /> Integration Points
                                                    </h5>
                                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                        <div className="flex items-center mb-3">
                                                            <FiActivity className="text-blue-600 mr-2" />
                                                            <h6 className="font-medium text-gray-900">Connected Workflow</h6>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-4">
                                                            The {dept.name} module seamlessly connects with other departments, creating an integrated healthcare ecosystem.
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {departments
                                                                .filter(d => d.id !== dept.id)
                                                                .map(d => (
                                                                    <span 
                                                                        key={d.id} 
                                                                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-flex items-center"
                                                                        onClick={() => setSelectedDepartment(d.id)}
                                                                    >
                                                                        {d.name}
                                                                    </span>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Integration Diagram */}
                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <h5 className="font-semibold text-gray-900 mb-3">Available in Plans</h5>
                                                <div className="flex space-x-4">
                                                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                        dept.id === 'reporting' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        Standard
                                                    </div>
                                                    <div className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
                                                        Professional
                                                    </div>
                                                    <div className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700">
                                                        Enterprise
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Integration Visualization */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-block relative">
                            <div className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-lg inline-block mb-4">
                                <span className="font-semibold">Unified Patient Record</span>
                            </div>
                            <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-px h-10 bg-blue-300"></div>
                        </div>
                        
                        <div className="mt-10 grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 max-w-3xl mx-auto">
                            {departments.map((dept, idx) => (
                                <div key={dept.id} className="relative">
                                    {idx > 0 && (
                                        <div className="absolute top-1/2 -left-2 md:-left-4 transform -translate-y-1/2 w-4 md:w-8 h-px bg-blue-300"></div>
                                    )}
                                    <motion.div
                                        whileHover={{ y: -3, scale: 1.05 }}
                                        className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 hover:border-blue-300 hover:shadow transition-all duration-200 cursor-pointer"
                                        onClick={() => setSelectedDepartment(dept.id)}
                                    >
                                        <div className="text-blue-600 flex justify-center mb-2">
                                            {dept.icon}
                                        </div>
                                        <p className="text-xs font-medium text-gray-800">{dept.name}</p>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-10 bg-gray-50 rounded-xl p-6 max-w-3xl mx-auto">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h5 className="font-semibold text-gray-900 mb-1">Why Integration Matters</h5>
                                    <p className="text-sm text-gray-600">
                                        With ClinicPal, a prescription ordered in a patient's file is instantly visible to the pharmacy. 
                                        Lab results automatically flow back to the ordering physician. X-ray and ultrasound studies 
                                        connect directly to patient records, ensuring seamless coordination across all departments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Billing Toggle */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center mb-12"
                >
                    <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`${
                                billingCycle === "monthly"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "bg-transparent text-gray-600 hover:bg-gray-200"
                            } px-6 py-2 rounded-md transition-all duration-200 font-medium`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`${
                                billingCycle === "yearly"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "bg-transparent text-gray-600 hover:bg-gray-200"
                            } px-6 py-2 rounded-md transition-all duration-200 font-medium relative`}
                        >
                            Yearly
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                20% off
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                            className={`relative rounded-2xl overflow-hidden ${
                                tier.highlighted
                                    ? "shadow-xl border-2 border-blue-500 transform lg:-translate-y-4"
                                    : "shadow-lg border border-gray-200"
                            }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-4 text-sm font-semibold transform translate-x-6 -translate-y-0 rotate-45 transform-origin-center">
                                    Popular
                                </div>
                            )}
                            
                            <div className={`p-8 ${tier.highlighted ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" : "bg-white"}`}>
                                <h3 className={`text-xl font-bold mb-1 ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                                    {tier.name}
                                </h3>
                                <p className={`text-sm mb-6 ${tier.highlighted ? "text-blue-100" : "text-gray-500"}`}>
                                    {tier.subtitle}
                                </p>
                                <div className="flex items-baseline mb-6">
                                    <span className={`text-4xl font-bold ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                                        ₦{billingCycle === "monthly" ? tier.monthlyPrice.toLocaleString() : tier.yearlyPrice.toLocaleString()}
                                    </span>
                                    <span className={`ml-2 ${tier.highlighted ? "text-blue-100" : "text-gray-500"}`}>
                                        /{billingCycle === "monthly" ? "month" : "year"}
                                    </span>
                                </div>
                                <a
                                    href={tier.ctaLink}
                                    className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-all duration-200 ${
                                        tier.highlighted
                                            ? "bg-white text-blue-600 hover:bg-blue-50"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {tier.ctaText}
                                </a>
                            </div>

                            <div className="bg-white p-8">
                                <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
                                <ul className="space-y-3 mb-6">
                                    {tier.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className={`flex items-start ${feature.divider ? "pb-2 mb-2 border-b border-gray-100" : ""}`}>
                                            {feature.included ? (
                                                <FiCheck className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                            ) : feature.coming ? (
                                                <FiClock className="w-5 h-5 text-orange-400 mt-0.5 mr-3 flex-shrink-0" />
                                            ) : (
                                                <FiAlertCircle className="w-5 h-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                                            )}
                                            <span className={`text-sm ${feature.included ? "text-gray-700" : feature.coming ? "text-gray-600" : "text-gray-400"}`}>
                                                {feature.title}
                                                {feature.coming && !feature.included && (
                                                    <span className="ml-2 text-xs text-orange-500 font-medium">Coming Soon</span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Department Integration Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl"
                >
                    <div className="px-8 py-10 text-center md:text-left md:flex items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Seamless Department Integration</h3>
                            <p className="text-blue-100">
                                Experience workflow efficiency with our interconnected department modules. From pharmacy to radiology, all working together.
                            </p>
                        </div>
                        <a href="/contact" className="inline-block py-3 px-8 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200">
                            Schedule Demo
                        </a>
                    </div>
                </motion.div>

                {/* FAQs */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-20"
                >
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2">Can I add departments as we grow?</h4>
                            <p className="text-gray-600 text-sm">Yes, you can start with a basic plan and add departments as your facility grows. Our system is designed to scale with your needs.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2">How does the department integration work?</h4>
                            <p className="text-gray-600 text-sm">All departments share a unified patient record system. Orders, results, and treatments flow seamlessly between departments with real-time updates.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2">Do you offer training for all departments?</h4>
                            <p className="text-gray-600 text-sm">Yes, we provide role-specific training for each department's staff. Enterprise plans include comprehensive training for all department personnel.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2">Can we customize department workflows?</h4>
                            <p className="text-gray-600 text-sm">Professional plans offer some customization, while Enterprise plans provide fully customizable workflows tailored to your facility's specific processes.</p>
                        </div>
                    </div>
                </motion.div>
                
                {/* Department Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-16 overflow-hidden"
                >
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Department Features Across Plans</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold">Department</th>
                                    <th className="py-3 px-4 text-center font-semibold">Standard</th>
                                    <th className="py-3 px-4 text-center font-semibold">Professional</th>
                                    <th className="py-3 px-4 text-center font-semibold">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 px-4 font-medium">Pharmacy</td>
                                    <td className="py-3 px-4 text-center">Basic prescriptions</td>
                                    <td className="py-3 px-4 text-center">Full inventory + dispensing</td>
                                    <td className="py-3 px-4 text-center">Advanced analytics + multi-location</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Laboratory</td>
                                    <td className="py-3 px-4 text-center">—</td>
                                    <td className="py-3 px-4 text-center">Test ordering + results</td>
                                    <td className="py-3 px-4 text-center">Complete LIS + customizable panels</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">X-Ray</td>
                                    <td className="py-3 px-4 text-center">—</td>
                                    <td className="py-3 px-4 text-center">Basic imaging + reports</td>
                                    <td className="py-3 px-4 text-center">Full RIS + advanced storage</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Ultrasound</td>
                                    <td className="py-3 px-4 text-center">—</td>
                                    <td className="py-3 px-4 text-center">Basic reporting</td>
                                    <td className="py-3 px-4 text-center">Advanced templates + measurements</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Reporting</td>
                                    <td className="py-3 px-4 text-center">Basic reports</td>
                                    <td className="py-3 px-4 text-center">Advanced reports</td>
                                    <td className="py-3 px-4 text-center">Custom reports + analytics</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Cross-Department Integration</td>
                                    <td className="py-3 px-4 text-center">Limited</td>
                                    <td className="py-3 px-4 text-center">Comprehensive</td>
                                    <td className="py-3 px-4 text-center">Full custom workflows</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
                
                {/* Enterprise Custom Solution */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl"
                >
                    <div className="px-8 py-10 text-center md:text-left md:flex items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Need a Custom Solution?</h3>
                            <p className="text-gray-300">
                                Contact our team for a tailored quote based on your specific healthcare facility needs.
                            </p>
                        </div>
                        <a href="/contact" className="inline-block py-3 px-8 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200">
                            Contact Sales
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};