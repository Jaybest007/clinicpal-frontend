import {  useLocation } from "react-router-dom";
import type { Transaction } from "../../context/DashboardContext";

export function SalesReportPrint() {

    const location = useLocation();
    const transactions = location.state as Array<Transaction> || [];

    return (
        <div className=" text-black bg-white max-w-4xl mx-auto p-10 print:p-0 print:bg-white print:text-black print:font-serif">
            <header className="border-b border-black mb-8 pb-4 flex items-center justify-between">
                <div>
                <h1 className="m-0 text-4xl font-bold tracking-tight uppercase">Sales Report</h1>
                <div className="text-sm text-gray-600 print:text-black">
                    {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </div>
                </div>
            </header>

            <section className="mb-8">
                <h2 className="text-lg mb-2 text-gray-800 font-semibold uppercase tracking-wide">Summary</h2>
                <div className="flex justify-between text-base text-gray-700 print:text-black">
                <div>
                    <span className="font-semibold">Total Transactions:</span> {transactions.length}
                </div>
                <div>
                    <span className="font-semibold">Total Sales:</span> ₦{transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0).toLocaleString()}
                </div>
                </div>
            </section>

            <section>
                <h2 className="text-lg mb-3 text-gray-800 font-semibold uppercase tracking-wide">Details</h2>
                <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full border-collapse text-sm bg-white print:bg-white">
                    <thead className="bg-gray-100 print:bg-white">
                    <tr>
                        <th className="border-b border-black text-left px-3 py-2 font-semibold">Date</th>
                        <th className="border-b border-black text-left px-3 py-2 font-semibold">Payer</th>
                        <th className="border-b border-black text-left px-3 py-2 font-semibold">Patient</th>
                        <th className="border-b border-black text-left px-3 py-2 font-semibold">Dept.</th>
                        <th className="border-b border-black text-left px-3 py-2 font-semibold">Description</th>
                        <th className="border-b border-black text-right px-3 py-2 font-semibold">Amount (₦)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                        <td colSpan={6} className="text-center px-3 py-6 text-gray-500 print:text-black">No transactions found.</td>
                        </tr>
                    ) : (
                        transactions.map((t, idx) => (
                        <tr key={t.id || idx} className="border-b border-gray-300 last:border-0">
                            <td className="px-3 py-2">{t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}</td>
                            <td className="px-3 py-2">{t.payers_name || "-"}</td>
                            <td className="px-3 py-2">{t.name || "-"}</td>
                            <td className="px-3 py-2">{t.department || "-"}</td>
                            <td className="px-3 py-2">{t.description || "-"}</td>
                            <td className="px-3 py-2 text-right">{t.amount ? t.amount.toLocaleString() : "0"}</td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            </section>

            <footer className="mt-12 border-t border-gray-300 pt-4 text-xs text-gray-500 text-center print:text-black">
                &copy; {new Date().getFullYear()} ClinicPal. All rights reserved.
            </footer>
        </div>

    );
}