import { useEffect, useState, ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    auth().catch(() => setIsAuthenticated(false));
  }, []);

  const refreshToken = async () => {
    try {
      const response = await api.post("/api/v1.0/refresh-token/");
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      toast.error("You need to login to access this page" , {
        toastId: "refresh-token-failed",
      });
    }
  };

  const auth = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      setIsAuthenticated(false);
      localStorage.removeItem(ACCESS_TOKEN);
      navigate("/login");
      toast.error("You need to login to access this page" , {
        toastId: "refresh-token-failed",
      });
      return;
    }
    const { exp }: { exp: number } = jwtDecode(accessToken);
    if (Date.now() / 1000 > exp) {
      await refreshToken();
    } else {
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
