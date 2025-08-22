import { useState, useEffect } from "react";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from "react-icons/fi";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minThreshold: number;
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

interface SaleTransactionModalProps {
  isOpen: boolean;
  inventory: InventoryItem[];
  onClose: () => void;
  onProcessSale: (transactionItems: TransactionItem[], saleData: {
    staff: string;
    notes: string;
    totalAmount: number;
  }) => void;
}

export default function SaleTransactionModal({ 
  isOpen, 
  inventory, 
  onClose, 
  onProcessSale 
}: SaleTransactionModalProps) {
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saleData, setSaleData] = useState({
    staff: "",
    notes: "",
    patientName: ""
  });

  // Filter available items (only items with quantity > 0)
  const availableItems = inventory.filter(item => 
    item.quantity > 0 && 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setTransactionItems([]);
      setSearchTerm("");
      setErrors({});
      setSaleData({ staff: "", notes: "", patientName: "" });
    }
  }, [isOpen]);

  const addItemToTransaction = (item: InventoryItem) => {
    const existingItem = transactionItems.find(ti => ti.id === item.id);
    
    if (existingItem) {
      // Increase quantity if item already in transaction
      updateItemQuantity(item.id, existingItem.quantityToSell + 1);
    } else {
      // Add new item to transaction
      setTransactionItems(prev => [...prev, {
        id: item.id,
        name: item.name,
        unit: item.unit,
        availableQuantity: item.quantity,
        quantityToSell: 1,
        unitPrice: 0 // You can add default pricing logic here
      }]);
    }
    setSearchTerm(""); // Clear search after adding
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    setTransactionItems(prev => prev.map(item => {
      if (item.id === id) {
        const validQuantity = Math.max(0, Math.min(newQuantity, item.availableQuantity));
        return { ...item, quantityToSell: validQuantity };
      }
      return item;
    }));
    
    // Clear error for this item
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const updateItemPrice = (id: string, newPrice: number) => {
    setTransactionItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, unitPrice: Math.max(0, newPrice) };
      }
      return item;
    }));
  };

  const removeItemFromTransaction = (id: string) => {
    setTransactionItems(prev => prev.filter(item => item.id !== id));
    setErrors(prev => ({ ...prev, [id]: "" }));
  };

  const validateTransaction = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!saleData.staff.trim()) {
      newErrors.staff = "Staff member is required";
      isValid = false;
    }

    transactionItems.forEach(item => {
      if (item.quantityToSell <= 0) {
        newErrors[item.id] = "Quantity must be greater than 0";
        isValid = false;
      } else if (item.quantityToSell > item.availableQuantity) {
        newErrors[item.id] = `Only ${item.availableQuantity} available`;
        isValid = false;
      }
    });

    if (transactionItems.length === 0) {
      newErrors.general = "Add at least one item to the transaction";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProcessSale = () => {
    if (validateTransaction()) {
      const totalAmount = transactionItems.reduce((sum, item) => 
        sum + (item.quantityToSell * (item.unitPrice || 0)), 0
      );
      
      const notes = [
        saleData.patientName ? `Patient: ${saleData.patientName}` : '',
        saleData.notes
      ].filter(Boolean).join(' - ');

      onProcessSale(transactionItems, {
        staff: saleData.staff,
        notes,
        totalAmount
      });
      onClose();
    }
  };

  const getTotalItems = () => {
    return transactionItems.reduce((total, item) => total + item.quantityToSell, 0);
  };

  const getTotalAmount = () => {
    return transactionItems.reduce((sum, item) => 
      sum + (item.quantityToSell * (item.unitPrice || 0)), 0
    );
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Process Sale</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Product Search & Add */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Add Products</h4>
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Available Products List */}
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {availableItems.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {searchTerm ? "No products found" : "No products available"}
                      </div>
                    ) : (
                      availableItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => addItemToTransaction(item)}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Available: {item.quantity} {item.unit} • ID: {item.id}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addItemToTransaction(item);
                            }}
                            className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Center - Transaction Cart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Transaction Cart</h4>
                  <span className="text-sm text-gray-500">
                    {transactionItems.length} items • {getTotalItems()} total qty
                  </span>
                </div>

                {/* Transaction Items */}
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  {transactionItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FiShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p>No items added yet</p>
                    </div>
                  ) : (
                    transactionItems.map((item) => (
                      <div key={item.id} className="p-3 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Available: {item.availableQuantity} {item.unit}</p>
                          </div>
                          <button
                            onClick={() => removeItemFromTransaction(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantityToSell - 1)}
                            disabled={item.quantityToSell <= 1}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            <FiMinus className="h-3 w-3" />
                          </button>
                          
                          <input
                            type="number"
                            value={item.quantityToSell}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                            min="1"
                            max={item.availableQuantity}
                            className="w-12 px-1 py-1 text-center text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                          
                          <span className="text-xs text-gray-600">{item.unit}</span>
                          
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantityToSell + 1)}
                            disabled={item.quantityToSell >= item.availableQuantity}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            <FiPlus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Price:</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={item.unitPrice || ''}
                            onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-600">
                            = ₦{((item.unitPrice || 0) * item.quantityToSell).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        {errors[item.id] && (
                          <p className="text-red-500 text-xs mt-1">{errors[item.id]}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Side - Sale Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Sale Details</h4>
                
                {/* Staff Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member *</label>
                  <input
                    type="text"
                    value={saleData.staff}
                    onChange={(e) => setSaleData(prev => ({ ...prev, staff: e.target.value }))}
                    placeholder="Enter staff name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {errors.staff && <p className="text-red-500 text-xs mt-1">{errors.staff}</p>}
                </div>

                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={saleData.patientName}
                    onChange={(e) => setSaleData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={saleData.notes}
                    onChange={(e) => setSaleData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Transaction Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span>{getTotalItems()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products:</span>
                      <span>{transactionItems.length}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base border-t pt-1">
                      <span>Total Amount:</span>
                      <span>₦{getTotalAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
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
              onClick={handleProcessSale}
              disabled={transactionItems.length === 0}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Sale (₦{getTotalAmount().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})
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