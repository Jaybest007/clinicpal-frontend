import React from 'react';
import { FiFilter, FiSearch, FiCalendar, FiAlertTriangle, FiDatabase, FiShoppingCart, FiPackage, FiDollarSign } from 'react-icons/fi';
import StatCard from '../StatCard';
import type { InventoryTransaction } from '../../context/DashboardContext/types';

interface HistorySectionProps {
  filteredHistory: InventoryTransaction[];
  historyStats: {
    totalTransactions: number;
    totalSales: number;
    totalRestocks: number;
    totalRevenue: number;
  };
  historyFilters: {
    search: string;
    type: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (field: string, value: string) => void;
  onClearFilters: () => void;
  onViewDetails: (transaction: InventoryTransaction) => void;
  onApplyFilters: () => void;
  isLoading?: boolean;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  filteredHistory,
  historyStats,
  historyFilters,
  onFilterChange,
  onClearFilters,
  onViewDetails,
  onApplyFilters,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          icon={FiDatabase}
          value={historyStats.totalTransactions}
          variant="primary"
          loading={isLoading}
        />
        <StatCard
          title="Total Sales"
          icon={FiShoppingCart}
          value={historyStats.totalSales}
          variant="success"
          loading={isLoading}
        />
        <StatCard
          title="Total Restocks"
          icon={FiPackage}
          value={historyStats.totalRestocks}
          variant="warning"
          loading={isLoading}
        />
        <StatCard
          title="Total Revenue"
          icon={FiDollarSign}
          value={`₦${historyStats.totalRevenue.toLocaleString()}`}
          variant="info"
          loading={isLoading}
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">Transaction History</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={historyFilters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={historyFilters.type}
              onChange={(e) => onFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="sale">Sales</option>
              <option value="restock">Restocks</option>
              <option value="adjustment">Adjustments</option>
              <option value="expired_removal">Removals</option>
            </select>
            
            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="date"
                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={historyFilters.dateFrom}
                    onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={historyFilters.dateTo}
                    onChange={(e) => onFilterChange("dateTo", e.target.value)}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={onApplyFilters}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
              >
                Apply Filters
              </button>
              
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date} {transaction.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === "sale" ? "bg-blue-100 text-blue-800" :
                        transaction.type === "restock" ? "bg-green-100 text-green-800" :
                        transaction.type === "adjustment" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {transaction.type === "sale" ? "Sale" :
                         transaction.type === "restock" ? "Restock" :
                         transaction.type === "adjustment" ? "Adjustment" :
                         "Removal"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.staff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.totalItems}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.totalAmount ? `₦${transaction.totalAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onViewDetails(transaction)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FiAlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
            <p className="text-gray-500">
              {historyFilters.search || historyFilters.type !== "all" || historyFilters.dateFrom || historyFilters.dateTo
                ? "Try adjusting your filters or create a new transaction."
                : "Process your first sale or restock to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySection;