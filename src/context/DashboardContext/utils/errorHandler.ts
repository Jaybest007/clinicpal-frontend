import axios from 'axios';


/**
 * Unified API error handler
 * Standardizes error format and messages across the application
 */
export const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const errorData = error.response?.data;
    
    // Handle authentication errors
    if (statusCode === 401) {
      // Optionally force logout the user here
      return new Error('Authentication failed. Please log in again.');
    }
    
    // Handle various error response formats
    if (errorData) {
      if (typeof errorData === 'string') {
        return new Error(errorData);
      }
      
      if (errorData.message) {
        return new Error(errorData.message);
      }
      
      if (errorData.error) {
        return new Error(
          typeof errorData.error === 'string' 
            ? errorData.error 
            : 'An error occurred while processing your request.'
        );
      }
    }
    
    // Generic error messages based on status code
    if (statusCode === 404) {
      return new Error('The requested resource was not found.');
    }
    
    if (statusCode === 403) {
      return new Error('You don\'t have permission to access this resource.');
    }
    
    if (typeof statusCode === 'number' && statusCode >= 500) {
      return new Error('Server error. Please try again later.');
    }
    
    return new Error(error.message || 'An error occurred while processing your request.');
  }
  
  // Handle non-axios errors
  if (error instanceof Error) {
    return error;
  }
  
  // Fallback for unknown error types
  return new Error('An unexpected error occurred.');
};