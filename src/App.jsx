import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/auth.context";
import Chats from "./pages/dashboard/Chats";
import Login from "./pages/auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Calls from "./pages/dashboard/Calls";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ✅ Default Route */}
        <Route path="/" element={<Login />} />

        {/* ✅ Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/chats" element={<Chats />} />
          <Route path="/calls" element={<Calls />} />
        </Route>

        {/* ✅ Catch-All Route (IMPORTANT) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
