import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHospital } from "../context/HospitalContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { hospitalData, loading } = useHospital();
  const [ready, setReady] = useState(false);

  useEffect(() => {
   
    const timeout = setTimeout(() => {
      setReady(true);
    }, 200); 

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready && !loading && !hospitalData) {
      navigate("/hq_login", { replace: true });
    }
  }, [hospitalData, loading, ready, navigate]);

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 animate-pulse">
        Validating session...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
