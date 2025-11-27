import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.context";

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useAuth();

  // ✅ WAIT until localStorage is checked
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!auth?.token) {
    return <Navigate to="/" />;
  }

  return children;
}
