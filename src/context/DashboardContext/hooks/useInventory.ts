import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { 
  InventoryItem, 
  NewInventoryItem, 
  InventoryTransaction, 
  InventoryTransactionItem, 
  RestockItem, 
  SaleData, 
  TransactionFilters,
  InventoryCategory
} from "../types";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import { handleApiError } from "../utils/errorHandler";

// Add role as a parameter instead of using context
export const useInventory = (token?: string | null, userRole?: string) => {
  // State for inventory items
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // State for transaction history
  const [transactionHistory, setTransactionHistory] = useState<InventoryTransaction[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState<Error | null>(null);


  // Helper function to determine stock status
  const getStockStatus = useCallback((quantity: number, minThreshold: number): string => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= minThreshold) return "Low Stock";
    return "In Stock";
  }, []);

  // Check if user is authorized to perform inventory operations
  const authorizedRole = useCallback((): boolean => {
    if (!userRole) {
      setError(new Error("Authentication required"));
      return false;
    }

    if (!["super admin", "pharmacist"].includes(userRole.toLowerCase())) {
      setError(new Error("Unauthorized: Only pharmacists and administrators can access inventory"));
      return false;
    }
    
    return true;
  }, [userRole]);
  // Fetch inventory items
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Check authorization
    if (!authorizedRole()) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_INVENTORY}`, 
        createApiRequest(token)
      );
      setInventory(response.data);
    } catch (error) {
      const handledError = handleApiError(error);
      setError(handledError);
    } finally {
      setLoading(false);
    }
  }, [token, authorizedRole]);

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async (filters?: TransactionFilters) => {
    setTransactionLoading(true);
    setTransactionError(null);
    
    // Check authorization
    if (!authorizedRole()) {
      setTransactionLoading(false);
      return;
    }
    
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
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_TRANSACTION_HISTORY}${query}`, 
        createApiRequest(token)
      );
      
      setTransactionHistory(response.data);
    } catch (error) {
      const handledError = handleApiError(error);
      setTransactionError(handledError);
      
    } finally {
      setTransactionLoading(false);
    }
  }, [token, authorizedRole]);

  // Add new inventory item
  const addInventoryItem = useCallback(async (newItem: NewInventoryItem): Promise<InventoryItem> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can add inventory");
    }
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADD_INVENTORY_ITEM}`, 
        newItem, 
        createApiRequest(token)
      );
      
      // Update local state
      setInventory(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
     
      throw handledError;
    }
  }, [token, authorizedRole]);

  // Update inventory item
  const updateInventoryItem = useCallback(async (updatedItem: InventoryItem): Promise<InventoryItem> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can update inventory");
    }
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_INVENTORY_ITEM}/${updatedItem.id}`, 
        updatedItem, 
        createApiRequest(token)
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
  }, [token, authorizedRole]);

  // Update inventory item status
  const updateInventoryItemStatus = useCallback(async (id: string, status: string): Promise<InventoryItem> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can update inventory status");
    }
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_INVENTORY_ITEM_STATUS}/${id}`, 
        { status }, 
        createApiRequest(token)
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
  }, [token, authorizedRole]);

  // Delete inventory item
  const deleteInventoryItem = useCallback(async (id: string): Promise<void> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can delete inventory items");
    }
    
    try {
      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.DELETE_INVENTORY_ITEM}/${id}`, 
       createApiRequest(token)
      );
      
      // Update local state
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [token, authorizedRole]);

  // Fetch a single inventory item by ID
  const fetchInventoryItem = useCallback(async (id: number): Promise<InventoryItem> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can view inventory details");
    }
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_INVENTORY_ITEM}/${id}`, 
        createApiRequest(token)
      );
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [token, authorizedRole]);

  // Fetch inventory categories
  const fetchInventoryCategories = useCallback(async (): Promise<InventoryCategory[]> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can view inventory categories");
    }
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_INVENTORY_CATEGORIES}`, 
        createApiRequest(token)
      );
      return response.data;
    } catch (error) {
      const handledError = handleApiError(error);
      throw handledError;
    }
  }, [token, authorizedRole]);

  // Process sale transaction
  const processSale = useCallback(async (
    items: InventoryTransactionItem[], 
    saleData: SaleData
  ): Promise<InventoryTransaction> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can process sales");
    }
    
    try {
      const payload = {
        items,
        saleData: {
          staff: saleData.staff,
          notes: saleData.notes,
          totalAmount: saleData.totalAmount
        }
      };
      
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.PROCESS_SALE}`, 
        payload, 
        createApiRequest(token)
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
  }, [token, authorizedRole]);

  // Process restock transaction
  const processRestock = useCallback(async (items: RestockItem[]): Promise<InventoryTransaction> => {
    // Check authorization
    if (!authorizedRole()) {
      throw new Error("Unauthorized: Only pharmacists and administrators can restock inventory");
    }
    
    try {
      const payload = { items };
      
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.PROCESS_RESTOCK}`, 
        payload, 
        createApiRequest(token)
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
  }, [token, authorizedRole]);

  // Initial data load - only check role here
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setTransactionLoading(false);
      return;
    }
    
    // Let the authorizedRole function handle all authorization checks
    if (!authorizedRole()) {
      setLoading(false);
      setTransactionLoading(false);
      return;
    }
    
    fetchInventory();
    fetchTransactionHistory();
  }, [token, fetchInventory, fetchTransactionHistory, authorizedRole]);

  return {
    // Inventory data and operations
    inventory,
    loading,
    error,
    fetchInventory,
    fetchInventoryItem,
    fetchInventoryCategories,
    addInventoryItem,
    updateInventoryItem,
    updateInventoryItemStatus,
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