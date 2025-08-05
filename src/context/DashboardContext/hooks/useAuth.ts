import { useState, useEffect } from "react";
import { getTokenFromStorage, getRoleFromStorage } from "../utils/storage";

/**
 * Authentication hook for managing user token and role
 */
export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => getTokenFromStorage());
  const [role, setRole] = useState<string | null>(() => getRoleFromStorage());

  useEffect(() => {
    // Sync with localStorage on mount if not already set
    if (!token) {
      const storedToken = getTokenFromStorage();
      if (storedToken) setToken(storedToken);
    }

    if (!role) {
      const storedRole = getRoleFromStorage();
      if (storedRole) setRole(storedRole);
    }
  }, [token, role]);

  return {
    token,
    role,
    setToken,
    setRole,
  };
};