import { useState, useEffect } from "react";
import { FiX, FiPlus, FiMinus, FiTrash2, FiPackage } from "react-icons/fi";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  expiryDate: string;
};

type RestockItem = {
  id: string;
  name: string;
  unit: string;
  currentQuantity: number;
  quantityToAdd: number;
};

interface RestockModalProps {
  isOpen: boolean;
  inventory: InventoryItem[];
  onClose: () => void;
  onProcessRestock: (restockItems: RestockItem[]) => void;
}

export default function RestockModal({ 
  isOpen, 
  inventory, 
  onClose, 
  onProcessRestock 
}: RestockModalProps) {
  const [restockItems, setRestockItems] = useState<RestockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter items for search
  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setRestockItems([]);
      setSearchTerm("");
      setErrors({});
    }
  }, [isOpen]);

  const addItemToRestock = (item: InventoryItem) => {
    const existingItem = restockItems.find(ri => ri.id === item.id);
    
    if (existingItem) {
      updateItemQuantity(item.id, existingItem.quantityToAdd + 1);
    } else {
      setRestockItems(prev => [...prev, {
        id: item.id,
        name: item.name,
        unit: item.unit,
        currentQuantity: item.quantity,
        quantityToAdd: 1
      }]);
    }
    setSearchTerm("");
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    setRestockItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantityToAdd: Math.max(0, newQuantity) };
      }
      return item;
    }));
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const removeItemFromRestock = (id: string) => {
    setRestockItems(prev => prev.filter(item => item.id !== id));
    setErrors(prev => ({ ...prev, [id]: "" }));
  };

  const validateRestock = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    restockItems.forEach(item => {
      if (item.quantityToAdd <= 0) {
        newErrors[item.id] = "Quantity must be greater than 0";
        isValid = false;
      }
    });

    if (restockItems.length === 0) {
      newErrors.general = "Add at least one item to restock";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProcessRestock = () => {
    if (validateRestock()) {
      onProcessRestock(restockItems);
      onClose();
    }
  };

  const getTotalItems = () => {
    return restockItems.reduce((total, item) => total + item.quantityToAdd, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FiPackage className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Restock Inventory</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Product Search & Add */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Select Products</h4>
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search products to restock..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Products List */}
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredItems.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {searchTerm ? "No products found" : "No products available"}
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => addItemToRestock(item)}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Current: {item.quantity} {item.unit} • ID: {item.id}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addItemToRestock(item);
                            }}
                            className="ml-2 p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Restock Cart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Restock List</h4>
                  <span className="text-sm text-gray-500">
                    {restockItems.length} items • +{getTotalItems()} total qty
                  </span>
                </div>

                {/* Restock Items */}
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  {restockItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p>No items added yet</p>
                      <p className="text-sm">Search and click products to add them</p>
                    </div>
                  ) : (
                    restockItems.map((item) => (
                      <div key={item.id} className="p-3 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Current: {item.currentQuantity} {item.unit}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItemFromRestock(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantityToAdd - 1)}
                            disabled={item.quantityToAdd <= 1}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          
                          <input
                            type="number"
                            value={item.quantityToAdd}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          
                          <span className="text-sm text-gray-600">+{item.unit}</span>
                          
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantityToAdd + 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* New quantity preview */}
                        <div className="text-xs text-green-600 mt-1">
                          New total: {item.currentQuantity + item.quantityToAdd} {item.unit}
                        </div>
                        
                        {errors[item.id] && (
                          <p className="text-red-500 text-xs mt-1">{errors[item.id]}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {errors.general && (
                  <p className="text-red-500 text-sm">{errors.general}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleProcessRestock}
              disabled={restockItems.length === 0}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Restock (+{getTotalItems()} items)
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}