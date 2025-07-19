import { useEffect, useState } from "react";
import {AdmittedReport} from "../../components/AdmittedReports";
import { HqNavBar } from "../../components/HqNavBar";



const HqReports = () => {
  
  useEffect(() => {
    document.title = "Reports - ClinicPal App";
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <HqNavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-8 py-4 rounded-t-xl shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
            Reports
          </h1>
         
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admitted Reports Section */}
          <section className="flex-1 w-full">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 space-y-4">
              
             <AdmittedReport />
            </div>
          </section>
        </div>


        
      </main>
    </div>
  );
};

export default HqReports;