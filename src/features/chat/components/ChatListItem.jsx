import { User, Users } from "lucide-react";

export default function ChatListItem({
  item,
  label,
  isActive,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer
        transition-all
        ${isActive
            ? "bg-[rgb(var(--color-active)/0.7)] "
            : "hover:bg-[rgb(var(--color-active)/0.2)] text-gray-300"
        }
      `}
    >
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
  );
}
