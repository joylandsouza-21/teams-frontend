import { NavLink } from "react-router-dom";
import { MessageCircleMore, Phone } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-[60px] bg-black text-white flex flex-col gap-4 py-4 border-r border-gray-800">

      {/* ✅ CHAT */}
      <NavLink
        to="/chats"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 p-2 relative transition
           border-l-2 
           ${
             isActive
               ? "border-purple-500 text-purple-400"
               : "border-transparent hover:text-purple-400"
           }`
        }
      >
        {({ isActive }) => (
          <>
            <MessageCircleMore
              size={20}
              className={isActive ? "stroke-purple-500" : ""}
            />
            <span className="text-[10px] leading-none">Chat</span>
          </>
        )}
      </NavLink>

      {/* ✅ CALLS */}
      <NavLink
        to="/calls"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 p-2 relative transition
           border-l-2 
           ${
             isActive
               ? "border-purple-500 text-purple-400"
               : "border-transparent hover:text-purple-400"
           }`
        }
      >
        {({ isActive }) => (
          <>
            <Phone
              size={20}
              className={isActive ? "stroke-purple-500" : ""}
            />
            <span className="text-[10px] leading-none">Calls</span>
          </>
        )}
      </NavLink>

    </div>
  );
}
