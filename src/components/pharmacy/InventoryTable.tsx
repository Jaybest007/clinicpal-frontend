import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import type { InventoryItem } from '../../context/DashboardContext/types';

interface InventoryTableProps {
  items: InventoryItem[];
  getStockStatus: (quantity: number, minThreshold: number) => string;
  onDeleteItem: (id: string) => void;
  
  onEditItem?: (item: InventoryItem) => void;
}

export default function InventoryTable({ 
  items, 
  getStockStatus, 
  onDeleteItem,
 
  onEditItem 
}: InventoryTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiry Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No items found matching your filters.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const status = getStockStatus(item.quantity, item.minThreshold);
              const expiringSoon = isExpiringSoon(item.expiryDate);
              const expired = isExpired(item.expiryDate);

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minThreshold} {item.unit}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.expiryDate ? (
                      <>
                        <div className={`text-sm ${expired ? 'text-red-600 font-medium' : expiringSoon ? 'text-yellow-600 font-medium' : 'text-gray-900'}`}>
                          {item.expiryDate}
                        </div>
                        {(expired || expiringSoon) && (
                          <div className="flex items-center text-xs text-yellow-600">
                            <FiAlertTriangle className="h-3 w-3 mr-1" />
                            {expired ? 'Expired' : 'Expires soon'}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">Not specified</div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {onEditItem && (
                        <button
                          onClick={() => onEditItem(item)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1.5 rounded-md transition-colors"
                          title="Edit item"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                        title="Delete item"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}