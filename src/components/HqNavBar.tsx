import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useHospital } from "../context/HospitalContext";
import { FiMenu, FiX } from "react-icons/fi";

export const HqNavBar: React.FC = () => {
  const { logout } = useHospital();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/hq", label: "Dashboard" },
    { to: "/hq/patients", label: "Patients" },
    { to: "/hq/reports", label: "Reports" },
    { to: "#contact", label: "Manage Staffs" },
    { to: "#contact", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-4 sm:px-6 md:px-16 lg:px-24">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="ClinicPal Logo" className="h-9 w-auto" />
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-slate-600 hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => logout()}
            className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </Link>
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-blue-50 focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-4 absolute left-0 right-0 top-full z-40">
          <div className="flex flex-col gap-3 text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-slate-700 hover:text-blue-600 py-2 transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-center"
            >
              Logout
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};