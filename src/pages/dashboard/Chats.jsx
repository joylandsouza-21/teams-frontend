import { useEffect, useEffectEvent, useState } from "react";
import ChatScreen from "../../features/chat/components/ChatScreen/ChatScreen";
import ChatSidebar from "../../features/chat/components/ChatSidebar";
import { generateChatLable } from "../../features/chat/utils/ChatListUtils";
import { useAuth } from "../../store/auth.context";
import { getAllUsers } from "../../api/user.api";
import { getConversationsApi } from "../../api/conversation.api";
import { useSocket } from "../../store/socket.context";
import { useDirectChatPresenceBulk } from "../../hooks/useDirectChatPresenceBulk";

export default function Chats() {
  const { auth } = useAuth();
  const { socket } = useSocket();

  const currentUserId = auth?.user?.id;

  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatLabel, setActiveChatLabel] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false);
  const [newChatDetails, setNewChatDetails] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  useDirectChatPresenceBulk(chats, currentUserId);

  useEffect(() => {
    if (!newChatDetails?.members) return;

    const membersCount = newChatDetails.members.length;

    let updatedType = "direct";
    let updatedLabel = "";

    if (membersCount > 1) {
      updatedType = "group";
      updatedLabel = generateChatLable({
        ...newChatDetails,
        type: "group",
      }, currentUserId);
    } else if (membersCount === 1) {
      updatedType = "direct";
      updatedLabel = newChatDetails.members[0]?.name || "";
    }

    setNewChatDetails(prev => ({
      ...prev,
      type: updatedType,
      label: updatedLabel,
    }));

  }, [newChatDetails?.members?.length]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers({ token: auth.token });

      setUsers(res?.data || []);

    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchAllConversations = async () => {
    try {
      const res = await getConversationsApi({ token: auth.token });

      setChats(res?.data || []);

    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const areSameMembers = (a = [], b = [], currentUserId) => {
    const aIds = a
      .filter(m => m?.id && m.id !== currentUserId)
      .map(m => m.id)
      .sort();

    const bIds = b
      .filter(m => m?.id && m.id !== currentUserId)
      .map(m => m.id)
      .sort();
    if (aIds.length !== bIds.length) return false;

    return aIds.every((id, index) => id === bIds[index]);
  };

  useEffect(() => {
    if (!auth?.token) return;
    fetchUsers();
    fetchAllConversations();
  }, [auth?.token]);

  useEffect(() => {
    if (!chats?.length) {
      return;
    }

    if (activeChat) {
      if (!chats.some(chat => chat.id === activeChat?.id)) {
        const newActiveChat = chats.find(item => item.type === activeChat.type && areSameMembers(item.members, activeChat.members, currentUserId))
        if (newActiveChat) {
          setActiveChat(newActiveChat)
          return
        }
      }
    } else {
      setActiveChat(chats?.[0])
    }
  }, [chats, activeChat?.id, currentUserId])

  useEffect(() => {
    if (!activeChat) return
    setActiveChatLabel(generateChatLable(activeChat, currentUserId))
  }, [activeChat, currentUserId])

  useEffect(() => {
    if (!socket) return;

    const onNewBackgroundMessage = ({
      conversationId,
      messageId,
      senderId
    }) => {
      if (conversationId !== activeChat?.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || 0) + 1
        }));
      }
    }

    const onChatUpdate = ({ chat }) => {
      setChats(prevChats => {
        if (!Array.isArray(prevChats)) {
          // ✅ Also sync active chat safely
          setActiveChat(prev =>
            prev?.id === chat.id ? chat : prev
          );
          return [chat];
        }

        const index = prevChats.findIndex(c => c.id === chat.id);

        // ✅ If chat already exists → update it
        if (index !== -1) {
          const updated = [...prevChats];
          const mergedChat = { ...prevChats[index], ...chat };
          updated[index] = mergedChat;

          // ✅ Sync active chat using the merged object (not raw payload)
          setActiveChat(prev =>
            prev?.id === chat.id ? mergedChat : prev
          );

          return updated;
        }

        // ✅ If it's a new chat → add it to the top
        return [chat, ...prevChats];
      });
    };

    socket.on("chat_update", onChatUpdate);
    socket.on("background_message", onNewBackgroundMessage);

    return () => {
      socket.off("chat_update", onChatUpdate);
      socket.off("background_message", onNewBackgroundMessage);
    };
  }, [socket, activeChat?.id, fetchAllConversations]);

  useEffect(() => {
    if (!activeChat?.id) return;

    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[activeChat.id];
      return updated;
    });
  }, [activeChat?.id]);

  useEffect(() => {
    if (!Array.isArray(chats)) return;

    const initialUnread = {};

    chats.forEach(chat => {
      if (chat.unreadCount > 0) {
        initialUnread[chat.id] = chat.unreadCount;
      }
    });

    setUnreadCounts(initialUnread);
  }, [chats]);

  return (
    <div className="h-full w-full flex flex-row">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        activeChatLabel={activeChatLabel}
        setActiveChatLabel={setActiveChatLabel}
        addNewChat={addNewChat}
        setAddNewChat={setAddNewChat}
        newChatDetails={newChatDetails}
        setNewChatDetails={setNewChatDetails}
        currentUserId={currentUserId}
        unreadCounts={unreadCounts}
      />
      <ChatScreen
        chats={chats}
        users={users}
        setChats={setChats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        activeChatLabel={activeChatLabel}
        addNewChat={addNewChat}
        setAddNewChat={setAddNewChat}
        newChatDetails={newChatDetails}
        setNewChatDetails={setNewChatDetails}
        currentUserId={currentUserId}
        fetchAllConversations={fetchAllConversations}
      />
    </div>
  );
}
