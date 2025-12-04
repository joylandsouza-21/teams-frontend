import { User, UserRoundPlus } from "lucide-react";
import AddPeopleDropdown from "./AddPeopleDropdown";

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
    return (
        <div
            ref={groupInfoRef}
            className="absolute top-[63px] right-1 z-50 p-4 flex flex-col gap-2 bg-(--color-ter-background) w-50 rounded-xl"
        >
            <span className="text-xs font-bold">
                People ({activeChat?.members?.length || 0})
            </span>

            <div className="flex flex-col gap-2">
                {activeChat?.members?.map((item, index) => (
                    <div key={index} className="flex flex-row gap-2">
                        <User />
                        <span>{item?.name}</span>
                    </div>
                ))}
            </div>

            {/* Add People Row */}
            <div className="relative">
                <div
                    className={`flex flex-row gap-2 border-t border-black p-2 cursor-pointer hover:text-[rgb(var(--color-active))]  ${isAddPeople && "text-[rgb(var(--color-active))]"
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
        </div>
    );
}
