import { Pencil, Phone, User, UserRoundPlus, Users, Video } from "lucide-react";

export default function TopHeader({
  activeChat,
  activeChatLabel,
  isRenaming,
  setIsRenaming,
  isGroupInfo,
  setGroupInfo,
}) {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-2 items-center h-full">
        {activeChat?.type === "direct" ? <User size={22} /> : <Users size={22} />}

        <span className="text-lg font-bold pr-2">{activeChatLabel}</span>

        {activeChat?.type === "group" && (
          <Pencil
            size={16}
            className={`cursor-pointer hover:text-[rgb(var(--color-active))] ${
              isRenaming && "text-[rgb(var(--color-active))]"
            }`}
            onClick={() => setIsRenaming((prev) => !prev)}
          />
        )}
      </div>

      <div className="flex flex-row justify-center items-center gap-4">
        <Phone
          size={18}
          className="cursor-pointer hover:text-[rgb(var(--color-active))]"
        />
        <Video
          size={22}
          className="cursor-pointer hover:text-[rgb(var(--color-active))]"
        />

        <span
          className={`flex flex-row justify-center items-center cursor-pointer hover:text-[rgb(var(--color-active))] ${
            isGroupInfo && "text-[rgb(var(--color-active))]"
          }`}
          onClick={() => setGroupInfo((prev) => !prev)}
        >
          <UserRoundPlus size={20} />
          {activeChat?.type === "group" && (
            <span className="font-bold">{activeChat?.members?.length}</span>
          )}
        </span>
      </div>
    </div>
  );
}
