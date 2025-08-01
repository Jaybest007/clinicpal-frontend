import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
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
  }, [user, loading, ready, navigate]);

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
