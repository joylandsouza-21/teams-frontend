import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePushNotificationApi } from "../api/push.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
      setAuth(userData);
    }

    setLoading(false);
  }, []);

  const logout = async () => {
    await deletePushNotificationApi(auth?.token)
    localStorage.removeItem("userData")
    localStorage.removeItem("push_sub");
    setAuth(null)
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
