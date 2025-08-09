
import { FiX, FiCalendar, FiUser, FiPackage, FiDollarSign } from 'react-icons/fi';

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

interface TransactionDetailModalProps {
  transaction: SaleTransaction;
  onClose: () => void;
}

export default function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
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
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiPackage className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                  <p className="text-sm text-gray-500">Transaction ID: {transaction.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Transaction Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiCalendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date & Time</p>
                    <p className="text-sm text-gray-900">{transaction.date} at {transaction.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiUser className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Staff Member</p>
                    <p className="text-sm text-gray-900">{transaction.staff}</p>
                    <p className="text-xs text-gray-500">{transaction.staffId}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {getTypeLabel(transaction.type)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transaction Type</p>
                  </div>
                </div>

                {transaction.totalAmount !== undefined && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <FiDollarSign className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${transaction.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Items</h4>
                <div className="text-sm text-gray-500">
                  {transaction.items.length} product{transaction.items.length !== 1 ? 's' : ''} • {transaction.totalItems} total items
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        {transaction.type === "sale" && (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transaction.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500">ID: {item.id}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {item.quantity} {item.unit}
                          </td>
                          {transaction.type === "sale" && (
                            <>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                {item.unitPrice ? `$${(item.quantity * item.unitPrice).toFixed(2)}` : 'N/A'}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {transaction.notes && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Notes</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{transaction.notes}</p>
                </div>
              </div>
            )}

            {/* Summary for Sales */}
            {transaction.type === "sale" && transaction.totalAmount && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Total Transaction Amount:</span>
                  <span className="text-xl font-bold text-green-600">${transaction.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}