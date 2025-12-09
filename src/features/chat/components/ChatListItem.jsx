import { User, Users } from "lucide-react";
import { useSocket } from "../../../store/socket.context";
import { getStatusByKey } from "../../../utils/statusConfig";

export default function ChatListItem({
  item,
  label,
  isActive,
  currentUserId,
  onClick,
  unreadCount
}) {
  const { userStatuses } = useSocket();

  const userProfile =
    item?.type === "direct"
      ? item?.members?.find(
        (member) => Number(member.id) !== Number(currentUserId)
      )
      : null;

  const userStatus = userStatuses?.[Number(userProfile?.id)] || null;

  const status = getStatusByKey(userStatus?.status || "offline");

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer justify-between
        transition-all
        ${isActive
          ? "bg-[rgb(var(--color-active)/0.7)]"
          : "hover:bg-[rgb(var(--color-active)/0.2)] text-gray-300"
        }
      `}
    >
      <div className="flex flex-row gap-2 items-center">
        {/* ✅ Icon */}
        {item?.type === "direct" ? (
          <div className="relative">
            {
              userProfile?.profile_pic ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${userProfile.profile_pic}`}
                  alt="user"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="bg-(--color-ter-background) p-2 rounded-full">
                  <User
                    className={isActive ? "" : "text-gray-300 "}
                    size={18}
                  />
                </div>
              )
            }
            <div className="absolute -bottom-1 left-5 bg-[#1f1f1f] rounded-full">
              {status?.icon({ size: 11 })}
            </div>
          </div>
        ) : (
          <div className="bg-(--color-ter-background) p-2 rounded-full">
            <Users
              className={isActive ? "" : "text-gray-300"}
              size={18}
            />
          </div>
        )}

        {/* ✅ Label */}
        <span className="text-sm truncate">{label}</span>
      </div>

      {/* ✅ Unread Badge */}
      {unreadCount > 0 && (
        <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          {unreadCount}
        </div>
      )}
    </div>
  );
}
