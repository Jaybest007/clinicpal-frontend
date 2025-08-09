
import { FiCalendar, FiShoppingCart, FiTrendingUp, FiFilter, FiEye } from 'react-icons/fi';

type SaleTransaction = {
  id: string;
  date: string;
  time: string;
  staff: string;
  staffId: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitPrice?: number;
  }[];
  totalItems: number;
  totalAmount?: number;
  type: "sale" | "restock" | "adjustment" | "expired_removal";
  notes?: string;
};

interface HistorySectionProps {
  filteredHistory: SaleTransaction[];
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
  onViewDetails: (transaction: SaleTransaction) => void;
}

export default function HistorySection({
  filteredHistory,
  historyStats,
  historyFilters,
  onFilterChange,
  onClearFilters,
  onViewDetails
}: HistorySectionProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "sale":
        return "bg-blue-100 text-blue-800";
      case "restock":
        return "bg-green-100 text-green-800";
      case "adjustment":
        return "bg-yellow-100 text-yellow-800";
      case "expired_removal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sale":
        return "Sale";
      case "restock":
        return "Restock";
      case "adjustment":
        return "Adjustment";
      case "expired_removal":
        return "Expired Removal";
      default:
        return type;
    }
  };

  return (
    <>
      {/* History Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{historyStats.totalTransactions}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiCalendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Sales</p>
              <p className="text-2xl font-semibold text-blue-600">{historyStats.totalSales}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Restocks</p>
              <p className="text-2xl font-semibold text-green-600">{historyStats.totalRestocks}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-green-600">${historyStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Filters */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiFilter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Filter Transactions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search transactions..."
                value={historyFilters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={historyFilters.type}
                onChange={(e) => onFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="sale">Sales</option>
                <option value="restock">Restocks</option>
                <option value="adjustment">Adjustments</option>
                <option value="expired_removal">Expired Removals</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={historyFilters.dateFrom}
                onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={historyFilters.dateTo}
                onChange={(e) => onFilterChange("dateTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(historyFilters.search || historyFilters.type !== "all" || historyFilters.dateFrom || historyFilters.dateTo) && (
            <div className="flex justify-end mt-4">
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      {transaction.notes && (
                        <div className="text-xs text-gray-500 truncate max-w-40">{transaction.notes}</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.date}</div>
                      <div className="text-xs text-gray-500">{transaction.time}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.staff}</div>
                      <div className="text-xs text-gray-500">{transaction.staffId}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {getTypeLabel(transaction.type)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.totalItems} items</div>
                      <div className="text-xs text-gray-500">
                        {transaction.items.length} product{transaction.items.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.totalAmount !== undefined ? (
                        <div className="text-sm font-medium text-gray-900">
                          ${transaction.totalAmount.toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">N/A</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onViewDetails(transaction)}
                        className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                        title="View details"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}