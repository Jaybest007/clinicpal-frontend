/**
 * Safely get user data from localStorage
 */
export const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem("clinicpal_user");
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed;
  } catch (err) {
    console.error("Failed to parse clinicpal_user:", err);
    localStorage.removeItem("clinicpal_user"); // Clear corrupted data
    return null;
  }
};

/**
 * Get token from localStorage
 */
export const getTokenFromStorage = (): string | null => {
  const user = getUserFromStorage();
  return user?.token || null;
};

/**
 * Get user role from localStorage
 */
export const getRoleFromStorage = (): string | null => {
  const user = getUserFromStorage();
  return user?.role || null;
};