import { useEffect, useState } from "react";
import ChatScreen from "../../features/chat/components/ChatScreen";
import ChatSidebar from "../../features/chat/components/ChatSidebar";
import { generateChatLable } from "../../features/chat/utils/ChatListUtils";
import { useAuth } from "../../store/auth.context";
import { getAllUsers } from "../../api/user.api";
import { getConversationsApi } from "../../api/conversation.api";

export default function Chats() {
  const { auth } = useAuth();

  const currentUserId = auth?.user?.id;

  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatLabel, setActiveChatLabel] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false)
  const [newChatDetails, setNewChatDetails] = useState(null)

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
      setActiveChat(null);
      setActiveChatLabel(null)
      return;
    }

    if (activeChat) {
      if (!chats.includes(activeChat)) {
        const newActiveChat = chats.find(item => item.type === activeChat.type && areSameMembers(item.members, activeChat.members, currentUserId))
        if (newActiveChat) {
          setActiveChat(newActiveChat)
          setActiveChatLabel(generateChatLable(newActiveChat, currentUserId))
          return
        }
      }
    }
    setActiveChat(chats?.[0])
    setActiveChatLabel(generateChatLable(chats?.[0], currentUserId))
  }, [chats])

  console.log(chats)

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
