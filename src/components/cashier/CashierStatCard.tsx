import StatCard from "../StatCard";
import { BsReceipt, BsFileText, BsFileEarmark, BsBuilding } from "react-icons/bs";
import { useDashboard } from "../../context/DashboardContext";

export function CashierStatCard() {
  const { transactions, externalBillingData } = useDashboard();

  // Map externalBillingData to match transaction structure
  const mappedExternal = externalBillingData.map((ext) => ({
    ...ext,
    payment_status: "paid", // Assume external are always paid, adjust if needed
  }));

  // Merge both arrays
  const allTransactions = [...transactions, ...mappedExternal];

  return (
    <section className="flex gap-6 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
      <StatCard
        title="Total Collected"
        value={`₦${(
          allTransactions
            .filter((tx) => String(tx.payment_status).toLowerCase() === "paid")
            .reduce(
              (sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0),
              0
            )
        ).toLocaleString()}`}
        icon={BsReceipt}
      />

      <StatCard title="Bills Created" value={`${allTransactions.length}`} icon={BsFileText} />
      <StatCard
        title="Unpaid Bills"
        value={`${allTransactions.filter((tx) => String(tx.payment_status).toLowerCase() === "unpaid").length}`}
        icon={BsFileEarmark}
      />
      <StatCard
        title="Departments Covered"
        value={`${new Set(allTransactions.map((tx) => tx.department)).size}`}
        icon={BsBuilding}
      />
      <StatCard
        title="Unpaid Amount"
        value={`₦${(
          allTransactions
            .filter((tx) => String(tx.payment_status).toLowerCase() === "unpaid")
            .reduce(
              (sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0),
              0
            )
        ).toLocaleString()}`}
        icon={BsFileEarmark}
      />
    </section>
  );
}