import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { useEffect } from "react";

//====interface for login info=====
interface LoginData {
  email: string;
  password: string;
}

//===interface for authenticated user that has logged in====
interface AuthUser {
  id: string;
  name: string;
  token: string;
}

//===interface for signupdata===
interface SignUpData{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}
//==interface for setting type of auth
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  signup: (credentials: SignUpData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

    //====check for user data in local storage=====
  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem("clinicpal_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginData) => {
    try {
      setLoading(true);
      const response = await axios.post<AuthUser>("http://localhost:5000/api/auth/login", credentials);
      setUser(response.data);
      localStorage.setItem("clinicpal_user", JSON.stringify(response.data));
    } catch (err) {
      throw err

    } finally {
      setLoading(false);
    }
  }, []);


const signup = useCallback(async (credentials: SignUpData) => {
  try {
    setLoading(true);
    const response = await axios.post<AuthUser>("http://localhost:5000/api/auth/signup", credentials);
    setUser(response.data);
    localStorage.setItem("clinicpal_user", JSON.stringify(response.data));
  } catch (err) {
    throw err;
  } finally {
    setLoading(false); 
  }
}, []);





  const logout = () => {
    setUser(null);
    localStorage.removeItem("clinicpal_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
