import { Camera, Pencil, Phone, User, UserRoundPlus, Users, Video } from "lucide-react";
import { useState } from "react";
import GroupProfileEditModal from "./GroupProfileEditModal";
import { startCallApi } from "../../../../api/call.api";
import { toastError } from "../../../../utils/toast";
import { useAuth } from "../../../../store/auth.context";

export default function TopHeader({
  activeChat,
  activeChatLabel,
  isRenaming,
  setIsRenaming,
  isGroupInfo,
  setGroupInfo,
  currentUserId
}) {
  const { auth } = useAuth();

  const [openChangeGroupPhotoModal, setOpenChangeGroupPhotoModal] = useState(false);

  const userProfile =
    activeChat?.type === "direct"
      ? activeChat?.members?.find(
        (member) => Number(member.id) !== Number(currentUserId)
      )
      : null;

  const handleAudioCallClick = async () => {
    try {
      const res = await startCallApi({
        token: auth?.token,
        body: {
          conversationId: activeChat?.id,
          type: "audio"
        }
      });

      const { callId } = res?.data || res;

      window.open(`/call/${callId}`, "_blank"); // new tab

    } catch (error) {
      toastError("Unable to start call");
    }
  };


  const handleVideoCallClick = async () => {
    try {
      const res = await startCallApi({
        token: auth?.token,
        body: {
          conversationId: activeChat?.id,
          type: "video",
        }
      });

      const { callId } = res?.data || res;

      // ✅ Redirect
      window.open(`/call/${callId}`, "_blank");
      // OR:
      // navigate(`/call/${callId}`);

    } catch {
      toastError("Unable to start call");
    }
  };


  const currentUserRole = activeChat?.members?.find(m => m.id === currentUserId)?.role || "member"

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-2 items-center h-full">
        {activeChat?.type === "direct" ? (
          <div>
            {
              userProfile?.profile_pic ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${userProfile.profile_pic}`}
                  alt="user"
                  className="w-9.5 h-9.5 rounded-full object-cover"
                />
              ) : (
                <div className="bg-(--color-sec-background) p-2 rounded-full">
                  <User
                    size={22}
                  />
                </div>
              )
            }
          </div>
        ) : (
          <div className="relative group">
            {
              activeChat?.image ?
                (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${activeChat?.image}`}
                    alt="user"
                    className="w-9.5 h-9.5 rounded-full object-cover"
                  />
                )
                :
                (
                  <div className="bg-(--color-sec-background) p-2 rounded-full">
                    <Users
                      size={22}
                    />
                  </div>
                )
            }
            {
              (activeChat?.type === "group" && currentUserRole === 'admin') && (
                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-(--color-sec-background) cursor-pointer rounded-full">
                  <Camera size={18} className="text-white" onClick={() => setOpenChangeGroupPhotoModal(true)} />
                </div>
              )
            }
            {openChangeGroupPhotoModal && <GroupProfileEditModal onClose={() => setOpenChangeGroupPhotoModal(false)} groupPhoto={activeChat?.image} activeChat={activeChat} />}
          </div>
        )}

        <span className="text-lg font-bold pr-2">{activeChatLabel}</span>

        {
          (activeChat?.type === "group" && currentUserRole === 'admin') && (
            <Pencil
              size={16}
              className={`cursor-pointer hover:text-[rgb(var(--color-active))] ${isRenaming && "text-[rgb(var(--color-active))]"
                }`}
              onClick={() => setIsRenaming((prev) => !prev)}
            />
          )
        }
      </div>

      <div className="flex flex-row justify-center items-center gap-4">
        <Phone
          size={18}
          className="cursor-pointer hover:text-[rgb(var(--color-active))]"
          onClick={handleAudioCallClick}
        />
        <Video
          size={22}
          className="cursor-pointer hover:text-[rgb(var(--color-active))]"
          onClick={handleVideoCallClick}
        />

        <span
          className={`flex flex-row justify-center items-center cursor-pointer hover:text-[rgb(var(--color-active))] ${isGroupInfo && "text-[rgb(var(--color-active))]"
            }`}
          onClick={() => setGroupInfo(prev => !prev)}
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
