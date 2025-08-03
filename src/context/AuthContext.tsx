import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Ensure all requests send cookies
axios.defaults.withCredentials = true;

// ================= Interfaces =================
interface LoginData {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
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

interface TempInfo {
  hospital_id: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  userRole: string;
  login: (credentials: LoginData) => Promise<AuthUser>;
  signup: (data: SignUpData) => Promise<AuthUser>;
  logout: () => Promise<void>;
  hospital_Signup: (data: HospitalSignupData) => Promise<void>;
  tempInfo: TempInfo[];
  setTempInfo: React.Dispatch<React.SetStateAction<TempInfo[]>>;
}

// ================= Context Setup =================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================= Provider =================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [tempInfo, setTempInfo] = useState<TempInfo[]>([]);

  // ✅ Hydrate user from backend
  const hydrateUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<AuthUser>(
        "https://clinicpal.onrender.com/api/auth/protected",
        { withCredentials: true }
      );
      setUser(response.data);
      setUserRole(response.data.role || "");
    } catch {
      setUser(null);
      setUserRole("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  // ✅ Login
  const login = useCallback(async (credentials: LoginData): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await axios.post<AuthUser>(
        "https://clinicpal.onrender.com/api/auth/login",
        credentials,
        { withCredentials: true }
      );

      const loggedInUser = response.data;
      setUser(loggedInUser);
      setUserRole(loggedInUser.role || "");
      toast.success("Login successful");

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

  // ✅ Signup (User)
  const signup = useCallback(async (data: SignUpData): Promise<AuthUser> => {
    setLoading(true);
    try {
      await axios.post(
        "https://clinicpal.onrender.com/api/auth/signup",
        data,
        { withCredentials: true }
      );
      await hydrateUser(); // Re-fetch user after signup
      if (!user) throw new Error("User hydration failed after signup");
      toast.success("Signup successful");
      return user;
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
  }, [hydrateUser, user]);

  // ✅ Signup (Hospital)
  const hospital_Signup = useCallback(async (data: HospitalSignupData): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://clinicpal.onrender.com/api/auth/hospitals_signup",
        data,
        { withCredentials: true }
      );
      toast.success("Hospital registered successfully");

      setTempInfo([
        {
          hospital_id: response.data.secretInfo.hospital_id,
          password: response.data.secretInfo.password,
        },
      ]);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Hospital signup failed.";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Logout
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://clinicpal.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setUserRole("");
      toast.info("Logged out");
      await hydrateUser();
    } catch {
      toast.error("Logout failed.");
    } finally {
      setLoading(false);
    }
  }, [hydrateUser]);

  // ✅ Provide context
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      userRole,
      login,
      signup,
      logout,
      hospital_Signup,
      tempInfo,
      setTempInfo,
    }),
    [user, loading, userRole, login, signup, logout, hospital_Signup, tempInfo]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// ================= Hook =================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
