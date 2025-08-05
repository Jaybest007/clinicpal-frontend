/**
 * Safely get user data from localStorage
 */
export const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem("clinicpal_user");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to parse clinicpal_user:", err);
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