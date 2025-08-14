import pic1 from "../assets/pic.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import problem from "../assets/cards.webp";
import { FiFileText, FiUsers, FiPieChart, FiClipboard, FiServer, FiShield, FiMessageCircle, FiCheckCircle } from "react-icons/fi";
import { MdOutlineHealthAndSafety, MdOutlineReceiptLong } from "react-icons/md";
import { RiHospitalLine } from "react-icons/ri";
import { LandingPageNav } from "../components/landing_page/LandingpageNav";

// Feature card component for better reusability
type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  delay?: number;
};

const FeatureCard = ({ title, description, icon: Icon, delay = 0 }: FeatureCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.5, 
      delay: delay,
      ease: "easeOut"
    }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-blue-500"
  >
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Stat component for impact section
type StatCardProps = {
  value: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  delay?: number;
};

const StatCard = ({ value, label, icon: Icon, delay = 0 }: StatCardProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.5, 
      delay: delay,
      ease: "easeOut"
    }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center"
  >
    <div className="p-3 rounded-full bg-blue-50 mb-3">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <p className="text-3xl font-bold text-blue-700 mb-1">{value}</p>
    <p className="text-gray-600 text-center">{label}</p>
  </motion.div>
);

const LandingPage = () => {
  

  

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      {/* Enhanced Navbar */}
      <LandingPageNav />

      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 z-0"></div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <div>
                  <motion.span 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4"
                  >
                    Healthcare Management Platform
                  </motion.span>
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-4xl sm:text-5xl font-bold leading-tight text-slate-800"
                  >
                    Digital <span className="text-blue-600">Healthcare Records</span> for Modern Clinics
                  </motion.h1>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-slate-600 text-lg leading-relaxed"
                >
                  Transform your hospital's workflow with ClinicPal an enterprise-grade management solution built specifically for Nigerian healthcare facilities, replacing paper records with a secure digital system.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-row flex-wrap gap-2 w-full"
                >
                  <Link
                    to="/signup"
                    className="flex-1 min-w-[120px] px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 text-sm"
                  >
                    Start Free Trial <span className="ml-1">→</span>
                  </Link>
                  <a
                    href="#demo"
                    className="flex-1 min-w-[120px] px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 shadow-sm text-sm flex items-center justify-center"
                  >
                    Request Demo
                  </a>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center gap-2 text-sm text-slate-500"
                >
                  <FiCheckCircle className="text-green-500" />
                  <span>No credit card required</span>
                  <span className="mx-2">•</span>
                  <FiCheckCircle className="text-green-500" />
                  <span>14-day free trial</span>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-green-500/10 rounded-3xl transform rotate-3"></div>
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  src={pic1} 
                  alt="ClinicPal Dashboard" 
                  className="relative rounded-2xl shadow-lg w-full max-w-lg mx-auto" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section id="benefits" className="py-20 bg-white px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.img 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              src={problem} 
              alt="Healthcare challenges" 
              className="rounded-xl shadow-md" 
            />
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-blue-600 font-medium"
              >
                The Challenge
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-gray-900"
              >
                Why Nigerian Healthcare Needs Digital Transformation
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 text-lg leading-relaxed"
              >
                Healthcare facilities across Nigeria face critical challenges with paper-based systems: 
                lost records, prescription errors, lengthy patient wait times, and administrative inefficiencies.
              </motion.p>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 p-1 rounded-full bg-red-100">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Paper records get damaged, lost, or become illegible over time</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 p-1 rounded-full bg-red-100">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Manual billing creates room for financial discrepancies</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 p-1 rounded-full bg-red-100">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Departments struggle to communicate effectively, delaying care</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Key Features Section */}
        <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-green-50 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-medium">Comprehensive Solution</span>
              <h2 className="text-3xl font-bold mt-2 text-gray-900">Enterprise-Grade Features</h2>
              <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
                ClinicPal delivers a complete suite of tools designed specifically for Nigerian healthcare providers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                title="Patient Profile Management" 
                description="Create, store, and retrieve complete patient profiles with medical history, demographics, and contact information."
                icon={FiUsers}
              />
              <FeatureCard 
                title="Visit & Treatment Tracking" 
                description="Document every patient visit with detailed treatment notes, prescriptions, and follow-up requirements."
                icon={MdOutlineHealthAndSafety}
              />
              <FeatureCard 
                title="Internal Order System" 
                description="Doctors can create and track lab orders, prescriptions, and tests across departments."
                icon={FiClipboard}
              />
              <FeatureCard 
                title="Inter-Department Communication" 
                description="Seamless information sharing between consultation, pharmacy, lab, and other units."
                icon={FiMessageCircle}
              />
              <FeatureCard 
                title="Digital Prescriptions" 
                description="Create, manage and track prescriptions digitally, eliminating errors and improving safety."
                icon={FiFileText}
              />
              <FeatureCard 
                title="Automated Billing" 
                description="Generate receipts, process payments, and maintain complete financial records automatically."
                icon={MdOutlineReceiptLong}
              />
              <FeatureCard 
                title="Admin Dashboard & Controls" 
                description="Comprehensive oversight with role-based permissions and data access controls."
                icon={FiPieChart}
              />
              <FeatureCard 
                title="SMS Notifications" 
                description="Optional patient reminders for appointments, prescription refills, and test results."
                icon={FiMessageCircle}
              />
              <FeatureCard 
                title="Transaction Logging" 
                description="Complete audit trails for all financial transactions, including top-ups and withdrawals."
                icon={FiServer}
              />
            </div>
          </div>
        </section>

        {/* Enhanced Impact Section */}
        <section className="py-20 bg-white px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-medium">Real Results</span>
              <h2 className="text-3xl font-bold mt-2 text-gray-900">Transforming Healthcare Delivery</h2>
              <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
                ClinicPal is making a measurable difference for healthcare providers across Nigeria.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                value="40%"
                label="Reduction in patient wait times"
                icon={FiUsers}
              />
              <StatCard
                value="60%"
                label="Less administrative work"
                icon={FiClipboard}
              />
              <StatCard
                value="99.9%"
                label="System uptime reliability"
                icon={FiServer}
              />
            </div>
          </div>
        </section>

        {/* Tech Stack Section with more context */}
        <section className="py-20 bg-slate-50 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-medium">Reliable Infrastructure</span>
              <h2 className="text-3xl font-bold mt-2 text-gray-900">Built for Performance & Reliability</h2>
              <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
                ClinicPal is engineered to deliver exceptional performance even in challenging connectivity environments.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Enterprise-Grade Technology</h3>
                <p className="text-gray-600">
                  Our platform is built on proven technologies that prioritize security, speed, and reliability:
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { name: "PostgreSQL", desc: "Enterprise database" },
                  { name: "Express", desc: "Secure API framework" },
                  { name: "React", desc: "Modern UI library" },
                  { name: "TypeScript", desc: "Type-safe code" },
                  { name: "Render", desc: "Cloud hosting" },
                  { name: "Offline-First", desc: "Coming soon" }
                ].map((tech, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-slate-50 transition-all duration-200">
                    <div className="p-3 bg-blue-50 rounded-full mb-3">
                      <FiShield className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{tech.name}</h4>
                    <p className="text-gray-500 text-sm">{tech.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-100">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Offline-First Support Coming Soon</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Work seamlessly even during internet outages with our upcoming offline-first capability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonial Section */}
        <section id="testimonials" className="py-20 bg-white px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <span className="text-blue-600 font-medium">Success Stories</span>
              <h2 className="text-3xl font-bold mt-2 text-gray-900">Trusted by Healthcare Leaders</h2>
              <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
                Healthcare professionals across Nigeria are experiencing the benefits of ClinicPal.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-slate-50 p-8 rounded-xl relative"
              >
                <svg className="absolute top-4 left-4 w-10 h-10 text-blue-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="ml-6">
                  <p className="text-gray-700 italic mb-6">
                    "ClinicPal has transformed how we operate. Our staff adapted quickly, and patient satisfaction has increased dramatically. The ability to access records instantly has been a game-changer."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <RiHospitalLine className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Dr. Adebayo Johnson</p>
                      <p className="text-sm text-gray-600">Medical Director, CityCare Clinic, Lagos</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-slate-50 p-8 rounded-xl relative"
              >
                <svg className="absolute top-4 left-4 w-10 h-10 text-blue-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="ml-6">
                  <p className="text-gray-700 italic mb-6">
                    "The billing system alone has saved us countless hours and significantly reduced errors. As a hospital administrator, I appreciate how ClinicPal gives me complete visibility into our operations."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <RiHospitalLine className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mrs. Oluwaseun Adeyemi</p>
                      <p className="text-sm text-gray-600">Administrator, Healing Hands Hospital, Abuja</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Healthcare Facility Today</h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join the digital healthcare revolution and provide better patient care with ClinicPal.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup" className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg">
                Start Your Free Trial
              </Link>
              <a href="#demo" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Schedule a Demo
              </a>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 text-blue-200"
            >
              No credit card required. 14-day free trial. Cancel anytime.
            </motion.p>
          </motion.div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-slate-900 text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />
                  <span className="font-semibold text-xl">ClinicPal</span>
                </div>
                <p className="text-slate-400 mb-6">
                  Enterprise healthcare management for Nigerian clinics and hospitals.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Product</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Company</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 mt-8 border-t border-slate-800 text-center text-slate-500">
              <p>&copy; {new Date().getFullYear()} ClinicPal. Built for Africa. Powered by excellence.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
