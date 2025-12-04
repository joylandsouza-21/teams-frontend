import { updateConversationApi } from "../../../../api/conversation.api";
import { useAuth } from "../../../../store/auth.context";

export default function RenameGroupForm({
  renameRef,
  newName,
  setNewName,
  setIsRenaming,
  activeChat,
  fetchAllConversations
}) {
  const { auth } = useAuth();

  const handleGroupNameUpdate = async () => {
    const res = await updateConversationApi({ token: auth?.token, conversationId: activeChat?.id, body: { name: newName } })
    if (res?.status === 200) {
      fetchAllConversations()
    }
  }

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    handleGroupNameUpdate()
    setIsRenaming(false);
    setNewName("")
  };

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
