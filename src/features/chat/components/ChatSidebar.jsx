import { MessageSquarePlus } from "lucide-react";
import { useEffect } from "react";
import ChatListItem from "./ChatListItem";
import { generateChatLable } from "../utils/ChatListUtils";

export default function ChatSidebar({
  chats,
  activeChat,
  setActiveChat,
  activeChatLabel,
  setActiveChatLabel,
  addNewChat,
  setAddNewChat,
  newChatDetails,
  setNewChatDetails,
  currentUserId,
  unreadCounts

}) {

  useEffect(() => {
    if (!activeChatLabel && activeChat) {
      setActiveChatLabel(generateChatLable(activeChat, currentUserId))
    }
  }, [])

  const handleNewChat = () => {
    setAddNewChat(prev => !prev)
  }

  return (
    <div className="h-full w-60 bg-(--color-primary-background) flex flex-col">

      {/* Header */}
      <div className="w-full flex flex-row justify-between px-4 py-4 border-b border-(--border-primary-color)">
        <span className="font-bold text-xl">Chat</span>

        <MessageSquarePlus
          className={`cursor-pointer hover:text-[rgb(var(--color-active))] ${addNewChat && 'text-[rgb(var(--color-active))]'}`}
          onClick={handleNewChat}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 px-3 py-2 space-y-2 max-h-full overflow-auto">
        {
          newChatDetails &&
          <ChatListItem
            key={newChatDetails.id}
            item={newChatDetails}
            label={newChatDetails?.label || 'New Chat'}
            isActive={activeChat?.id === newChatDetails.id}
            onClick={() => {
              setActiveChat(newChatDetails)
              setActiveChatLabel(newChatDetails?.label || 'New Chat')
            }}
          />
        }
        {chats && chats.length > 0 ? (
          chats.map((item) => {

            const label = generateChatLable(item, currentUserId)

            const isActive = activeChat?.id === item.id;
            
            return (
              <ChatListItem
                key={item.id}
                item={item}
                label={label}
                isActive={isActive}
                unreadCount={unreadCounts[item.id]}
                onClick={() => {
                  setActiveChat(item)
                  setActiveChatLabel(label)
                  if (addNewChat) {
                    setAddNewChat(false)
                    setNewChatDetails(null)
                  }
                }}
              />
            );
          })
        ) : (
          <div className="h-full text-gray-400 flex justify-center items-center">
            No Chats
          </div>
        )}
      </div>
    </div>
  );
}
