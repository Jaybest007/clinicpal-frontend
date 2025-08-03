import axios from "axios";
import React from "react";
import { useCallback, useContext, createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

//========== interfaces ==========
interface hospitalLogin {
  hospital_id: string;
  password: string;
}
interface updateStaffRole {
  id: string;
  newRole: string;
}

interface deleteUser {
  id: string;
}
interface hospitalData {
  name: string;
  hospital_id: string;
  role: string;
}
interface staffsData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  created_at: Date;
}

//=======================
interface HospitalContextType {
  loading: boolean;
  hospitalLogin: (credentials: hospitalLogin) => Promise<void>;
  updateStaffRole: (credentials: updateStaffRole) => Promise<void>;
  deleteUser: (credentials: deleteUser) => Promise<void>;
  hospitalData: hospitalData | null;
  logout: () => void;
  staffs: staffsData[] | null;
  deletePatient: (patient_id: string) => Promise<void>;
  fetchStaffs: () => Promise<void>;
}

//============ context setup =============
const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// Ensure axios sends cookies with every request
axios.defaults.withCredentials = true;

// ========== Provider ============
export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hospitalData, setHospitalData] = useState<hospitalData | null>(null);
  const [staffs, setStaffs] = useState<staffsData[] | null>(null);

  // Prevent duplicate fetches
  const fetchStaffsInProgress = useRef(false);

  // Utility: handle API errors with 403 auto-logout and no toast
  const handleApiError = (err: any) => {
    const code = err?.response?.status;
    if (code === 403) {
      window.location.reload();
      return;
    }
    const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "An unexpected error occurred.";
    toast.error(errorMessage);
  };

  // Hydrate hospital data from backend (not localStorage)
  useEffect(() => {
    axios.get<hospitalData>("https://clinicpal.onrender.com/api/auth/protected", { withCredentials: true })
      .then((response) => {
        setHospitalData(response.data);
      })
      .catch(() => {
        setHospitalData(null);
      });
  }, []);

  //============== login hospital =============
  const hospitalLogin = useCallback(async (credentials: hospitalLogin) => {
    try {
      setLoading(true);
      await axios.post("https://clinicpal.onrender.com/api/auth/hospital_login", credentials, { withCredentials: true });
      // After login, fetch hospital info
      const response = await axios.get<hospitalData>("https://clinicpal.onrender.com/api/hospitals/me", { withCredentials: true });
      setHospitalData(response.data);
      toast.success("Login successful");
      window.location.replace("/hq/dashboard");
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //============log out ==============
  const logout = useCallback(() => {
    setHospitalData(null);
    axios.post("https://clinicpal.onrender.com/api/auth/logout", { withCredentials: true }).finally(() => {
      toast.info("Logged out");
      window.location.replace("/hq/login");
    });
  }, []);

  //===========fetch all staffs ==============
  const fetchStaffs = useCallback(async () => {
    if (fetchStaffsInProgress.current || !hospitalData || hospitalData.role !== "hospital") return;
    fetchStaffsInProgress.current = true;
    if (!hospitalData) return;
    try {
      setLoading(true);
      const response = await axios.get("https://clinicpal.onrender.com/api/hospitals/fetchStaffs", { withCredentials: true });
      if (Array.isArray(response.data)) {
        setStaffs(response.data);
      } else {
        setStaffs([]);
      }
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
      fetchStaffsInProgress.current = false;
    }
  }, [hospitalData]);

  // Only fetch staffs if not already loaded and hospitalData is present
  useEffect(() => {
    if (hospitalData && !staffs) {
      fetchStaffs();
    }
    // eslint-disable-next-line
  }, [hospitalData]);

  //=========== Give staff role =============
  const updateStaffRole = useCallback(
    async (credentials: updateStaffRole) => {
      if (!hospitalData) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/hospitals/update_staff_role",
          credentials,
          { withCredentials: true }
        );
        toast.success(response.data.success);
        await fetchStaffs();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [hospitalData, fetchStaffs]
  );

  //=========== delete staff ===============
  const deleteUser = useCallback(
    async (credentials: deleteUser) => {
      if (!hospitalData) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/hospitals/delete_staff",
          credentials, { withCredentials: true }
        );
        toast.success(response.data.success);
        await fetchStaffs();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [hospitalData, fetchStaffs]
  );

  //===========delete patient data ===============
  const deletePatient = useCallback(
    async (patient_id: string) => {
      
      if (!hospitalData) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.delete(
          `https://clinicpal.onrender.com/api/hospitals/delete_patient/${patient_id}`, { withCredentials: true }
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [hospitalData, fetchStaffs]
  );

  return (
    <HospitalContext.Provider
      value={{
        loading,
        updateStaffRole,
        deleteUser,
        hospitalLogin,
        hospitalData,
        logout,
        staffs,
        deletePatient,
        fetchStaffs
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};