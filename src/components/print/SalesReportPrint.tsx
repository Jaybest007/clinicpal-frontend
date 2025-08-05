import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { Transaction } from "../../context/DashboardContext";

export function SalesReportPrint() {
  const location = useLocation();
  const transactions = location.state as Array<Transaction> || [];

  // Set document title for print dialog
  useEffect(() => {
    document.title = `Sales Report - ${new Date().toLocaleDateString()}`;
  }, []);
  
  // Auto-trigger print dialog when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate summary statistics
  const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const departmentTotals = transactions.reduce((acc, t) => {
    const dept = t.department || "Uncategorized";
    acc[dept] = (acc[dept] || 0) + Number(t.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  // Calculate payment method totals
  const paymentMethodTotals = transactions.reduce((acc, t) => {
    const method = t.payment_method?.toUpperCase() || "Other";
    acc[method] = (acc[method] || 0) + Number(t.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  // Format date for header
  const formattedDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="text-black bg-white max-w-5xl mx-auto p-8 print:p-2 print:max-w-full print:mx-0">
      {/* Print Controls - Only visible on screen */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Print Report
        </button>
      </div>

      <header className="border-b border-black mb-6 pb-4 flex items-center justify-between print:mb-4">
        <div>
          <h1 className="m-0 text-3xl font-bold tracking-tight uppercase print:text-2xl">
            Sales Report
          </h1>
          <div className="text-sm text-gray-600 print:text-black">
            {formattedDate} • Report ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800 print:text-sm">ClinicPal Medical Systems</p>
          <p className="text-xs text-gray-500">Financial Report</p>
        </div>
      </header>

      <section className="mb-6 print:mb-4">
        <h2 className="text-lg mb-3 text-gray-800 font-semibold uppercase tracking-wide print:text-base">
          Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 print:gap-2">
          <div className="border border-gray-300 p-3 print:p-2 bg-gray-50 print:bg-white">
            <div className="text-xl font-bold print:text-lg">
              {transactions.length}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Total Transactions
            </div>
          </div>
          <div className="border border-gray-300 p-3 print:p-2 bg-gray-50 print:bg-white">
            <div className="text-xl font-bold print:text-lg">
              ₦{totalAmount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Total Revenue
            </div>
          </div>
          <div className="border border-gray-300 p-3 print:p-2 bg-gray-50 print:bg-white">
            <div className="text-xl font-bold print:text-lg">
              ₦{(totalAmount / Math.max(transactions.length, 1)).toLocaleString(undefined, {maximumFractionDigits: 2})}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Average Transaction
            </div>
          </div>
          <div className="border border-gray-300 p-3 print:p-2 bg-gray-50 print:bg-white">
            <div className="text-xl font-bold print:text-lg">
              {transactions.length > 0 ? Math.max(...transactions.map(t => Number(t.amount || 0))).toLocaleString() : 0}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Highest Transaction
            </div>
          </div>
        </div>
      </section>

      {/* Department Breakdown */}
      <section className="mb-6 print:mb-4">
        <h2 className="text-lg mb-3 text-gray-800 font-semibold uppercase tracking-wide print:text-base">
          Department Breakdown
        </h2>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse text-sm border border-gray-300 print:text-xs">
            <thead className="bg-gray-100 print:bg-white">
              <tr>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Department
                </th>
                <th className="border border-gray-300 text-right px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Amount (₦)
                </th>
                <th className="border border-gray-300 text-right px-3 py-2 print:px-2 print:py-1 font-semibold">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(departmentTotals).map(([dept, amount]) => (
                <tr key={dept} className="border-b border-gray-300">
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 font-medium">
                    {dept}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                    {amount.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                    {totalAmount ? ((amount / totalAmount) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 print:bg-white font-semibold">
                <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                  Total
                </td>
                <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                  {totalAmount.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mb-6 print:mb-4">
        <h2 className="text-lg mb-3 text-gray-800 font-semibold uppercase tracking-wide print:text-base">
          Payment Methods
        </h2>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse text-sm border border-gray-300 print:text-xs">
            <thead className="bg-gray-100 print:bg-white">
              <tr>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Method
                </th>
                <th className="border border-gray-300 text-right px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Amount (₦)
                </th>
                <th className="border border-gray-300 text-right px-3 py-2 print:px-2 print:py-1 font-semibold">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentMethodTotals).map(([method, amount]) => (
                <tr key={method} className="border-b border-gray-300">
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 font-medium">
                    {method}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                    {amount.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                    {totalAmount ? ((amount / totalAmount) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Transactions */}
      <section>
        <h2 className="text-lg mb-3 text-gray-800 font-semibold uppercase tracking-wide print:text-base">
          Transaction Details
        </h2>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse text-sm border border-gray-300 print:text-xs">
            <thead className="bg-gray-100 print:bg-white">
              <tr>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  No.
                </th>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Date
                </th>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Payer
                </th>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Patient
                </th>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Dept.
                </th>
                <th className="border border-gray-300 text-left px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Description
                </th>
                <th className="border border-gray-300 text-right px-3 py-2 print:px-2 print:py-1 font-semibold">
                  Amount (₦)
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-300 text-center px-3 py-6 text-gray-500 print:text-black"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr
                    key={t.id || idx}
                    className={`border-b border-gray-300 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"}`}
                  >
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-center">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                      {t.payers_name || "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                      {t.name || "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                      {t.department || "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                      {t.description || "-"}
                    </td>
                    <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 text-right">
                      {t.amount ? t.amount.toLocaleString() : "0"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50 print:bg-white font-semibold">
              <tr>
                <td className="border border-gray-300 px-3 py-2 print:px-2 print:py-1" colSpan={6}>
                  Total
                </td>
                <td className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 text-right">
                  {totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <footer className="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500 text-center print:text-black print:mt-4">
        <p>
          &copy; {new Date().getFullYear()} ClinicPal Medical Systems • Page 1 of 1
        </p>
        <p className="text-xs mt-1 text-gray-400">
          This is a computer-generated document. No signature is required.
        </p>
      </footer>

      {/* Print styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { 
                size: A4 portrait;
                margin: 1cm;
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              tr { page-break-inside: avoid; }
              th { background-color: #f3f4f6 !important; }
            }
          `,
        }}
      />
    </div>
  );
}