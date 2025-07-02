import { useEffect } from "react";
import Sidebar from "../components/SideBar";
import StatCard from "../components/StatCard";
import { FaUserInjured } from "react-icons/fa";


const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - ClinicPal App";
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-neutral-50 pt-6 pl-16 md:pl-48 transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 ml-5">Dashboard</h2>
        <StatCard title="Patient" icon={FaUserInjured} value={10}/>
      </main>
    </div>
  );
};

export default Dashboard;
