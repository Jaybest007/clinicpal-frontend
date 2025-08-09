
import { FiPackage } from 'react-icons/fi';
import InventoryTable from './InventoryTable';
import InventoryFilters from './InventoryFilters';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  expiryDate: string;
};

interface InventorySectionProps {
  filteredInventory: InventoryItem[];
  stats: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  filters: {
    search: string;
    category: string;
    status: string;
  };
  categories: string[];
  onFilterChange: (filterType: "search" | "category" | "status", value: string) => void;
  onClearFilters: () => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: InventoryItem) => void; // Add this prop
  getStockStatus: (quantity: number, minThreshold: number) => string;
}

export default function InventorySection({
  filteredInventory,
  stats,
  filters,
  categories,
  onFilterChange,
  onClearFilters,
  onDeleteItem,
  onEditItem, // Add this prop
  getStockStatus
}: InventorySectionProps) {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiPackage className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-semibold text-green-600">{stats.inStock}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-amber-600">{stats.lowStock}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <InventoryFilters
            filters={filters}
            categories={categories}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow">
        <InventoryTable
          items={filteredInventory}
          getStockStatus={getStockStatus}
          onDeleteItem={onDeleteItem}
          onUpdateItem={() => {}}
          onEditItem={onEditItem} // Pass the edit handler
        />
      </div>
    </>
  );
}