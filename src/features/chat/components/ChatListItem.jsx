import { User, Users } from "lucide-react";

export default function ChatListItem({
  item,
  label,
  isActive,
  onClick,
  unreadCount
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer justify-between
        transition-all
        ${isActive
            ? "bg-[rgb(var(--color-active)/0.7)] "
            : "hover:bg-[rgb(var(--color-active)/0.2)] text-gray-300"
        }
      `}
    >
      <div className="flex flex-row gap-2 items-center">
        {/* Icon */}
        {item.type === "direct" ? (
          <User className={isActive ? "" : "text-gray-300"} size={18} />
        ) : (
          <Users className={isActive ? "" : "text-gray-300"} size={18} />
        )}

        {/* Label */}
        <span className="text-sm truncate">
          {label}
        </span>
      </div>

      {unreadCount > 0 && (
        <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          {unreadCount}
        </div>
      )}
    </div>
  );
}
