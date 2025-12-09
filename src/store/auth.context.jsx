import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const logout = () => {
    localStorage.setItem("userData", null)
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
