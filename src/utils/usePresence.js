import { useEffect } from "react";
import { useSocket } from "../store/socket.context";

export default function usePresence() {
  const { socket } = useSocket();

  useEffect(() => {
    const sendActive = () => {
      socket.emit("user_active");
    };

    window.addEventListener("mousemove", sendActive);
    window.addEventListener("keydown", sendActive);

    return () => {
      window.removeEventListener("mousemove", sendActive);
      window.removeEventListener("keydown", sendActive);
    };
  }, [socket]);
}
