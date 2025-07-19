import pic1 from "../assets/pic.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import problem from "../assets/cards.webp";

const LandingPage = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />

          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#about" className="text-slate-600 hover:text-blue-700 transition">About</a>
            <a href="#features" className="text-slate-600 hover:text-blue-700 transition">Features</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-700 transition">Contact</a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow"
            >
              Login
            </Link>
          </nav>
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-6 pb-4 pt-2 space-y-3 bg-white border-t border-slate-200">
            <a href="#about" className="block text-slate-600 hover:text-blue-700">About</a>
            <a href="#features" className="block text-slate-600 hover:text-blue-700">Features</a>
            <a href="#contact" className="block text-slate-600 hover:text-blue-700">Contact</a>
            <Link to="/login" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero */}
        <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-800">
                Transforming Healthcare in Nigeria <br /> through <span className="text-blue-600">Technology</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Enterprise-grade management software built for Nigerian hospitals, simple, secure, and designed for real care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition shadow">
                  Get started
                </Link>
                <Link to="/docs" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md font-semibold hover:bg-blue-50 transition shadow">
                  See Documentation
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img src={pic1} alt="Clinic dashboard illustration" className="w-full max-w-md mx-auto" />
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="py-20 bg-blue-50 px-6 md:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                ["Appointment Scheduling", "Streamline patient booking and visits."],
                ["Admission & Discharge Workflows", "Digitally manage inpatient care from entry to exit."],
                ["Secure Role-Based Reporting", "Only the right staff access sensitive data."],
                ["Pharmacy & Lab Orders", "Order, fulfill, and track medications and lab work digitally."],
                ["Doctor Dashboard", "Track patient activity, notes, and follow-ups from a unified view."],
                ["HIPAA-Ready Encryption", "Every record encrypted and cloud-secured."]
              ].map(([title, desc], index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">{title}</h3>
                  <p className="text-slate-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-20 bg-white px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Impact in Numbers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xl text-blue-700 font-semibold">
              <p>🚀 Reduced patient wait times by 40%</p>
              <p>🏥 Trusted by clinics across Nigeria</p>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="py-20 bg-gray-100 px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Built with the Best Tech Stack</h2>
            <p className="text-gray-600 text-lg mb-6">Modern infrastructure for Nigerian healthcare:</p>
            <div className="flex flex-wrap justify-center gap-6 text-blue-800 font-medium">
              <span>⚙️ PostgreSQL</span>
              <span>🧠 Express</span>
              <span>⚛️ React</span>
              <span>⚡ Vite</span>
              <span>📝 TypeScript</span>
              <span>🌐 Render</span>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 bg-white px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <img src={problem} alt="Paperwork inefficiency" className="rounded-lg shadow-md" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Why ClinicPal Matters</h2>
              <p className="text-gray-600 text-lg mb-4">
                Many Nigerian hospitals still rely on paper-based systems 
                leading to delays, errors, and poor patient experiences. ClinicPal replaces these workflows with seamless, tech-powered processes.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Real-time patient data access</li>
                <li>Fewer missed appointments</li>
                <li>Digital-first medical recordkeeping</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-blue-50 px-6 md:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Trusted by Healthcare Heroes</h2>
            <blockquote className="italic text-lg text-gray-700 leading-relaxed">
              “ClinicPal made our hospital faster and more accurate. Our staff adapted in days, and patients feel the difference.”
              <footer className="mt-4 font-semibold text-blue-600">— Dr. Adebayo, CityCare Clinic</footer>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-blue-700 text-white text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Bring Your Clinic Into the Future</h2>
            <p className="text-lg mb-6">Join the revolution — power up your hospital with ClinicPal today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding" className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-slate-100 transition shadow">
                Get Started
              </Link>
              <a href="/docs" className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-blue-600 transition shadow">
                See Documentation
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white text-center py-10 px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} ClinicPal. Built for Africa. Powered by excellence.</p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
