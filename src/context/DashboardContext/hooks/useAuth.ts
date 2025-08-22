import { useState, useEffect } from "react";
import { getTokenFromStorage, getRoleFromStorage } from "../utils/storage";

/**
 * Authentication hook for managing user token and role
 */
export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => getTokenFromStorage());
  const [role, setRole] = useState<string | null>(() => getRoleFromStorage());

  useEffect(() => {
    // Sync with localStorage on mount
    const storedToken = getTokenFromStorage();
    setToken(storedToken);
    
    const storedRole = getRoleFromStorage();
    setRole(storedRole);
  }, []);

  return {
    token,
    role,
    setToken,
    setRole,
  };
};