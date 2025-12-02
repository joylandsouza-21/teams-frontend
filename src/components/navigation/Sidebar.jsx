import { NavLink } from "react-router-dom";
import { MessageCircleMore, Phone } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-[60px] bg-(--color-primary-background) flex flex-col gap-4 py-4 border-r border-(--border-primary-color)">

      {/* ✅ CHAT */}
      <NavLink
        to="/chats"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 p-2 relative transition
           border-l-2 
           ${
             isActive
               ? "border-[rgb(var(--color-active))] text-[rgb(var(--color-active))]"
               : "border-transparent hover:text-[rgb(var(--color-active))]"
           }`
        }
      >
        {({ isActive }) => (
          <>
            <MessageCircleMore
              size={20}
              className={
                isActive
                  ? "text-[rgb(var(--color-active))]"
                  : ""
              }
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
               ? "border-[rgb(var(--color-active))] text-[rgb(var(--color-active))]"
               : "border-transparent hover:text-[rgb(var(--color-active))]"
           }`
        }
      >
        {({ isActive }) => (
          <>
            <Phone
              size={20}
              className={
                isActive
                  ? "text-[rgb(var(--color-active))]"
                  : ""
              }
            />
            <span className="text-[10px] leading-none">Calls</span>
          </>
        )}
      </NavLink>

    </div>
  );
}
