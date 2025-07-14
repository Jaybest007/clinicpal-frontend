import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useHospital } from "../context/HospitalContext";



export const HqNavBar: React.FC = () => {
  const { logout } = useHospital();


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-6 md:px-16 lg:px-24">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
            <Link to="/hq" className="text-slate-600 hover:text-blue-600">Dashboard</Link>
            <Link to="/hq/patients" className="text-slate-600 hover:text-blue-600">Patients</Link>
            <Link to="/hq/reports" className="text-slate-600 hover:text-blue-600">Reports</Link>
            <Link to="#contact" className="text-slate-600 hover:text-blue-600">Manage Staffs</Link>
            <Link to="#contact" className="text-slate-600 hover:text-blue-600">Settings</Link>
            <Link to="/login" onClick={() => logout()} className="ml-2 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition">
              Logout
            </Link>
          </nav>
        </div>
      </header>
  );
};