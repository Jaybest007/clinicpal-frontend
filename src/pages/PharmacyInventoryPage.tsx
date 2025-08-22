import { useState, useEffect, useMemo } from "react";
import { FiPlus, FiPackage, FiShoppingCart, FiTrendingUp, FiCalendar } from "react-icons/fi";
import InventorySection from "../components/pharmacy/InventorySection";
import HistorySection from "../components/pharmacy/HistorySection";
import AddItemModal from "../components/pharmacy/AddItemModal";
import SaleTransactionModal from "../components/pharmacy/SaleTransactionModal";
import RestockModal from "../components/pharmacy/RestockModal";
import TransactionDetailModal from "../components/pharmacy/TransactionDetailModal";
import EditItemModal from "../components/pharmacy/EditItemModal";
import { useDashboard } from "../context/DashboardContext";
import type { 
  InventoryItem, 
  InventoryTransaction, 
  InventoryTransactionItem, 
  RestockItem, 
  TransactionFilters 
} from "../context/DashboardContext/types";

export default function PharmacyInventoryPage() {
  // Use the dashboard context for inventory operations
  const { 
    inventory, 
    inventoryLoading, 
    inventoryError,
    transactionHistory, 
    transactionLoading,
    transactionError,
    getStockStatus,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    processSale,
    processRestock,
    fetchTransactionHistory,
    fetchInventory
  } = useDashboard();

  // UI state
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    status: "All"
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  
  // Default categories if none exist in inventory
  const defaultCategories = [
    "Medications", 
    "Supplies", 
    "Equipment", 
    "Laboratory", 
    "Radiology"
  ];
  
  // Tab and history state
  const [activeTab, setActiveTab] = useState<"inventory" | "history">("inventory");
  const [historyFilters, setHistoryFilters] = useState({
    search: "",
    type: "all",
    dateFrom: "",
    dateTo: ""
  });
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get unique categories from inventory and combine with defaults
  const categories = useMemo(() => {
    // Always start with default categories to ensure we have all standard options
    const baseCategories = new Set(defaultCategories);
    
    // Add categories from inventory
    if (inventory.length) {
      inventory.forEach(item => {
        if (item.category) {
          baseCategories.add(item.category);
        }
      });
    }
    
    // Convert back to array, sort, and add "All" at the beginning
    return ["All", ...Array.from(baseCategories).sort()];
  }, [inventory, defaultCategories]);

  // Initial data load
  useEffect(() => {
    // Fetch inventory data when component mounts
    fetchInventory();
    fetchTransactionHistory();
  }, [fetchInventory, fetchTransactionHistory]);

  // Filter inventory based on current filters
  const filteredInventory = useMemo(() => {
    if (inventoryLoading) return [];
    
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (item.id && item.id.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = filters.category === "All" || item.category === filters.category;
      
      const itemStatus = getStockStatus(item.quantity, item.minThreshold);
      const matchesStatus = filters.status === "All" || itemStatus === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, filters, getStockStatus, inventoryLoading]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (inventoryLoading) return { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
    
    const total = inventory.length;
    const inStock = inventory.filter(item => getStockStatus(item.quantity, item.minThreshold) === "In Stock").length;
    const lowStock = inventory.filter(item => getStockStatus(item.quantity, item.minThreshold) === "Low Stock").length;
    const outOfStock = inventory.filter(item => getStockStatus(item.quantity, item.minThreshold) === "Out of Stock").length;
    
    return { total, inStock, lowStock, outOfStock };
  }, [inventory, getStockStatus, inventoryLoading]);

  // Filter transaction history
  const filteredHistory = useMemo(() => {
    if (transactionLoading) return [];
    
    return transactionHistory.filter(transaction => {
      const matchesSearch = 
        (transaction.id && transaction.id.toLowerCase().includes(historyFilters.search.toLowerCase())) ||
        (transaction.staff && transaction.staff.toLowerCase().includes(historyFilters.search.toLowerCase())) ||
        transaction.items.some(item => 
          item.name.toLowerCase().includes(historyFilters.search.toLowerCase())
        );

      const matchesType = historyFilters.type === "all" || transaction.type === historyFilters.type;

      const transactionDate = transaction.date ? new Date(transaction.date) : null;
      const matchesDateFrom = !historyFilters.dateFrom || 
        (transactionDate && transactionDate >= new Date(historyFilters.dateFrom));
      const matchesDateTo = !historyFilters.dateTo || 
        (transactionDate && transactionDate <= new Date(historyFilters.dateTo));

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [transactionHistory, historyFilters, transactionLoading]);

  // Calculate history stats
  const historyStats = useMemo(() => {
    if (transactionLoading) return { 
      totalTransactions: 0, 
      totalSales: 0, 
      totalRestocks: 0, 
      totalRevenue: 0 
    };
    
    const totalTransactions = filteredHistory.length;
    const totalSales = filteredHistory.filter(t => t.type === "sale").length;
    const totalRestocks = filteredHistory.filter(t => t.type === "restock").length;
    const totalRevenue = filteredHistory
      .filter(t => t.type === "sale")
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

    return { totalTransactions, totalSales, totalRestocks, totalRevenue };
  }, [filteredHistory, transactionLoading]);

  // Handle filter changes
  const handleFilterChange = (filterType: "search" | "category" | "status", value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleHistoryFilterChange = (field: string, value: string) => {
    setHistoryFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearHistoryFilters = () => {
    setHistoryFilters({
      search: "",
      type: "all",
      dateFrom: "",
      dateTo: ""
    });
    
    // Refetch with cleared filters
    fetchTransactionHistory();
  };

  const viewTransactionDetails = (transaction: InventoryTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  // Handle adding new item
  const handleAddItem = async (newItem: any) => {
    try {
      // Convert string values to numbers where needed
      const formattedItem = {
        ...newItem,
        quantity: Number(newItem.quantity),
        minThreshold: Number(newItem.minThreshold),
        price: newItem.price ? Number(newItem.price) : 0
      };
      
      await addInventoryItem(formattedItem);
      setIsAddModalOpen(false);
      
      // Refresh inventory data
      fetchInventory();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  // Handle deleting item
  const handleDeleteItem = async (id: string) => {
    const itemToDelete = inventory.find(item => item.id === id);
    
    if (itemToDelete && window.confirm(`Are you sure you want to delete ${itemToDelete.name}?`)) {
      try {
        await deleteInventoryItem(id);
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  // Handle processing sale transaction
  const handleProcessSale = async (
    transactionItems: InventoryTransactionItem[], 
    saleData: {
      staff: string;
      notes: string;
      totalAmount: number;
    }
  ) => {
    try {
      await processSale(transactionItems, saleData);
      setIsSaleModalOpen(false);
    } catch (error) {
      console.error("Error processing sale:", error);
      alert("Failed to process sale. Please try again.");
    }
  };

  // Handle processing restock
  const handleProcessRestock = async (restockItems: RestockItem[]) => {
    try {
      await processRestock(restockItems);
      setIsRestockModalOpen(false);
    } catch (error) {
      console.error("Error processing restock:", error);
      alert("Failed to process restock. Please try again.");
    }
  };

  // Handle editing item
  const handleEditItem = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  // Handle saving edited item
  const handleSaveEditedItem = async (updatedItem: InventoryItem) => {
    try {
      // Convert string values to numbers where needed
      const formattedItem = {
        ...updatedItem,
        quantity: Number(updatedItem.quantity),
        minThreshold: Number(updatedItem.minThreshold),
        price: updatedItem.price ? Number(updatedItem.price) : 0
      };
      
      await updateInventoryItem(formattedItem);
      setIsEditModalOpen(false);
      setItemToEdit(null);
      
      // Refresh inventory data
      fetchInventory();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "All", 
      status: "All"
    });
  };

  // Update history filters and fetch data
  const applyHistoryFilters = () => {
    const filters: TransactionFilters = {
      search: historyFilters.search,
      type: historyFilters.type !== 'all' ? historyFilters.type : undefined,
      dateFrom: historyFilters.dateFrom,
      dateTo: historyFilters.dateTo
    };
    
    fetchTransactionHistory(filters);
  };

  // Refresh data
  const handleRefreshData = () => {
    fetchInventory();
    if (activeTab === "history") {
      fetchTransactionHistory();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <FiPackage className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management</h1>
                <p className="text-gray-600">Manage medicines, supplies and track transactions</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={inventoryLoading}
              >
                <FiShoppingCart className="h-4 w-4 mr-2" />
                Process Sale
              </button>
              
              <button
                onClick={() => setIsRestockModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                disabled={inventoryLoading}
              >
                <FiTrendingUp className="h-4 w-4 mr-2" />
                Restock Items
              </button>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <FiPlus className="h-4 w-4 mr-2" />
                Add New Item
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("inventory")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "inventory"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } transition-colors`}
              >
                <FiPackage className="inline h-4 w-4 mr-2" />
                Inventory Management
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } transition-colors`}
              >
                <FiCalendar className="inline h-4 w-4 mr-2" />
                Transaction History ({transactionHistory.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Error state display */}
        {(activeTab === "inventory" && inventoryError) || (activeTab === "history" && transactionError) ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">Error loading data</h3>
            <p className="text-red-600 text-sm mt-1">
              {activeTab === "inventory" ? 
                (inventoryError?.message || "Failed to load inventory data") :
                (transactionError?.message || "Failed to load transaction data")
              }
            </p>
            <button 
              onClick={handleRefreshData}
              className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {/* Tab Content */}
        {activeTab === "inventory" ? (
          <InventorySection
            filteredInventory={filteredInventory}
            stats={stats}
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
            getStockStatus={getStockStatus}
            isLoading={inventoryLoading}
          />
        ) : (
          <HistorySection
            filteredHistory={filteredHistory}
            historyStats={historyStats}
            historyFilters={historyFilters}
            onFilterChange={handleHistoryFilterChange}
            onClearFilters={clearHistoryFilters}
            onViewDetails={viewTransactionDetails}
            onApplyFilters={applyHistoryFilters}
            isLoading={transactionLoading}
          />
        )}

        {/* Modals */}
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddItem}
          categories={categories.filter(cat => cat !== "All")}
        />

        <EditItemModal
          isOpen={isEditModalOpen}
          item={itemToEdit ? { ...itemToEdit, expiryDate: itemToEdit.expiryDate ?? "" } : null}
          categories={categories.filter(cat => cat !== "All").length > 0 ? 
            categories.filter(cat => cat !== "All") : 
            defaultCategories}
          onClose={() => {
            setIsEditModalOpen(false);
            setItemToEdit(null);
          }}
          onSave={handleSaveEditedItem}
        />

        <SaleTransactionModal
          isOpen={isSaleModalOpen}
          inventory={inventory.map(item => ({ ...item, expiryDate: item.expiryDate ?? "" }))}
          onClose={() => setIsSaleModalOpen(false)}
          onProcessSale={handleProcessSale}
        />

        <RestockModal
          isOpen={isRestockModalOpen}
          inventory={inventory.map(item => ({ ...item, expiryDate: item.expiryDate ?? "" }))}
          onClose={() => setIsRestockModalOpen(false)}
          onProcessRestock={handleProcessRestock}
        />

        {/* Transaction Detail Modal */}
        {isDetailModalOpen && selectedTransaction && (
          <TransactionDetailModal
            transaction={{
              ...selectedTransaction,
              staffId: selectedTransaction.staffId ?? ""
            }}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

