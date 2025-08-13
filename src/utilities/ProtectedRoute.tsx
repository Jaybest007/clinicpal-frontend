import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/just-logo.svg";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Add a slight delay to prevent layout flicker on refresh
    const timeout = setTimeout(() => {
      setReady(true);
    }, 200); // short enough not to be noticed, long enough to reduce jitter

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready && !loading && !user) {
      navigate("/login", { replace: true });
    }

    if(ready && !loading && userRole === "unactivated") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, ready, navigate, userRole]);

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="flex flex-col items-center">
          <img 
            src={logo} 
            alt="ClinicPal Logo" 
            className="w-16 h-16 mb-4 rounded-full shadow-md animate-bounce" 
            style={{ 
              animation: "pulse-and-bounce 2s infinite ease-in-out",
            }}
          />
          <p className="text-blue-600 font-medium mt-3">Validating session...</p>
        </div>
        <style>{`
          @keyframes pulse-and-bounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 1;
            }
            50% {
              transform: translateY(-10px);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
