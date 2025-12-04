import { User, X } from "lucide-react";

export default function NewChatTopHeader({
  users,
  currentUserId,
  newChatMembers,
  setNewChatMembers,
  newChatmemberSearch,
  setNewChatmemberSearch,
  newCHatInputRef
}) {

  const handleAddNewChatMembers = (item) => {
        setNewChatmemberSearch('')
        setNewChatMembers(prev => [...prev, item])
    }

  return (
    <div className="flex flex-row gap-4 relative">
      <div>To:</div>
      <div className="flex flex-row flex-wrap gap-2 pr-2 w-full">
        {newChatMembers.map((item) => {
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
                  setNewChatMembers((prev) =>
                    prev.filter((member) => member !== item)
                  )
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
      {newChatmemberSearch && (
        <div className="absolute z-50 bg-(--color-ter-background) p-4 w-full top-full mt-5 rounded-xl">
          <div className="flex flex-col gap-2 overflow-auto max-h-90">
            {(() => {
              if (!newChatmemberSearch) return null;

              const filteredUsers = users
                .filter(
                  (item) =>
                    item.name
                      .toLowerCase()
                      .includes(newChatmemberSearch.toLowerCase()) &&
                    item.id !== currentUserId
                )
                .filter((item) => !newChatMembers.includes(item));

              if (filteredUsers.length === 0) {
                return (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No matches found
                  </div>
                );
              }

              return filteredUsers.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-row gap-4 hover:bg-gray-500 p-2 rounded-xl"
                  onClick={() => handleAddNewChatMembers(item)}
                >
                  <User />
                  {item.name}
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
