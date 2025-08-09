import { FiEdit3, FiTrash2 } from "react-icons/fi";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate: string;
};

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | string;

interface InventoryItemRowProps {
  item: InventoryItem;
  getStockStatus: (quantity: number, minThreshold: number) => StockStatus;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string) => void;
}

export default function InventoryItemRow({ 
  item, 
  getStockStatus, 
  onDeleteItem, 
  onUpdateItem 
}: InventoryItemRowProps) {
  const status = getStockStatus(item.quantity, item.minThreshold);

  const getStatusBadge = (status: StockStatus): string => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status) {
      case "In Stock":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Low Stock":
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case "Out of Stock":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate: string): boolean => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate: string): boolean => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry.getTime() < today.getTime();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      onDeleteItem(item.id);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">ID: {item.id}</div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.category}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {item.quantity} {item.unit}
          </div>
          <div className="text-xs text-gray-500">
            Min: {item.minThreshold} {item.unit}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getStatusBadge(status)}>
          {status}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <span className={`${
            isExpired(item.expiryDate) 
              ? 'text-red-600 font-medium' 
              : isExpiringSoon(item.expiryDate) 
                ? 'text-amber-600 font-medium' 
                : 'text-gray-900'
          }`}>
            {formatDate(item.expiryDate)}
          </span>
          {isExpired(item.expiryDate) && (
            <div className="text-xs text-red-500">Expired</div>
          )}
          {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
            <div className="text-xs text-amber-500">Expires soon</div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateItem(item.id)}
            className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
            title="Update quantity"
          >
            <FiEdit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
            title="Delete item"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}