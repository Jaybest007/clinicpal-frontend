import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface Order {
  id: string | number;
  patient: string;
  date: string;
  items: string[] | string;
  status: string;
  source: string;
}

export const DepartmentsReportPrint = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const department = params.get("department") || "Unknown";
  const orders: Order[] = location.state?.orders || [];

  // Set document title for print dialog
  useEffect(() => {
    document.title = `${department} Department Report - ${new Date().toLocaleDateString()}`;
  }, [department]);

  // Auto-trigger print dialog when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics
  const totalOrders = orders.length;
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format date for header
  const formattedDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="bg-white text-black p-4 max-w-none mx-auto print:p-2 print:max-w-full">
      {/* Print Controls - Only visible on screen */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Print Report
        </button>
      </div>

      {/* Letterhead */}
      <header className="mb-6 pb-4 border-b border-gray-300 print:mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
              {department.toUpperCase()} DEPARTMENT REPORT
            </h1>
            <p className="text-sm text-gray-600 mt-1 print:text-xs">
              Generated on {formattedDate}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800 print:text-sm">
              ClinicPal Medical Systems
            </p>
            <p className="text-xs text-gray-500">
              Report ID:{" "}
              {Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()}
            </p>
          </div>
        </div>
      </header>

      {/* Summary Statistics */}
      <div className="mb-6 grid grid-cols-4 gap-3 print:mb-4 print:gap-2 print:text-sm">
        <div className="border border-gray-300 p-3 print:p-2 bg-gray-50 print:bg-white">
          <div className="text-xl font-bold print:text-lg">{totalOrders}</div>
          <div className="text-xs text-gray-500 font-medium">Total Orders</div>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className="border border-gray-300 p-3 print:p-2 bg-gray-50 print:bg-white"
          >
            <div className="text-xl font-bold print:text-lg">{count}</div>
            <div className="text-xs text-gray-500 font-medium">{status}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-visible print:overflow-visible">
        <table className="w-full border-collapse border border-gray-300 text-sm print:text-xs print:w-full">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-100 text-left">
              <th className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 font-semibold">
                No.
              </th>
              <th className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 font-semibold">
                Patient
              </th>
              <th className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 font-semibold">
                Date
              </th>
              <th className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 font-semibold">
                Items
              </th>
              <th className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 font-semibold">
                Status
              </th>
              <th className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 font-semibold">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-3 py-6 text-center text-gray-500 italic"
                >
                  No orders found for this department.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 print:bg-white"
                  }
                >
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 font-medium">
                    {order.patient}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                    {new Date(order.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1">
                    {Array.isArray(order.items)
                      ? order.items.join(", ")
                      : order.items}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 capitalize">
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-3 py-1.5 print:px-2 print:py-1 capitalize">
                    {order.source}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-gray-50 print:bg-white">
            <tr>
              <td
                colSpan={6}
                className="border border-gray-300 px-3 py-2 print:px-2 print:py-1 text-xs text-gray-500"
              >
                Total: {orders.length} orders • Report generated by ClinicPal
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <footer className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500 print:mt-4">
        <p>
          &copy; {new Date().getFullYear()} ClinicPal Medical Platform • Page 1 of 1
        </p>
        <p className="text-xs mt-1 text-gray-400">
          This is a computer-generated document. No signature is required.
        </p>
      </footer>

      {/* Page break handling for print */}
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
};
