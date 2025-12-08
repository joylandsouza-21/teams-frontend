import { useEffect } from "react";
import { useSocket } from "../store/socket.context";

export function useGroupPresence(conversationId) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !conversationId) return;

    // ✅ Subscribe when chat opens
    socket.emit("subscribe_group_presence", { conversationId });

    // ✅ Unsubscribe when chat closes / changes
    return () => {
      socket.emit("unsubscribe_group_presence", { conversationId });
    };

  }, [socket, conversationId]);
}
