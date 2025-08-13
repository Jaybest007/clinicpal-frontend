import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { 
  InventoryItem, 
  NewInventoryItem, 
  InventoryTransaction, 
  InventoryTransactionItem, 
  RestockItem, 
  SaleData, 
  TransactionFilters 
} from "../types";
import { API_BASE_URL, API_ENDPOINTS } from "../services/api";
import { handleApiError } from "../utils/errorHandler";

// Add role as a parameter instead of using context
export const useInventory = (token?: string, userRole?: string) => {
  // State for inventory items
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // State for transaction history
  const [transactionHistory, setTransactionHistory] = useState<InventoryTransaction[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState<Error | null>(null);

  // Common headers for authenticated requests
  const getHeaders = useCallback(() => {
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
  }, [token]);

  // Helper function to determine stock status
  const getStockStatus = useCallback((quantity: number, minThreshold: number): string => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= minThreshold) return "Low Stock";
    return "In Stock";
  }, []);

  // Fetch inventory items
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_INVENTORY}`, 
        getHeaders()
      );
      setInventory(response.data);
    } catch (error) {
      const handledError = handleApiError(error);
      setError(handledError);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async (filters?: TransactionFilters) => {
    setTransactionLoading(true);
    setTransactionError(null);
    
    try {
      // Build query params
      const queryParams = new URLSearchParams();
      
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.type && filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Make the API call
      const response = await axios.get(
        `${API_BASE_URL}/inventory/transactions${query}`, 
        getHeaders()
      );
      
      setTransactionHistory(response.data);
    } catch (error) {
      const handledError = handleApiError(error);
      setTransactionError(handledError);
      
    } finally {
      setTransactionLoading(false);
    }
  }, [getHeaders]);

  // Add new inventory item
  const addInventoryItem = useCallback(async (newItem: NewInventoryItem): Promise<InventoryItem> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADD_INVENTORY_ITEM}`, 
        newItem, 
        getHeaders()
      );
      
      // Update local state
      setInventory(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
     
      throw handledError;
    }
  }, [getHeaders]);

  // Update inventory item
  const updateInventoryItem = useCallback(async (updatedItem: InventoryItem): Promise<InventoryItem> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_INVENTORY_ITEM}/${updatedItem.id}`, 
        updatedItem, 
        getHeaders()
      );
      
      // Update local state
      setInventory(prev => prev.map(item => 
        item.id === response.data.id ? response.data : item
      ));
      
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [getHeaders]);

  // Delete inventory item
  const deleteInventoryItem = useCallback(async (id: string): Promise<void> => {
    try {
      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.DELETE_INVENTORY_ITEM}/${id}`, 
        getHeaders()
      );
      
      // Update local state
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [getHeaders]);

  // Process sale transaction
  const processSale = useCallback(async (
    items: InventoryTransactionItem[], 
    saleData: SaleData
  ): Promise<InventoryTransaction> => {
    try {
      const payload = {
        items,
        staff: saleData.staff,
        notes: saleData.notes,
        totalAmount: saleData.totalAmount,
        type: "sale"
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/inventory/transactions/sale`, 
        payload, 
        getHeaders()
      );
      
      // Update local inventory state
      setInventory(prev => prev.map(item => {
        const transactionItem = items.find(ti => ti.id === item.id);
        if (transactionItem) {
          return {
            ...item,
            quantity: Math.max(0, item.quantity - transactionItem.quantityToSell)
          };
        }
        return item;
      }));
      
      // Update local transaction history
      setTransactionHistory(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [getHeaders]);

  // Process restock transaction
  const processRestock = useCallback(async (items: RestockItem[]): Promise<InventoryTransaction> => {
    try {
      const payload = {
        items,
        type: "restock",
        notes: "Inventory restocked"
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/inventory/transactions/restock`, 
        payload, 
        getHeaders()
      );
      
      // Update local inventory state
      setInventory(prev => prev.map(item => {
        const restockItem = items.find(ri => ri.id === item.id);
        if (restockItem) {
          return {
            ...item,
            quantity: item.quantity + restockItem.quantityToAdd
          };
        }
        return item;
      }));
      
      // Update local transaction history
      setTransactionHistory(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [getHeaders]);

  // Initial data load - only check role here
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setTransactionLoading(false);
      return;
    }
    
    // Only check the role once here
    const hasAccess = userRole === "super admin" || userRole === "pharmacist";
    if (!hasAccess) {
      setLoading(false);
      setTransactionLoading(false);
      return;
    }
    
    fetchInventory();
    fetchTransactionHistory();
  }, [token, fetchInventory, fetchTransactionHistory, userRole]);

  return {
    // Inventory data and operations
    inventory,
    loading,
    error,
    fetchInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getStockStatus,
    
    // Transaction data and operations
    transactionHistory,
    transactionLoading,
    transactionError,
    fetchTransactionHistory,
    processSale,
    processRestock
  };
};