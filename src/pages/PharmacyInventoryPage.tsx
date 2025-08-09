import { useState, useMemo } from "react";
import { FiPlus, FiPackage, FiShoppingCart, FiTrendingUp, FiCalendar } from "react-icons/fi";
import InventorySection from "../components/pharmacy/InventorySection";
import HistorySection from "../components/pharmacy/HistorySection";
import AddItemModal from "../components/pharmacy/AddItemModal";
import SaleTransactionModal from "../components/pharmacy/SaleTransactionModal";
import RestockModal from "../components/pharmacy/RestockModal";
import TransactionDetailModal from "../components/pharmacy/TransactionDetailModal";
import EditItemModal from "../components/pharmacy/EditItemModal";

// Sample hardcoded data - replace with Context data later
const SAMPLE_INVENTORY = [
  {
    id: "MED-001",
    name: "Paracetamol 500mg",
    category: "Analgesics",
    unit: "tablets",
    quantity: 250,
    minThreshold: 50,
    expiryDate: "2025-08-15"
  },
  {
    id: "MED-002", 
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    unit: "capsules",
    quantity: 45,
    minThreshold: 60,
    expiryDate: "2024-12-20"
  },
  {
    id: "SUP-001",
    name: "Disposable Syringes 5ml",
    category: "Medical Supplies", 
    unit: "pieces",
    quantity: 0,
    minThreshold: 100,
    expiryDate: "2026-01-10"
  },
  {
    id: "MED-003",
    name: "Ibuprofen 400mg", 
    category: "Analgesics",
    unit: "tablets",
    quantity: 180,
    minThreshold: 40,
    expiryDate: "2025-03-22"
  },
  {
    id: "SUP-002",
    name: "Medical Face Masks",
    category: "Medical Supplies",
    unit: "pieces", 
    quantity: 850,
    minThreshold: 200,
    expiryDate: "2027-06-30"
  },
  {
    id: "MED-004",
    name: "Cough Syrup 100ml",
    category: "Cough & Cold",
    unit: "bottles",
    quantity: 25,
    minThreshold: 30,
    expiryDate: "2024-11-15"
  }
];

// Helper function to determine stock status
const getStockStatus = (quantity: number, minThreshold: number): string => {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= minThreshold) return "Low Stock";
  return "In Stock";
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  expiryDate: string;
};

type NewInventoryItem = {
  id?: string;
  name: string;
  category: string;
  unit: string;
  quantity: number | string;
  minThreshold: number | string;
  expiryDate: string;
};

type TransactionItem = {
  id: string;
  name: string;
  unit: string;
  availableQuantity: number;
  quantityToSell: number;
  unitPrice?: number;
};

type RestockItem = {
  id: string;
  name: string;
  unit: string;
  currentQuantity: number;
  quantityToAdd: number;
};

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

