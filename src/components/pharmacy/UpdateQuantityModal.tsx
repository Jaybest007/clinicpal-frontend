import { useState, useEffect } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  expiryDate: string;
};

interface UpdateQuantityModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (id: string, newQuantity: number, action: "sell" | "restock" | "remove") => void;
}

export default function UpdateQuantityModal({ 
  isOpen, 
  item, 
  onClose, 
  onSave 
}: UpdateQuantityModalProps) {
  const [action, setAction] = useState<"sell" | "restock" | "remove">("sell");
  const [quantity, setQuantity] = useState<number>(0);
  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    if (isOpen && item) {
      setAction("sell");
      setQuantity(0);
      setErrors("");
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");

    if (quantity <= 0) {
      setErrors("Quantity must be greater than 0");
      return;
    }

    if (action === "sell" && quantity > item.quantity) {
      setErrors("Cannot sell more than available quantity");
      return;
    }

    if (action === "remove" && quantity > item.quantity) {
      setErrors("Cannot remove more than available quantity");
      return;
    }

    onSave(item.id, quantity, action);
    onClose();
  };

  const getNewQuantity = (): number => {
    switch (action) {
      case "sell":
      case "remove":
        return Math.max(0, item.quantity - quantity);
      case "restock":
        return item.quantity + quantity;
      default:
        return item.quantity;
    }
  };

  const getActionColor = () => {
    switch (action) {
      case "sell":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "restock":
        return "text-green-600 bg-green-50 border-green-200";
      case "remove":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Update Quantity
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Item Info */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-600">Current: {item.quantity} {item.unit}</p>
              <p className="text-xs text-gray-500">ID: {item.id}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Action Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "sell", label: "Sell", icon: FiMinus },
                    { value: "restock", label: "Restock", icon: FiPlus },
                    { value: "remove", label: "Remove", icon: FiMinus }
                  ].map((actionOption) => {
                    const Icon = actionOption.icon;
                    return (
                      <button
                        key={actionOption.value}
                        type="button"
                        onClick={() => setAction(actionOption.value as any)}
                        className={`flex flex-col items-center p-2 border rounded-lg transition-colors ${
                          action === actionOption.value
                            ? getActionColor()
                            : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        <span className="text-xs font-medium">{actionOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity {action === "restock" ? "to add" : "to remove"}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                  max={action === "restock" ? undefined : item.quantity}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Preview */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">New quantity:</span>
                  <span className="font-semibold text-gray-900">
                    {getNewQuantity()} {item.unit}
                  </span>
                </div>
              </div>

              {errors && (
                <div className="text-red-600 text-sm">{errors}</div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Update
            </button>
            <button
              type="button"
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