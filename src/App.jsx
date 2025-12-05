import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/auth.context";
import { SocketProvider, useSocket } from "./store/socket.context";
import { Toaster } from "sonner";

import Chats from "./pages/dashboard/Chats";
import Login from "./pages/auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Calls from "./pages/dashboard/Calls";

function AppRoutes() {
  const { isSocketConnected } = useSocket();
  const { auth } = useAuth();

  if (auth?.token && !isSocketConnected) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
          <p className="text-sm text-gray-400">
            Connecting to chat server...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: "#1f1f1f",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />
      <Routes>
        {/* ✅ Default Route */}
        <Route path="/" element={<Login />} />

        {/* ✅ Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/chats" element={<Chats />} />
          <Route path="/calls" element={<Calls />} />
        </Route>

        {/* ✅ Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </AuthProvider>
  );
}
