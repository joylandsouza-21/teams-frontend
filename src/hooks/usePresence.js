import { useEffect } from "react";
import { useSocket } from "../store/socket.context";

export default function usePresence() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const sendActive = () => {
      socket.emit("user_active");
    };

    window.addEventListener("mousemove", sendActive);
    window.addEventListener("keydown", sendActive);
    window.addEventListener("click", sendActive);

    return () => {
      window.removeEventListener("mousemove", sendActive);
      window.removeEventListener("keydown", sendActive);
      window.removeEventListener("click", sendActive);
    };
  }, [socket]);
}
