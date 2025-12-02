import {
    Pencil,
    Phone,
    User,
    UserRoundPlus,
    Users,
    Video,
    X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import MessageInput from "./MessageInput";
import ChatMessages from "./ChatMessages";
import { DummyMessageData } from "./dummyMessageData";
import { addmembersToGroupChatApi, convertToGroupChatApi, updateConversationApi } from "../../../api/conversation.api";
import { useAuth } from "../../../store/auth.context";

export default function ChatScreen({
    chats,
    users,
    setChats,
    activeChat,
    setActiveChat,
    activeChatLabel,
    addNewChat,
    setAddNewChat,
    newChatDetails,
    setNewChatDetails,
    currentUserId,
    fetchAllConversations
}) {
    const { auth } = useAuth();

    const [isRenaming, setIsRenaming] = useState(false);
    const [isGroupInfo, setGroupInfo] = useState(false);
    const [isAddPeople, setIsAddPeople] = useState(false);
    const [newName, setNewName] = useState(activeChatLabel || "");
    const [search, setSearch] = useState("");

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [newChatmemberSearch, setNewChatmemberSearch] = useState('');
    const [newChatMembers, setNewChatMembers] = useState([]);

    useEffect(() => {
        if (!newChatMembers?.length) return

        const matchedChat = chats.find(chat => {
            if (!chat.members) return false;

            const chatMemberIds = chat.members.map(m => Number(m.id));
            const requiredIds = [
                Number(currentUserId),
                ...newChatMembers.map(m => Number(m.id)),
            ];

            // ✅ Condition 1: Same number of members
            if (chatMemberIds.length !== requiredIds.length) return false;
            // ✅ Condition 2: Every required user exists in the chat
            return requiredIds.every(id => chatMemberIds.includes(id));
        });

        if (matchedChat) {
            setActiveChat(matchedChat)
            setNewChatDetails(null)
        } else {
            const chatData = {
                id: 1111111111,
                type: newChatMembers.length > 1 ? "group" : "direct",
                label: null,
                members: newChatMembers
            }
            setNewChatDetails({ ...chatData })
            setActiveChat({ ...chatData })
        }

    }, [newChatMembers?.length])

    const renameRef = useRef(null);
    const groupInfoRef = useRef(null);
    const addPeopleRef = useRef(null);
    const newCHatInputRef = useRef(null);

    useEffect(() => {
        setNewName(activeChatLabel || "");
    }, [activeChatLabel]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (renameRef.current && !renameRef.current.contains(event.target)) {
                setIsRenaming(false);
            }

            if (groupInfoRef.current && !groupInfoRef.current.contains(event.target)) {
                setGroupInfo(false);
            }

            if (addPeopleRef.current && !addPeopleRef.current.contains(event.target)) {
                setIsAddPeople(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        newCHatInputRef.current?.focus();
    }, [addNewChat])

    const handleGroupNameUpdate = async () => {
        console.log( auth?.token)
        const res = await updateConversationApi({ token: auth?.token, conversationId: activeChat?.id, body: {name: newName}})
        if (res?.status === 200 ){
            console.log('Group name Updated successfully')
            fetchAllConversations()
        }
    }

    const handleRenameSubmit = (e) => {
        e.preventDefault();
        handleGroupNameUpdate()
        setIsRenaming(false);
        setNewName("")
    };

    const handleAddNewChatMembers = (item) => {
        setNewChatmemberSearch('')
        setNewChatMembers(prev => [...prev, item])

        // setNewChatDetails(prev => ({
        //     ...prev,
        //     members: [...prev.members, item]
        // }))
    }

    function TopHeader() {
        return (
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center h-full">
                    {activeChat?.type === "direct" ? <User size={22} /> : <Users size={22} />}

                    <span className="text-lg font-bold pr-2">{activeChatLabel}</span>

                    {activeChat?.type === "group" && (
                        <Pencil
                            size={16}
                            className={`cursor-pointer hover:text-[rgb(var(--color-active))] ${isRenaming && 'text-[rgb(var(--color-active))]'}`}
                            onClick={() => setIsRenaming((prev) => !prev)}
                        />
                    )}
                </div>

                <div className="flex flex-row justify-center items-center gap-4">
                    <Phone size={18} className="cursor-pointer hover:text-[rgb(var(--color-active))]" />
                    <Video size={22} className="cursor-pointer hover:text-[rgb(var(--color-active))]" />

                    <span
                        className={`flex flex-row justify-center items-center cursor-pointer hover:text-[rgb(var(--color-active))] ${isGroupInfo && "text-[rgb(var(--color-active))]"
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

    function RenameGroupForm() {
        return (
            <div
                ref={renameRef}
                onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(e)}
                className="px-4 py-3 flex gap-2 items-center absolute top-16 left-1 rounded-xl z-50 bg-(--color-ter-background)"
            >
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-transparent border border-gray-500 px-3 py-1 rounded text-sm w-60 outline-none"
                    placeholder="Enter new group name"
                    autoFocus
                />

                <button
                    onClick={handleRenameSubmit}
                    className="bg-[rgb(var(--color-active)/0.7)] text-white px-3 py-1 rounded text-sm hover:bg-[rgb(var(--color-active)/0.4)] cursor-pointer"
                >
                    Save
                </button>

                <button
                    onClick={() => setIsRenaming(false)}
                    className="text-gray-400 text-sm cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        );
    }

    const handleAddNewUsers = async () => {
        if (activeChat.type === 'direct') {
            const res = await convertToGroupChatApi({ token: auth?.token, conversationId: activeChat?.id, body: { newMembers: selectedUsers.map((m) => m.id) } })
            if (res?.status === 200) {
                console.log('Converted to group chat successfully!')
                await fetchAllConversations()
            }
        } else {
            const res = await addmembersToGroupChatApi(({ token: auth?.token, conversationId: activeChat?.id, body: { members: selectedUsers.map((m) => m.id) } }))
            if (res?.status === 200) {
                console.log('New members Added to group chat successfully!')
                await fetchAllConversations()
            }
        }
    }

    // 🔹 MOVE AddPeopleDropdown TO PARENT LEVEL
    function AddPeopleDropdown() {
        const activeChatUserIds = activeChat.members.map(m=>m.id)
        const allUsers = users.filter((item) => item.id !== currentUserId && !activeChatUserIds.includes(item.id) && !selectedUsers.includes(item))

        const filteredUsers = allUsers.filter(
            (user) =>
                user?.name.toLowerCase().includes(search.toLowerCase())
        );

        const handleSelectUser = (user) => {
            setSelectedUsers((prev) => [...prev, user]);
            setSearch("");
        };

        const handleRemoveUser = (user) => {
            setSelectedUsers((prev) => prev.filter((u) => u !== user));
        };

        const handleAddUsers = () => {
            // Call API here later
            handleAddNewUsers()
            setSelectedUsers([]);
            setSearch("");
            setIsAddPeople(false);
        };

        return (
            <div
                ref={addPeopleRef}
                className="absolute  mt-6 -left-44 z-50 w-90 p-3 rounded-xl bg-(--color-ter-background)"
            >
                {/* MULTI SELECT INPUT AREA */}
                <div className="border border-gray-600 rounded p-2 flex flex-wrap gap-2 max-h-28 overflow-auto">
                    {selectedUsers.map((user) => (
                        <div
                            key={user}
                            className="flex items-center gap-1 bg-[rgb(var(--color-active)/0.3)] px-2 py-1 rounded text-xs"
                        >
                            <span>{user?.name}</span>
                            <button
                                onClick={() => handleRemoveUser(user)}
                                className="text-red-300 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
                        autoFocus
                    />
                </div>

                {/* SEARCH RESULTS */}
                {search && (
                    <div className="mt-2 max-h-32 overflow-auto border border-gray-700 rounded">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user?.id}
                                    onClick={() => handleSelectUser(user)}
                                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                                >
                                    {user?.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-400 text-sm">
                                No users found
                            </div>
                        )}
                    </div>
                )}

                {/* BUTTONS */}
                <div className="mt-3 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setSelectedUsers([]);
                            setSearch("");
                            setIsAddPeople(false)
                        }}
                        className="px-3 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={selectedUsers.length === 0}
                        onClick={handleAddUsers}
                        className={`px-3 py-1 text-sm rounded text-white ${selectedUsers.length > 0
                            ? "bg-[rgb(var(--color-active)/0.8)] hover:bg-[rgb(var(--color-active)/0.6)]"
                            : "bg-gray-600 cursor-not-allowed"
                            }`}
                    >
                        Add
                    </button>
                </div>
            </div>
        );
    }

    function MemberInfoModel() {
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
                        className={`flex flex-row gap-2 border-t border-black p-2 cursor-pointer hover:text-[rgb(var(--color-active))]  ${isAddPeople && 'text-[rgb(var(--color-active))]'}`}
                        onClick={() => setIsAddPeople((prev) => !prev)}
                    >
                        <UserRoundPlus size={22} />
                        <div>Add People</div>
                    </div>

                    {/* Add People Search Dropdown */}
                    {isAddPeople && <AddPeopleDropdown />}
                </div>
            </div>
        );
    }

    function MessageSendBox() {
        return (
            <div className="h-[calc(100%-135px)]">
                <ChatMessages
                    messages={DummyMessageData}
                    currentUserId={102}
                />
            </div>
        );
    }

    function NewChatTopHeader() {
        return (
            <div className="flex flex-row gap-4 relative">
                <div>To:</div>
                <div className="flex flex-row flex-wrap gap-2 pr-2 w-full">
                    {newChatMembers.map(item => {
                        return (
                            <div
                                key={item.id}
                                className="flex flex-row gap-2 bg-black px-2 py-1 rounded-xl items-center justify-center"
                            >
                                <div className="text-xs">{item.name}</div>

                                <X
                                    size={18}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setNewChatMembers(prev => prev.filter(member => member !== item))
                                    }
                                />
                            </div>
                        );
                    })}
                    <input
                        ref={newCHatInputRef}
                        value={newChatmemberSearch}
                        onChange={(e) => setNewChatmemberSearch(e.target.value)}
                        type="text"
                        placeholder="Enter Name or Email"
                        className="bg-transparent outline-none text-sm text-white placeholder-gray-400 flex-1"
                        autoFocus
                    />
                </div>
                {
                    newChatmemberSearch &&
                    <div className="absolute z-50 bg-(--color-ter-background) p-4 w-full top-full mt-5 rounded-xl">
                        <div
                            className="flex flex-col gap-2 overflow-auto max-h-90"
                        >
                            {
                                (() => {
                                    if (!newChatmemberSearch) return null;

                                    const filteredUsers = users.filter(item =>
                                        item.name.toLowerCase().includes(newChatmemberSearch.toLowerCase()) && item.id !== currentUserId
                                    ).filter(
                                        item => !newChatMembers.includes(item)
                                    )

                                    if (filteredUsers.length === 0) {
                                        return (
                                            <div className="text-gray-400 text-sm text-center py-4">
                                                No matches found
                                            </div>
                                        );
                                    }

                                    return filteredUsers.map(item => (
                                        <div
                                            key={item.id}
                                            className="flex flex-row gap-4 hover:bg-gray-500 p-2 rounded-xl"
                                            onClick={() => handleAddNewChatMembers(item)}
                                        >
                                            <User />
                                            {item.name}
                                        </div>
                                    ));

                                })()
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }

    return (
        <div className="p-2 w-full h-full">
            <div className="h-full w-full bg-(--color-sec-background) rounded-2xl overflow-hidden">

                <div className={`bg-(--color-ter-background) w-full px-4 py-4 relative ${addNewChat && 'border-b-2 border-[rgb(var(--color-active))]'}`}>
                    {
                        addNewChat ?
                            <>
                                <NewChatTopHeader />
                            </>
                            :
                            <>
                                <TopHeader />
                                {isRenaming && <RenameGroupForm />}
                                {isGroupInfo && <MemberInfoModel />}
                            </>
                    }
                </div>

                <MessageSendBox />
                <MessageInput
                    onSend={(msg) => console.log("Sent:", msg)}
                    setChats={setChats}
                    newChatDetails={newChatDetails}
                    setAddNewChat={setAddNewChat}
                    setNewChatDetails={setNewChatDetails}
                    fetchAllConversations={fetchAllConversations}
                />
            </div>
        </div>
    );
}