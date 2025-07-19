import axios from "axios";
import React from "react";
import { useCallback, useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

//========== interfaces ==========
interface hospitalLogin{
    hospital_id: string;
    password: string;
}
interface updateStaffRole{
    id: string;
    newRole: string;
}

interface deleteUser{
    id: string;
}
interface hospitalData {
    name: string;
    hospital_id: string;
    token: string;
    role: string;
}
interface staffsData{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    created_at: Date;
}


//=======================
interface HospitalContextType{
    loading: boolean;
    hospitalLogin: (credentials: hospitalLogin) => Promise<void>
    updateStaffRole: (credentials: updateStaffRole) => Promise<void>;
    deleteUser: (credentials: deleteUser) => Promise<void>;
    hospitalData: hospitalData | null;
    logout: () => void;
    staffs: staffsData[] | null;

}


// =========== end ================


//============ context setup =============
const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// ========== Provider ============
export const HospitalProvider: React.FC <{ children: React.ReactNode}> = ({children}) =>{

    const [loading, setLoading] = useState<boolean>(false);
    const [hospitalData, setHospitalData] = useState<hospitalData | null>(null)
    const [staffs, setStaffs] = useState<staffsData[] | null>(null);


//======logic==========
useEffect(() => {
  const stored = localStorage.getItem("hospital_data");
  if (stored) {
    setHospitalData(JSON.parse(stored));
  }
}, []);


//======apis==============
    
//============== login hospital =============
const hospitalLogin = useCallback( async(credentials: hospitalLogin) => {
    try{
        setLoading(true);

        const response = await axios.post("http://localhost:5000/api/auth/hospital_login", credentials)    
        localStorage.setItem("hospital_data", JSON.stringify(response.data));
        setHospitalData(response.data);
        toast.success(response.data.success)
    
    }catch(err: any){
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
        toast.error(errorMessage);
        throw err;
    }finally{
        setLoading(false)
    } 
}, [])


//============log out ==============
const logout = useCallback( ()=> {
    setHospitalData(null)
    localStorage.removeItem("hospital_data")
    toast.info("Logged out")
    window.location.replace("/hq_login")
},[])


//===========fetch all staffs ==============
const fetchStaffs = useCallback( async() =>{
    
    try{
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/hospitals/fetchStaffs",
            {
                headers: {
                    Authorization: `Bearer ${hospitalData?.token}`
                }
            }
        )
        toast.success(response.data.success)
        setStaffs(response.data.results);
       
    } catch(err: any){
        const error = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
        toast.error(error);
    } finally{
        setLoading(false);
    }
},[hospitalData])

useEffect(()=> {
    if(hospitalData?.token && !staffs){
        fetchStaffs()
    }
},[staffs, fetchStaffs])

//=========== Give staff role =============
 const updateStaffRole = useCallback( async(credentials: updateStaffRole)=> {
    try{
        setLoading(true);
        const response = await axios.post("http://localhost:5000/api/hospitals/update_staff_role", 
            credentials, {
                headers: {
                    Authorization: `Bearer ${hospitalData?.token}`
                }
            });
        toast.success(response.data.success);
        fetchStaffs() 
    }catch(err: any){
        const errorMessage = err.response.data.error || err.response.data.message;
        toast.error(errorMessage);
    }finally{
        setLoading(false)
    }
 },[hospitalData])

//=========== delete staff ===============
const deleteUser = useCallback( async(credentials: deleteUser) => {
    try{
        setLoading(true)
        const response = await axios.post("http://localhost:5000/api/hospitals/delete_staff", 
            credentials, {
                headers: {
                    Authorization: `Bearer ${hospitalData?.token}`
                }
            })
        toast.success(response.data.success);
        fetchStaffs()
    }catch(err: any){
        const errorMessage = err.response?.data?.error || err.message
        toast.error(errorMessage);
    }finally{
        setLoading(false)
    }
},[hospitalData])





return(
    <HospitalContext.Provider value={{
        loading,
        updateStaffRole,
        deleteUser, 
        hospitalLogin,
        hospitalData, logout, staffs
        
    }}>
    {children}
    </HospitalContext.Provider>
)


}

export const useHospital = (): HospitalContextType => {
    const context = useContext(HospitalContext);
    if(context === undefined){
        throw new Error("useHospital must be used within a HospitalProvider");

  }
  return context;
}