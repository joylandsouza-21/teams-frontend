import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/auth.context";
import { SocketProvider, useSocket } from "./store/socket.context";
import { Toaster } from "sonner";

import Chats from "./pages/dashboard/Chats";
import Login from "./pages/auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Calls from "./pages/dashboard/Calls";
import IncomingCallCard from "./features/calls/components/IncomingCallCard";
import { useEffect, useState } from "react";
import { subscribeForPush } from "./utils/notifications";
import { savePushNotificationApi } from "./api/push.api";
import { toastError } from "./utils/toast";

function AppRoutes() {
  const { socket } = useSocket();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // 🔔 Incoming call event from backend
    socket.on("incoming_call", (data) => {
      console.log("Incoming call:", data);
      setIncomingCall(data);
    });

    return () => socket.off("incoming_call");
  }, [socket]);

  // Accept
  const handleAccept = () => {
    window.open(`/call/${incomingCall.callId}`, "_blank");
    setIncomingCall(null);
  };

  // Reject
  const handleReject = () => {
    socket.emit("reject_call", { callId: incomingCall.callId });
    setIncomingCall(null);
  };

  useEffect(() => {
    async function setupPush() {
      try {
        if (!auth?.token) return;

        const sub = await subscribeForPush();
        if (!sub) return;

        const existing = JSON.parse(localStorage.getItem("push_sub"));

        // ⛔ If subscription is the same, do NOT update backend
        if (existing && JSON.stringify(existing) === JSON.stringify(sub)) {
          console.log("Push subscription unchanged — skipping API call");
          return;
        }

        // ✅ Save to backend
        await savePushNotificationApi({
          token: auth?.token,
          body: { subscription: sub }
        });

        // Save locally
        localStorage.setItem("push_sub", JSON.stringify(sub));

      } catch (err) {
        console.error("Push setup error:", err);

        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to enable call notifications";

        toastError(msg);
      }
    }

    setupPush();
  }, [auth?.token]);



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
        <Route path="/call/:callId" element={<Calls />} />

        {/* ✅ Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/chats" element={<Chats />} />
        </Route>

        {/* ✅ Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {incomingCall && (
        <IncomingCallCard
          {...incomingCall}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
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
