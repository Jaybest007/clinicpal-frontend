import { toast } from "react-toastify";

/**
 * Centralized error handler for API responses
 * Handles 403 logout and displays appropriate error messages
 */
export const handleApiError = (err: any): void => {
  const code = err?.response?.status;
  
  // Handle 403 - Force logout and reload
  if (code === 403) {
    localStorage.removeItem("clinicpal_user");
    window.location.reload();
    return;
  }
  
  // Display error message for other errors
  const errorMessage = 
    err?.response?.data?.message || 
    err?.response?.data?.error || 
    err?.message || 
    "An error occurred";
  
  toast.error(errorMessage);
};