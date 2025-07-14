
import pic1 from "../assets/pic.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (

    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4 md:py-5 px-6 md:px-16 lg:px-24 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
            <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
            <a href="#about" className="text-slate-600 hover:text-blue-600 transition">About</a>
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition">Features</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition">Contact</a>
            <Link
                to="/login"
                className="ml-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Login
            </Link>
            </nav>
        </div>
        </header>






    <main className="text-slate-800 bg-white">
      
      {/* Hero Section */}
      <section className="min-h-screen bg-blue-50 flex items-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Streamline Your Clinic <br />
              with <span className="text-blue-600">ClinicPal</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Modern patient management made effortless. Built for hospitals, clinics, and medical teams that demand clarity and control.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img src={pic1} alt="Hero" className="w-full" />
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-white" id="about">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            ClinicPal is a team of healthcare technologists on a mission to empower African clinics with secure, intelligent tools to enhance care delivery and streamline workflows.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img src="/images/problem-painpoint.png" alt="Problem" className="w-full" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-4">
              Outdated Patient Management Is Holding Clinics Back
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Paper records. Missed appointments. Limited visibility. Many clinics still operate on fragmented systems that waste time and risk patient outcomes.
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Missing documentation and disorganized history</li>
              <li>Limited access to cross-department records</li>
              <li>Poor appointment flow and staff coordination</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">ClinicPal: One System to Rule It All</h2>
            <p className="text-gray-600 text-lg mb-4">
              From appointments to discharge, ClinicPal centralizes your patient care operations into one intuitive, secure platform.
            </p>
            <p className="text-blue-600 font-semibold">Built for speed. Designed for care. Powered by data.</p>
          </div>
          <div>
            <img src="/images/clinicpal-dashboard-preview.png" alt="ClinicPal Preview" className="rounded-md shadow-xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Appointments", desc: "Track, schedule and manage appointments with clarity." },
              { title: "Admission & Discharge", desc: "Transition patients smoothly across departments." },
              { title: "Secure Reporting", desc: "Log and protect critical medical data with full access control." },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-md shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Clinics Are Saying</h2>
          <blockquote className="italic text-gray-600 text-lg leading-relaxed">
            “Since adopting ClinicPal, our turnaround has improved by 40%, and our records are digitized and seamless.”
            <br />
            <span className="block mt-4 font-semibold text-blue-600">Dr. Adebayo, CityCare Clinic</span>
          </blockquote>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-lg mb-8">Get started with ClinicPal today — no card required.</p>
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded hover:bg-slate-100 transition">
            Launch Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} ClinicPal. Built for Africa. Powered by excellence.</p>
      </footer>
    </main>
    </div>
  );
};

export default LandingPage;
