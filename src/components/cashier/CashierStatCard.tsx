import { useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { motion } from "framer-motion";
import { BsReceipt, BsFileText, BsFileEarmark, BsBuilding, BsCashStack, BsArrowRight } from "react-icons/bs";

type CardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
  trend?: number;
};

const Card = ({ title, value, subtitle, icon: Icon, color = "blue", trend }: CardProps) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  
  const iconColors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`flex-shrink-0 w-[85vw] sm:w-auto sm:flex-1 min-w-[200px] md:min-w-[220px] rounded-xl border p-4 ${colors[color as keyof typeof colors]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-80">{title}</p>
          <h3 className="text-lg md:text-xl font-bold mt-1">{value}</h3>
          {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
          
          {trend !== undefined && (
            <div className="flex items-center mt-2 text-xs">
              <span className={`${trend >= 0 ? "text-green-600" : "text-red-600"} flex items-center`}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              <span className="ml-1 opacity-70">from last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-lg ${iconColors[color as keyof typeof iconColors]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export function CashierStatCard() {
  const { transactions, externalBillingData, transactionsLoading, externalBillingLoading } = useDashboard();
  
  // Use useMemo to calculate stats only when data changes
  const stats = useMemo(() => {
    // Map externalBillingData to match transaction structure
    const mappedExternal = externalBillingData.map((ext) => ({
      ...ext,
      payment_status: "paid", // Assume external are always paid, adjust if needed
    }));

    // Merge both arrays
    const allTransactions = [...transactions, ...mappedExternal];
    
    // Get paid transactions
    const paidTransactions = allTransactions.filter(
      (tx) => String(tx.payment_status).toLowerCase() === "paid"
    );
    
    // Get unpaid transactions
    const unpaidTransactions = allTransactions.filter(
      (tx) => String(tx.payment_status).toLowerCase() === "unpaid"
    );
    
    // Calculate total collected
    const totalCollected = paidTransactions.reduce(
      (sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0),
      0
    );
    
    // Calculate unpaid amount
    const unpaidAmount = unpaidTransactions.reduce(
      (sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0),
      0
    );
    
    // Get unique departments
    const departments = new Set(allTransactions.map((tx) => tx.department)).size;
    
    return {
      totalCollected,
      totalBills: allTransactions.length,
      unpaidBills: unpaidTransactions.length,
      departments,
      unpaidAmount,
    };
  }, [transactions, externalBillingData]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };
  
  // If loading, show skeleton
  if (transactionsLoading || externalBillingLoading) {
    return (
      <div className="relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-400 animate-pulse hidden sm:hidden md:block">
          <BsArrowRight size={20} />
        </div>
        <div className="overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 pb-2 md:pb-0 snap-x snap-mandatory">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="flex-shrink-0 w-[85vw] sm:w-auto sm:flex-1 min-w-[200px] md:min-w-[220px] rounded-xl border border-gray-200 p-4 bg-gray-50 snap-start"
              >
                <div className="flex items-start justify-between">
                  <div className="w-full">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200">
                    <div className="w-4 h-4"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2 gap-1 sm:hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full bg-gray-300 w-${i === 0 ? '6' : '3'}`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile scroll indicator */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-400 animate-pulse hidden sm:hidden md:block">
        <BsArrowRight size={20} />
      </div>
      
      {/* Main scroll container with negative margins to allow full-width scrolling */}
      <div className="overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-4 pb-2 md:pb-0 snap-x snap-mandatory">
          <Card
            title="Total Collected"
            value={formatCurrency(stats.totalCollected)}
            subtitle="Revenue from paid bills"
            icon={BsReceipt}
            color="green"
          />

          <Card 
            title="Bills Created" 
            value={stats.totalBills.toString()}
            subtitle="Total transactions"
            icon={BsFileText} 
            color="blue"
          />
          
          <Card
            title="Unpaid Bills"
            value={stats.unpaidBills.toString()}
            subtitle="Pending payments"
            icon={BsFileEarmark}
            color={stats.unpaidBills > 0 ? "yellow" : "blue"}
          />
          
          <Card
            title="Departments"
            value={stats.departments.toString()}
            subtitle="Services provided"
            icon={BsBuilding}
            color="purple"
          />
          
          <Card
            title="Unpaid Amount"
            value={formatCurrency(stats.unpaidAmount)}
            subtitle="Outstanding balance"
            icon={BsCashStack}
            color={stats.unpaidAmount > 0 ? "red" : "green"}
          />
        </div>
      </div>
      
      {/* Mobile pagination dots */}
      <div className="flex justify-center mt-2 gap-1 sm:hidden">
        <div className="h-1.5 rounded-full bg-blue-500 w-6"></div>
        <div className="h-1.5 rounded-full bg-gray-300 w-3"></div>
        <div className="h-1.5 rounded-full bg-gray-300 w-3"></div>
        <div className="h-1.5 rounded-full bg-gray-300 w-3"></div>
        <div className="h-1.5 rounded-full bg-gray-300 w-3"></div>
      </div>
    </div>
  );
}