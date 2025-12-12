import { LogOut, Trash, User, UserMinus, UserRoundPlus } from "lucide-react";
import AddPeopleDropdown from "./AddPeopleDropdown";
import { useSocket } from "../../../../store/socket.context";
import { removeMemberFromGroupChatApi } from "../../../../api/conversation.api";
import { useAuth } from "../../../../store/auth.context";
import { toastError } from "../../../../utils/toast";

export default function MemberInfoModal({
    groupInfoRef,
    addPeopleRef,
    isAddPeople,
    setIsAddPeople,
    users,
    activeChat,
    currentUserId,
    selectedUsers,
    setSelectedUsers,
    search,
    setSearch,
    handleAddNewUsers,
}) {
    const { auth } = useAuth();
    const { getStatusById } = useSocket();

    const currentUserRole = activeChat?.members?.find(m => m.id === currentUserId)?.role || "member"

    const handleLeaveGroup = async () => {
        try {
            const res = await removeMemberFromGroupChatApi({
                token: auth.token,
                conversationId: activeChat?.id,
                memberId: currentUserId
            });

            if (res?.status !== 200) {
                toastError(res?.data?.message || "Failed to leave group");
                return;
            }

        } catch (error) {
            console.error("Leave group error:", error);

            toastError(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while leaving the group"
            );
        }
    };

    const handleRemoveUser = async (memberId) => {
        try {
            const res = await removeMemberFromGroupChatApi({
                token: auth.token,
                conversationId: activeChat?.id,
                memberId: memberId
            });

            if (res?.status !== 200) {
                toastError(res?.data?.message || "Failed to remove user");
                return;
            }

        } catch (error) {
            console.error("Remove user from group error:", error);

            toastError(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while removing the user from group"
            );
        }
    }


    return (
        <div
            ref={groupInfoRef}
            className="absolute top-[62px] right-2 z-50 p-4 flex flex-col gap-2 bg-(--color-ter-background) w-50 rounded-xl"
        >
            <span className="text-xs font-bold opacity-50">
                People ({activeChat?.members?.length || 0})
            </span>

            <div className="flex flex-col gap-2">
                {activeChat?.members?.map((item, index) => (
                    <div className="flex flex-row items-center justify-between">
                        <div key={index} className="flex flex-row gap-2 items-center relative">
                            {
                                item?.profile_pic ?
                                    (<img
                                        src={`${import.meta.env.VITE_API_BASE_URL}${item.profile_pic}`}
                                        alt="user"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />)
                                    :
                                    (
                                        <div className="bg-(--color-sec-background) p-2 rounded-full">
                                            <User size={18} />
                                        </div>
                                    )
                            }
                            <div className="absolute -bottom-1 left-5 bg-[#1f1f1f] rounded-full">
                                {getStatusById(item?.id)?.icon({ size: 11 })}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm">{item?.name}</span>
                                <span className="text-xs opacity-50">{item?.role}</span>
                            </div>
                        </div>
                        {
                            (currentUserRole === 'admin' && currentUserId !== item.id) &&
                            <UserMinus size={18} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveUser(item.id)} />
                        }
                    </div>
                ))}
            </div>

            {/* Add People Row */}
            {
                (currentUserRole === 'admin' || activeChat?.type === 'direct') &&
                <div className="relative">
                    <div
                        className={`flex flex-row items-center mt-2 gap-2 border-t border-black p-2 cursor-pointer hover:text-[rgb(var(--color-active))]  ${isAddPeople && "text-[rgb(var(--color-active))]"
                            }`}
                        onClick={() => setIsAddPeople((prev) => !prev)}
                    >
                        <UserRoundPlus size={22} />
                        <div>Add People</div>
                    </div>

                    {/* Add People Search Dropdown */}
                    {isAddPeople && (
                        <AddPeopleDropdown
                            addPeopleRef={addPeopleRef}
                            users={users}
                            activeChat={activeChat}
                            currentUserId={currentUserId}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                            search={search}
                            setSearch={setSearch}
                            setIsAddPeople={setIsAddPeople}
                            handleAddNewUsers={handleAddNewUsers}
                        />
                    )}
                </div>
            }
            {
                activeChat?.type === "group" &&
                <div
                    className={`flex flex-row items-center ${!currentUserRole === 'admin' && "mt-2"} gap-2 border-t border-black p-2 cursor-pointer hover:text-red-600 `}
                    onClick={handleLeaveGroup}
                >
                    <LogOut size={18} />
                    <div>Leave Group</div>
                </div>
            }
        </div>
    );
}
