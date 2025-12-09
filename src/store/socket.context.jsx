import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import { useAuth } from "./auth.context";
import { getStatusByKey } from "../utils/statusConfig";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { auth, logout } = useAuth();
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [socketError, setSocketError] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});

  // ✅ HANDLE TOKEN → CONNECT / DISCONNECT
  useEffect(() => {
    if (auth?.token) {
      socket.auth = {
        token: auth.token,
      };

      console.log("🔐 Attaching token & connecting socket...");
      console.log("SOCKET URL:", import.meta.env.VITE_SOCKET_URL);

      if (!socket.connected) {
        socket.connect();
      }
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [auth?.token]);

  useEffect(() => {
    if (!socket) return;

    const onPresence = ({ userId, status, lastActive }) => {
      setUserStatuses(prev => ({
        ...prev,
        [userId]: { status, lastActive }
      }));
    };

    socket.on("presence_update", onPresence);

    return () => {
      socket.off("presence_update", onPresence);
    };
  }, [socket]);


  // ✅ SOCKET LIFECYCLE + ERROR LISTENERS
  useEffect(() => {
    const onConnect = () => {
      console.log("✅ Socket Connected");
      setIsSocketConnected(true);
      setSocketError(null);
    };

    const onDisconnect = (reason) => {
      console.log("❌ Socket Disconnected:", reason);
      setIsSocketConnected(false);
    };

    const onConnectError = (err) => {
      console.error("❌ Socket connect_error:", err.message);
      setSocketError(err.message);

      // ✅ AUTO LOGOUT ON AUTH FAILURE
      if (err.message === "INVALID_TOKEN" || err.message === "AUTH_REQUIRED") {
        console.warn("🚨 Invalid token in socket, logging out...");
        socket.disconnect();
        logout?.(); // ✅ only if you have logout
      }
    };

    const onError = (err) => {
      console.error("❌ General Socket Error:", err);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("error", onError);
    };
  }, [logout]);


  const getStatusById = (userId) => {
    try {
      if (!userId) {
        return getStatusByKey("offline");
      }

      if (!userStatuses || typeof userStatuses !== "object") {
        return getStatusByKey("offline");
      }

      const userStatus = userStatuses[userId];

      if (!userStatus || !userStatus.status) {
        return getStatusByKey("offline");
      }

      return getStatusByKey(userStatus.status) || getStatusByKey("offline");
    } catch (error) {
      console.error("getStatusById error:", error);
      return getStatusByKey("offline");
    }
  };



  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        socketError,
        userStatuses,
        getStatusById
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
