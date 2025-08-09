import React, { useMemo, useState } from 'react';
import { BsBuilding, BsFileEarmark, BsFileText, BsReceipt, BsCash } from "react-icons/bs";
import StatCard from "../StatCard";

type Transaction = {
  payment_status: string;
  amount: number | string;
  department: string;
  date?: string;
};

interface TransactionStatsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ 
  transactions = [], 
  loading = false 
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Filter transactions by selected time period
  const filteredTransactions = useMemo(() => {
    if (timeFilter === 'all') return transactions;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(tx => {
      if (!tx.date) return false;
      
      const txDate = new Date(tx.date);
      
      switch (timeFilter) {
        case 'today':
          return txDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return txDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return txDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [transactions, timeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    // Calculate total collected amount
    const totalCollected = filteredTransactions
      .filter((tx) => String(tx.payment_status).toLowerCase() === "paid")
      .reduce(
        (sum, tx) => sum + (typeof tx.amount === "number" ? tx.amount : Number(tx.amount) || 0), 
        0
      );
    
    // Calculate unpaid bills
    const unpaidBills = filteredTransactions.filter(tx => 
      String(tx.payment_status).toLowerCase() === "unpaid"
    ).length;
    
    // Calculate unique departments
    const uniqueDepartments = new Set(filteredTransactions.map(tx => tx.department)).size;
    
    // Calculate average transaction amount
    const paidTransactions = filteredTransactions.filter(
      tx => String(tx.payment_status).toLowerCase() === "paid"
    );
    const avgAmount = paidTransactions.length > 0 
      ? totalCollected / paidTransactions.length 
      : 0;
    
    // Calculate payment completion rate
    const completionRate = filteredTransactions.length > 0
      ? Math.round((paidTransactions.length / filteredTransactions.length) * 100)
      : 0;
      
    return {
      totalCollected,
      billsCreated: filteredTransactions.length,
      unpaidBills,
      uniqueDepartments,
      avgAmount,
      completionRate
    };
  }, [filteredTransactions]);

  // Trends (simulated - in a real app you'd compare with previous periods)
  const trends = {
    collected: { value: 12, isUpGood: true },
    bills: { value: 8, isUpGood: true },
    unpaid: { value: -5, isUpGood: true },
    departments: { value: 2, isUpGood: true }
  };

  return (
    <div className="space-y-4">
      {/* Time period selector */}
      <div className="flex justify-end mb-2">
        <div className="bg-white rounded-lg shadow-sm p-1 flex">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeFilter === 'all' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeFilter === 'month' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeFilter === 'week' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              timeFilter === 'today' ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <section className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 py-2">
        <StatCard
          title="Total Collected"
          value={`₦${stats.totalCollected.toLocaleString()}`}
          icon={BsReceipt}
          variant="success"
          trend={trends.collected}
          loading={loading}
        />
        
        <StatCard 
          title="Bills Created" 
          value={stats.billsCreated} 
          icon={BsFileText}
          variant="primary"
          trend={trends.bills}
          loading={loading}
        />
        
        <StatCard 
          title="Unpaid Bills" 
          value={stats.unpaidBills}
          subtitle={stats.billsCreated > 0 ? `${Math.round((stats.unpaidBills / stats.billsCreated) * 100)}%` : undefined}
          icon={BsFileEarmark}
          variant="warning"
          trend={trends.unpaid}
          loading={loading}
        />
        
        <StatCard 
          title="Departments" 
          value={stats.uniqueDepartments} 
          icon={BsBuilding}
          variant="info"
          trend={trends.departments}
          loading={loading}
        />

        <StatCard 
          title="Completion" 
          value={`${stats.completionRate}%`}
          icon={BsCash}
          variant={stats.completionRate > 70 ? "success" : stats.completionRate > 50 ? "warning" : "danger"}
          loading={loading}
        />
      </section>

      {/* No data message */}
      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
          No transaction data available for the selected time period.
        </div>
      )}
    </div>
  );
};

export default TransactionStats;