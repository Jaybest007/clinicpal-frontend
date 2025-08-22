import React from 'react';
import { FiFilter, FiSearch, FiAlertTriangle, FiPackage, FiCheck, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import InventoryTable from './InventoryTable';
import StatCard from '../StatCard';
import type { InventoryItem } from '../../context/DashboardContext/types';

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
  onEditItem: (item: InventoryItem) => void;
  getStockStatus: (quantity: number, minThreshold: number) => string;
  isLoading?: boolean;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  filteredInventory,
  stats,
  filters,
  categories,
  onFilterChange,
  onClearFilters,
  onDeleteItem,
  onEditItem,
  getStockStatus,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="flex flex-wrap justify-center gap-3">
        <StatCard
          title="Total Items"
          icon={FiPackage}
          value={stats.total}
          variant="primary"
          loading={isLoading}
        />
        <StatCard
          title="In Stock"
          icon={FiCheck}
          value={stats.inStock}
          variant="success"
          loading={isLoading}
        />
        <StatCard
          title="Low Stock"
          icon={FiAlertCircle}
          value={stats.lowStock}
          variant="warning"
          loading={isLoading}
        />
        <StatCard
          title="Out of Stock"
          icon={FiXCircle}
          value={stats.outOfStock}
          variant="danger"
          loading={isLoading}
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">Inventory Items</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
            
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInventory.length > 0 ? (
          <InventoryTable
            items={filteredInventory}
            getStockStatus={getStockStatus}
            onDeleteItem={onDeleteItem}
           
            onEditItem={onEditItem}
          />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FiAlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
            <p className="text-gray-500">
              {filters.search || filters.category !== "All" || filters.status !== "All"
                ? "Try adjusting your filters or add a new item."
                : "Add your first inventory item to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySection;