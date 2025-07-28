import { BsBuilding, BsFileEarmark, BsFileText, BsReceipt } from "react-icons/bs";
import { HqNavBar } from "../../components/hq_components/HqNavBar";
import StatCard from "../../components/StatCard";
import { useDashboard } from "../../context/DashboardContext"
import { TodaysTransaction } from "../../components/TodaysTransaction";



export function HqTransactions() {
        const {loading, transactions} = useDashboard()
    return(
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
                {/* =======nav bar=========== */}
                <HqNavBar/>
        <main className="max-w-7xl mx-auto py-8 px-4 space-y-10">
            {/* Overview Header */}
            <div className="bg-white rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-900">Hospital transactions</h1>
            </div>

            {/* Transactions Section */}
            <section className="flex gap-6 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                      <StatCard
                        title="Total Collected"
                        value={`₦${(
                          transactions
                            .filter((tx) => String(tx.payment_status).toLowerCase() === "paid")
                            .reduce((sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0), 0)
                        ).toLocaleString()}`}
                        icon={BsReceipt}
                      />
            
                      <StatCard title="Bills Created" value={`${transactions.length}`} icon={BsFileText} />
                      <StatCard title="Unpaid Bills" value={`${transactions.filter(tx => tx.payment_status === 'unpaid').length}`} icon={BsFileEarmark} />
                      <StatCard title="Departments Covered" value={`${new Set(transactions.map(tx => tx.department)).size}`} icon={BsBuilding} />
            </section>

            {/* Section 2: Today's Transactions */}
            {loading ? (
              <div className="flex items-center gap-2 py-8 justify-center text-blue-700">
                <svg className="animate-spin h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="font-medium text-lg">Loading today's transactions...</span>
              </div>
            ) : (
              <TodaysTransaction/>
            )}

        </main>
    </div>
  )
}