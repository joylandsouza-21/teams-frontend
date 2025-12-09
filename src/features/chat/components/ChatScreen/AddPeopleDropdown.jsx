import { User } from "lucide-react";

export default function AddPeopleDropdown({
  addPeopleRef,
  users,
  activeChat,
  currentUserId,
  selectedUsers,
  setSelectedUsers,
  search,
  setSearch,
  setIsAddPeople,
  handleAddNewUsers
}) {
  const activeChatUserIds = activeChat.members.map(m => m.id);

  const allUsers = users.filter(
    (item) =>
      item.id !== currentUserId &&
      !activeChatUserIds.includes(item.id) &&
      !selectedUsers.includes(item)
  );

  const filteredUsers = allUsers.filter((user) =>
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
    handleAddNewUsers();
    setSelectedUsers([]);
    setSearch("");
    setIsAddPeople(false);
  };

  return (
    <div
      ref={addPeopleRef}
      className="absolute mt-6 -left-44 z-50 w-90 p-3 rounded-xl bg-(--color-ter-background)"
    >
      {/* MULTI SELECT INPUT AREA */}
      <div className="border border-gray-600 rounded p-2 flex flex-wrap gap-2 max-h-28 overflow-auto">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
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
        <div className="mt-2 max-h-32 overflow-auto rounded">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user?.id}
                onClick={() => handleSelectUser(user)}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm flex flex-row items-center gap-4 rounded-xl"
              >
                {
                  user?.profile_pic ?
                    (<img
                      src={`${import.meta.env.VITE_API_BASE_URL}${user.profile_pic}`}
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
                <div>
                  {user?.name}
                </div>

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
            setIsAddPeople(false);
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
