import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHospital } from "../context/HospitalContext";
import logo from "../assets/logo.png";

const logoAnimationStyles = `
  @keyframes breathe {
    0%, 100% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
  }
  .logo-breathe {
    animation: breathe 2s ease-in-out infinite;
  }
`;

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { hospitalData, loading } = useHospital();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready && !loading && !hospitalData) {
      navigate("/hq/login", { replace: true });
    }
  }, [hospitalData, loading, ready, navigate]);

  if (!ready || loading) {
    return (
      <>
        <style>{logoAnimationStyles}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50">
          <div className="relative flex items-center justify-center">
            <img
              src={logo}
              alt="ClinicPal Logo"
              className="w-24 h-24 object-contain logo-breathe"
            />
          </div>
          <p className="mt-4 text-blue-600 font-medium animate-pulse">Loading ClinicPal...</p>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;