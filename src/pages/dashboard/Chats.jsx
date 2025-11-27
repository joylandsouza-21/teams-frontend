import ChatSidebar from "../../components/ChatSidebar";
import MainSidebar from "../../components/Sidebar";

export default function Chats() {
  return (
    <div className="flex h-full">

      <ChatSidebar />

      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-xl text-gray-500">
          Select a chat to start messaging
        </h2>
      </div>
    </div>
  );
}
