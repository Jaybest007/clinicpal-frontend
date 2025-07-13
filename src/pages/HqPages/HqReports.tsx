// import React from "react";
// import { HqNavBar } from "../../components/HqNavBar";
// import { useDashboard } from "../../context/DashboardContext";
// import { FaChevronDown } from "react-icons/fa";

// export const HqReports: React.FC = () => {
//     const { patientReport } = useDashboard();
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
//       <HqNavBar />
//       <main className="flex-1 pt-8 px-2 md:px-8">
//         <div className="max-w-6xl mx-auto space-y-6">
//           <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm">
//             <h1 className="text-2xl font-semibold">Reports</h1>
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
//            {patientReport.()map((patient, index) => (
//                 <details
//                   key={patient.patient_id}
//                   className="bg-white border border-blue-100 rounded-xl shadow-md group transition-all duration-200"
//                 >
//                   <summary className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-blue-50/60 transition font-semibold rounded-xl group-open:rounded-b-none">
//                     <div>
//                       <p className="text-base text-blue-900 font-bold tracking-wide">
//                         {patient.full_name.toUpperCase()}
//                       </p>
//                       <p className="text-xs text-blue-500 mt-1">
//                         ID: <span className="font-mono">{patient.patient_id.toUpperCase()}</span>
//                       </p>
//                     </div>
//                     <FaChevronDown className="w-5 h-5 text-blue-400 group-open:rotate-180 transition-transform" />
//                   </summary>

//                   <div className="px-6 pb-4">
//                     <div className="divide-y divide-slate-100">
//                         <div
//                           key={index}
//                           className="py-4 cursor-pointer hover:bg-blue-50 rounded-lg transition flex flex-col gap-1"
                          
//                         >
//                           <div className="flex items-center gap-2">
//                             <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
//                               {index + 1}
//                             </span>
//                             <p className="text-sm text-slate-800 font-medium truncate max-w-full">
//                               📝 {report.report}
//                             </p>
//                           </div>
//                           <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
//                             <span>
//                               <span className="font-semibold">By:</span> {report.wrote_by}
//                             </span>
//                             <span>
//                               <span className="font-semibold">At:</span>{" "}
//                               {new Date(report.created_at).toLocaleString("en-NG", {
//                                 weekday: "short",
//                                 year: "numeric",
//                                 month: "short",
//                                 day: "numeric",
//                                 hour: "2-digit",
//                                 minute: "2-digit"
//                               })}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </details>
//            )) }
//         </div>
//         </div>
//       </main>
//     </div>
//   );
// }