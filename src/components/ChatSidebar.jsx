import { MessageSquarePlus, User, Users } from "lucide-react";
import { useState } from "react";

export default function ChatSidebar() {
  const chatData = [
    { 
      type: "direct",
      member: "user 1"   // ✅ fixed typo
    },
    { 
      type: "group",
      name: "Our Blue",
      members: [
        "user 2",
        "user 3",
        "user 4",
        "user 5",
      ] 
    },
    { 
      type: "group",
      members: [
        "user A",
        "user B",
        "user C",
        "user D",
        "user E",
        "user F",
      ] 
    },
  ];

  const [chat, setChat] = useState(chatData);

  return (
    <div className="h-full w-60 bg-black flex flex-col">

      {/* Header */}
      <div className="w-full flex flex-row justify-between px-4 py-4 border-b border-gray-800">
        <span className="text-white font-bold text-xl">Chat</span>

        <MessageSquarePlus
          className="text-white cursor-pointer hover:text-purple-400"
          onClick={() => console.log("hello")}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 px-3 py-2 space-y-2">
        {chat && chat.length > 0 ? (
          chat.map((item, index) => {

            // ✅ LABEL LOGIC
            let label = "";

            if (item.type === "direct") {
              label = item.member; // ✅ direct → member name
            } 
            else if (item.type === "group") {
              if (item.name) {
                label = item.name; // ✅ group with name
              } else if (item.members?.length) {
                const first = item.members[0];
                const extra = item.members.length - 1;
                label = extra > 0 ? `${first} +${extra}` : first;
              } else {
                label = "Unnamed Group";
              }
            }

            return (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-600/20 cursor-pointer"
              >
                {/* Icon */}
                {item.type === "direct" ? (
                  <User className="text-white" size={18} />
                ) : (
                  <Users className="text-white" size={18} />
                )}

                {/* Label */}
                <span className="text-white text-sm truncate">
                  {label}
                </span>
              </div>
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
