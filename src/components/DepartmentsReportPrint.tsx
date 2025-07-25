import { useLocation } from "react-router-dom";

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

  return (
    <div className="bg-white text-gray-900 font-sans px-10 py-12 max-w-6xl mx-auto">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-2xl font-bold">{department} Department Report</h1>
        <p className="text-sm text-gray-500 mt-2">
          Generated on{" "}
          <span className="inline-block min-w-[200px]">
            {new Date().toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2 font-semibold">No.</th>
              <th className="border border-gray-300 px-4 py-2 font-semibold">Patient</th>
              <th className="border border-gray-300 px-4 py-2 font-semibold">Date</th>
              <th className="border border-gray-300 px-4 py-2 font-semibold">Items</th>
              <th className="border border-gray-300 px-4 py-2 font-semibold">Status</th>
              <th className="border border-gray-300 px-4 py-2 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-6 text-center text-gray-400 italic"
                >
                  No orders found for this department.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.patient}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(order.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {Array.isArray(order.items)
                      ? order.items.join(", ")
                      : order.items}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{order.source}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-10 text-center text-xs text-gray-400 border-t pt-4 print:hidden">
        &copy; {new Date().getFullYear()} ClinicPal Medical Platform
      </footer>
    </div>
  );
};