export default function PharmacyInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    status: "All"
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<SaleTransaction[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  
  // Tab and history state
  const [activeTab, setActiveTab] = useState<"inventory" | "history">("inventory");
  const [historyFilters, setHistoryFilters] = useState({
    search: "",
    type: "all",
    dateFrom: "",
    dateTo: ""
  });
  const [selectedTransaction, setSelectedTransaction] = useState<SaleTransaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get unique categories from inventory
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(inventory.map(item => item.category))];
    return ["All", ...uniqueCategories.sort()];
  }, [inventory]);

  // Filter inventory based on current filters
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           item.id.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === "All" || item.category === filters.category;
      
      const itemStatus = getStockStatus(item.quantity, item.minThreshold);
      const matchesStatus = filters.status === "All" || itemStatus === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, filters]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = inventory.length;
    const inStock = inventory.filter(item => getStockStatus(item.quantity, item.minThreshold) === "In Stock").length;
    const lowStock = inventory.filter(item => getStockStatus(item.quantity, item.minThreshold) === "Low Stock").length;
    const outOfStock = inventory.filter(item => getStockStatus(item.quantity, item.minThreshold) === "Out of Stock").length;
    
    return { total, inStock, lowStock, outOfStock };
  }, [inventory]);

  // Filter transaction history
  const filteredHistory = useMemo(() => {
    return transactionHistory.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(historyFilters.search.toLowerCase()) ||
                           transaction.staff.toLowerCase().includes(historyFilters.search.toLowerCase()) ||
                           transaction.items.some(item => 
                             item.name.toLowerCase().includes(historyFilters.search.toLowerCase())
                           );

      const matchesType = historyFilters.type === "all" || transaction.type === historyFilters.type;

      const transactionDate = new Date(transaction.date);
      const matchesDateFrom = !historyFilters.dateFrom || transactionDate >= new Date(historyFilters.dateFrom);
      const matchesDateTo = !historyFilters.dateTo || transactionDate <= new Date(historyFilters.dateTo);

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [transactionHistory, historyFilters]);

  // Calculate history stats
  const historyStats = useMemo(() => {
    const totalTransactions = filteredHistory.length;
    const totalSales = filteredHistory.filter(t => t.type === "sale").length;
    const totalRestocks = filteredHistory.filter(t => t.type === "restock").length;
    const totalRevenue = filteredHistory
      .filter(t => t.type === "sale")
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

    return { totalTransactions, totalSales, totalRestocks, totalRevenue };
  }, [filteredHistory]);

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
  };

  const viewTransactionDetails = (transaction: SaleTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  // Handle adding new item
  const handleAddItem = (newItem: NewInventoryItem) => {
    const item: InventoryItem = {
      ...newItem,
      id: newItem.id || `ITEM-${Date.now()}`,
      quantity: parseInt(newItem.quantity as string) || 0,
      minThreshold: parseInt(newItem.minThreshold as string) || 0
    };
    
    setInventory(prev => [item, ...prev]);
    setIsAddModalOpen(false);

    // Add to transaction history for new item
    const now = new Date();
    const newTransaction: SaleTransaction = {
      id: `TXN-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      staff: "System",
      staffId: "SYSTEM",
      items: [{
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit
      }],
      totalItems: item.quantity,
      type: "restock",
      notes: "New item added to inventory"
    };

    setTransactionHistory(prev => [newTransaction, ...prev]);
  };

  // Handle deleting item
  const handleDeleteItem = (id: string) => {
    const itemToDelete = inventory.find(item => item.id === id);
    
    if (itemToDelete && window.confirm(`Are you sure you want to delete ${itemToDelete.name}?`)) {
      setInventory(prev => prev.filter(item => item.id !== id));

      // Add to transaction history for deletion
      const now = new Date();
      const newTransaction: SaleTransaction = {
        id: `TXN-${Date.now()}`,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        staff: "System",
        staffId: "SYSTEM",
        items: [{
          id: itemToDelete.id,
          name: itemToDelete.name,
          quantity: itemToDelete.quantity,
          unit: itemToDelete.unit
        }],
        totalItems: itemToDelete.quantity,
        type: "expired_removal",
        notes: "Item removed from inventory"
      };

      setTransactionHistory(prev => [newTransaction, ...prev]);
    }
  };

  // Handle processing sale transaction
  const handleProcessSale = (transactionItems: TransactionItem[], saleData: {
    staff: string;
    notes: string;
    totalAmount: number;
  }) => {
    // Update inventory
    setInventory(prev => prev.map(item => {
      const transactionItem = transactionItems.find(ti => ti.id === item.id);
      if (transactionItem) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - transactionItem.quantityToSell)
        };
      }
      return item;
    }));

    // Add to transaction history
    const now = new Date();
    const newTransaction: SaleTransaction = {
      id: `TXN-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      staff: saleData.staff,
      staffId: `STAFF-${Date.now().toString().slice(-6)}`,
      items: transactionItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantityToSell,
        unit: item.unit,
        unitPrice: item.unitPrice
      })),
      totalItems: transactionItems.reduce((sum, item) => sum + item.quantityToSell, 0),
      totalAmount: saleData.totalAmount,
      type: "sale",
      notes: saleData.notes
    };

    setTransactionHistory(prev => [newTransaction, ...prev]);
  };

  // Handle processing restock
  const handleProcessRestock = (restockItems: RestockItem[]) => {
    setInventory(prev => prev.map(item => {
      const restockItem = restockItems.find(ri => ri.id === item.id);
      if (restockItem) {
        return {
          ...item,
          quantity: item.quantity + restockItem.quantityToAdd
        };
      }
      return item;
    }));

    // Add to transaction history
    const now = new Date();
    const newTransaction: SaleTransaction = {
      id: `TXN-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      staff: "System",
      staffId: "SYSTEM",
      items: restockItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantityToAdd,
        unit: item.unit
      })),
      totalItems: restockItems.reduce((sum, item) => sum + item.quantityToAdd, 0),
      type: "restock",
      notes: "Inventory restocked"
    };

    setTransactionHistory(prev => [newTransaction, ...prev]);
  };

  // Handle editing item
  const handleEditItem = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  // Handle saving edited item
  const handleSaveEditedItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setIsEditModalOpen(false);
    setItemToEdit(null);

    // Add to transaction history for edit
    const now = new Date();
    const newTransaction: SaleTransaction = {
      id: `TXN-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      staff: "System",
      staffId: "SYSTEM",
      items: [{
        id: updatedItem.id,
        name: updatedItem.name,
        quantity: updatedItem.quantity,
        unit: updatedItem.unit
      }],
      totalItems: updatedItem.quantity,
      type: "adjustment",
      notes: `Item updated: ${updatedItem.name}`
    };

    setTransactionHistory(prev => [newTransaction, ...prev]);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "All", 
      status: "All"
    });
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
              >
                <FiShoppingCart className="h-4 w-4 mr-2" />
                Process Sale
              </button>
              
              <button
                onClick={() => setIsRestockModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
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
            onEditItem={handleEditItem} // Add this prop
            getStockStatus={getStockStatus}
          />
        ) : (
          <HistorySection
            filteredHistory={filteredHistory}
            historyStats={historyStats}
            historyFilters={historyFilters}
            onFilterChange={handleHistoryFilterChange}
            onClearFilters={clearHistoryFilters}
            onViewDetails={viewTransactionDetails}
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
          item={itemToEdit}
          categories={categories.filter(cat => cat !== "All")}
          onClose={() => {
            setIsEditModalOpen(false);
            setItemToEdit(null);
          }}
          onSave={handleSaveEditedItem}
        />

        <SaleTransactionModal
          isOpen={isSaleModalOpen}
          inventory={inventory}
          onClose={() => setIsSaleModalOpen(false)}
          onProcessSale={handleProcessSale}
        />

        <RestockModal
          isOpen={isRestockModalOpen}
          inventory={inventory}
          onClose={() => setIsRestockModalOpen(false)}
          onProcessRestock={handleProcessRestock}
        />

        {/* Transaction Detail Modal */}
        {isDetailModalOpen && selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
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

