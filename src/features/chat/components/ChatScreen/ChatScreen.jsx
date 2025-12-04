import { useState, useRef, useEffect } from "react";
import MessageInput from "./MessageInput";
import { addmembersToGroupChatApi, convertToGroupChatApi, updateConversationApi } from "../../../../api/conversation.api";
import { useAuth } from "../../../../store/auth.context";

import TopHeader from "./TopHeader";
import RenameGroupForm from "./RenameGroupForm";
import MemberInfoModal from "./MemberInfoModal";
import NewChatTopHeader from "./NewChatTopHeader";
import MessageBox from "./MessageBox";

export default function ChatScreen({
  chats,
  users,
  setChats,
  activeChat,
  setActiveChat,
  activeChatLabel,
  addNewChat,
  setAddNewChat,
  newChatDetails,
  setNewChatDetails,
  currentUserId,
  fetchAllConversations
}) {
  const { auth } = useAuth();

  const [isRenaming, setIsRenaming] = useState(false);
  const [isGroupInfo, setGroupInfo] = useState(false);
  const [isAddPeople, setIsAddPeople] = useState(false);
  const [newName, setNewName] = useState(activeChatLabel || "");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newChatmemberSearch, setNewChatmemberSearch] = useState('');
  const [newChatMembers, setNewChatMembers] = useState([]);

  const renameRef = useRef(null);
  const groupInfoRef = useRef(null);
  const addPeopleRef = useRef(null);
  const newCHatInputRef = useRef(null);

  useEffect(() => {
    if (!newChatMembers?.length) return;

    const matchedChat = chats.find(chat => {
      if (!chat.members) return false;

      const chatMemberIds = chat.members.map(m => Number(m.id));
      const requiredIds = [
        Number(currentUserId),
        ...newChatMembers.map(m => Number(m.id)),
      ];

      if (chatMemberIds.length !== requiredIds.length) return false;
      return requiredIds.every(id => chatMemberIds.includes(id));
    });

    if (matchedChat) {
      setActiveChat(matchedChat);
      setNewChatDetails(null);
    } else {
      const chatData = {
        id: null,
        type: newChatMembers.length > 1 ? "group" : "direct",
        label: null,
        members: newChatMembers
      };
      setNewChatDetails({ ...chatData });
      setActiveChat({ ...chatData });
    }

  }, [newChatMembers?.length]);

  useEffect(() => {
    setNewName(activeChatLabel || "");
  }, [activeChatLabel]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (renameRef.current && !renameRef.current.contains(event.target)) setIsRenaming(false);
      if (groupInfoRef.current && !groupInfoRef.current.contains(event.target)) setGroupInfo(false);
      if (addPeopleRef.current && !addPeopleRef.current.contains(event.target)) setIsAddPeople(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    newCHatInputRef.current?.focus();
  }, [addNewChat]);

  const handleGroupNameUpdate = async () => {
    const res = await updateConversationApi({
      token: auth?.token,
      conversationId: activeChat?.id,
      body: { name: newName }
    });
    if (res?.status === 200) fetchAllConversations();
  };

  const handleAddNewUsers = async () => {
    if (activeChat.type === 'direct') {
      await convertToGroupChatApi({
        token: auth?.token,
        conversationId: activeChat?.id,
        body: { newMembers: selectedUsers.map(m => m.id) }
      });
    } else {
      await addmembersToGroupChatApi({
        token: auth?.token,
        conversationId: activeChat?.id,
        body: { members: selectedUsers.map(m => m.id) }
      });
    }
    fetchAllConversations();
  };

  return (
    <div className="p-2 w-full h-full">
      <div className="h-full w-full bg-(--color-sec-background) rounded-2xl overflow-hidden">

        <div className={`bg-(--color-ter-background) w-full px-4 py-4 relative ${addNewChat && 'border-b-2 border-[rgb(var(--color-active))]'}`}>
          {addNewChat ? (
            <NewChatTopHeader
              users={users}
              currentUserId={currentUserId}
              newChatMembers={newChatMembers}
              setNewChatMembers={setNewChatMembers}
              newChatmemberSearch={newChatmemberSearch}
              setNewChatmemberSearch={setNewChatmemberSearch}
              newCHatInputRef={newCHatInputRef}
            />
          ) : (
            <>
              <TopHeader {...{ activeChat, activeChatLabel, isRenaming, setIsRenaming, isGroupInfo, setGroupInfo }} />
              {isRenaming && (
                <RenameGroupForm {...{ renameRef, newName, setNewName, handleGroupNameUpdate, setIsRenaming, activeChat, fetchAllConversations }} />
              )}
              {isGroupInfo && (
                <MemberInfoModal
                  {...{
                    groupInfoRef,
                    addPeopleRef,
                    isAddPeople,
                    setIsAddPeople,
                    users,
                    activeChat,
                    currentUserId,
                    selectedUsers,
                    setSelectedUsers,
                    search,
                    setSearch,
                    handleAddNewUsers
                  }}
                />
              )}
            </>
          )}
        </div>

        <MessageBox 
          activeChat={activeChat} 
          currentUserId={currentUserId}
        />
        <MessageInput
          setChats={setChats}
          newChatDetails={newChatDetails}
          setAddNewChat={setAddNewChat}
          setNewChatDetails={setNewChatDetails}
          fetchAllConversations={fetchAllConversations}
          activeChat={activeChat}
          setNewChatMembers={setNewChatMembers}
        />
      </div>
    </div>
  );
}
