import { useEffect, useRef } from "react";
import { useSocket } from "../store/socket.context";

export function useDirectChatPresenceBulk(chats, currentUserId) {
  const { socket } = useSocket();
  const prevIdsRef = useRef([]);

  useEffect(() => {
    if (!socket || !chats?.length) return;

    const directUserIds = chats
      .filter(c => c.type === "direct")
      .map(c => c.members.find(m => m.id !== currentUserId)?.id)
      .filter(Boolean);

    const prev = prevIdsRef.current.join(",");
    const curr = directUserIds.join(",");

    if (curr !== prev && directUserIds.length > 0) {
      socket.emit("subscribe_presence_bulk", {
        userIds: directUserIds
      });

      prevIdsRef.current = directUserIds;
    }

  }, [socket, chats, currentUserId]);
}
