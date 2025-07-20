import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ================= Interfaces =================
interface LoginData {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  token: string;
  role?: string;
  hospital_id: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  hospital_id: string;
}

interface HospitalSignupData {
  name: string;
  address: string;
  email: string;
  phone: string;
}
interface tempInfo{
  hospital_id: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  userRole: string;
  login: (credentials: LoginData) => Promise<AuthUser>;
  signup: (data: SignUpData) => Promise<AuthUser>;
  logout: () => void;
  hospital_Signup: (data: HospitalSignupData) => Promise<void>;
  tempInfo: tempInfo[];
  setTempInfo: React.Dispatch<React.SetStateAction<tempInfo[]>>;
}

// ================= Constants =================
const STORAGE_KEY = "clinicpal_user";

// ================= Context Setup =================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================= Provider =================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [tempInfo, setTempInfo] = useState<tempInfo[]>([])
  // ==== Rehydrate from localStorage ====
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          setUser(parsed);
          setUserRole(parsed.role || "");
        }
      } catch (error) {
        console.error("Invalid user session data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // ==== Login ====
  const login = useCallback(async (credentials: LoginData): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await axios.post<AuthUser>("https://clinicpal.onrender.com/api/auth/login", credentials);
      const loggedInUser = response.data;

      // Save to state and localStorage
      setUser(loggedInUser);
      setUserRole(loggedInUser.role || "");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));

      toast.success("Login successful");

      // Hard refresh to clear stale context
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 100);

      return loggedInUser;
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==== Signup (User) ====
  const signup = useCallback(async (data: SignUpData): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await axios.post<AuthUser>("https://clinicpal.onrender.com/api/auth/signup", data);
      const newUser = response.data;

      setUser(newUser);
      setUserRole(newUser.role || "");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      toast.success("Signup successful");

      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 100);

      return newUser;
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Signup failed. Please try again.";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==== Signup (Hospital) ====
  const hospital_Signup = useCallback(async (data: HospitalSignupData): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post("https://clinicpal.onrender.com/api/auth/hospitals_signup", data);
      toast.success("Hospital registered successfully");
      setTempInfo([{
        hospital_id: response.data.secretInfo.hospital_id,
        password: response.data.secretInfo.password
      }]);
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err?.response?.data?.message ||
        "Hospital signup failed.";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==== Logout ====
  const logout = useCallback(() => {
    setUser(null);
    setUserRole("");
    localStorage.removeItem(STORAGE_KEY);

    toast.info("Logged out");

    // Reload to flush context
    window.location.replace("/login");
  }, []);

  






  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        login,
        signup,
        logout,
        hospital_Signup,
        setTempInfo, tempInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= Hook =================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};