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
  token: string;
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
}

//============ context setup =============
const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// ========== Provider ============
export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hospitalData, setHospitalData] = useState<hospitalData | null>(null);
  const [staffs, setStaffs] = useState<staffsData[] | null>(null);
 

  // Prevent duplicate fetches
  const fetchStaffsInProgress = useRef(false);

  //======logic==========
  useEffect(() => {
    const stored = localStorage.getItem("hospital_data");
    if (stored) {
      setHospitalData(JSON.parse(stored));
    }
  }, []);

  //============== login hospital =============
  const hospitalLogin = useCallback(async (credentials: hospitalLogin) => {
    try {
      setLoading(true);
      const response = await axios.post("https://clinicpal.onrender.com/api/auth/hospital_login", credentials);
      localStorage.setItem("hospital_data", JSON.stringify(response.data));
      setHospitalData(response.data);
      toast.success(response.data.success);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //============log out ==============
  const logout = useCallback(() => {
    setHospitalData(null);
    localStorage.removeItem("hospital_data");
    toast.info("Logged out");
    window.location.replace("/hq/login");
  }, []);

  //===========fetch all staffs ==============
  const fetchStaffs = useCallback(async () => {
    if (!hospitalData?.token || fetchStaffsInProgress.current || hospitalData.role !== "hospital") return;
    fetchStaffsInProgress.current = true;
    try {
      setLoading(true);
      const response = await axios.get("https://clinicpal.onrender.com/api/hospitals/fetchStaffs", {
        headers: {
          Authorization: `Bearer ${hospitalData.token}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setStaffs(response.data);
      } else if (response.data?.staffs && Array.isArray(response.data.staffs)) {
        setStaffs(response.data.staffs);
      }
      if (response.data.success) toast.success(response.data.success);
    } catch (err: any) {
      const error = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
      toast.error(error);
    } finally {
      setLoading(false);
      fetchStaffsInProgress.current = false;
    }
  }, [hospitalData]);

  // Only fetch staffs if not already loaded and token is present
  useEffect(() => {
    if (hospitalData?.token && !staffs) {
      fetchStaffs();
    }
    // eslint-disable-next-line
  }, [hospitalData?.token]);

  //=========== Give staff role =============
  const updateStaffRole = useCallback(
    async (credentials: updateStaffRole) => {
      if (!hospitalData?.token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/hospitals/update_staff_role",
          credentials,
          {
            headers: {
              Authorization: `Bearer ${hospitalData.token}`,
            },
          }
        );
        toast.success(response.data.success);
        await fetchStaffs();
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [hospitalData, fetchStaffs]
  );

  //=========== delete staff ===============
  const deleteUser = useCallback(
    async (credentials: deleteUser) => {
      if (!hospitalData?.token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/hospitals/delete_staff",
          credentials,
          {
            headers: {
              Authorization: `Bearer ${hospitalData.token}`,
            },
          }
        );
        toast.success(response.data.success);
        await fetchStaffs();
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [hospitalData, fetchStaffs]
  );

//===========delete patient data ===============
  const deletePatient = useCallback(
    async (patient_id: string) => {

      if (!hospitalData?.token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.delete(
          `https://clinicpal.onrender.com/api/hospitals/delete_patient/${patient_id}`,
          {
            headers: {
              Authorization: `Bearer ${hospitalData.token}`,
            },
          }
        );
        toast.success(response.data.success);
        
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred.";
        toast.error(errorMessage);
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
        deletePatient
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