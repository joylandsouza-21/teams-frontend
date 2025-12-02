export default function MessageBubble({ message, currentUserId }) {
  const isMe = message.senderId === currentUserId;

  // ✅ Deleted message view
  if (message.deleted) {
    return (
      <div className="text-center text-xs text-gray-400 italic my-2">
        This message was deleted
      </div>
    );
  }

  return (
    <div
      className={`flex w-full my-1 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm relative ${
          isMe
            ? "bg-[rgb(var(--color-active)/0.9)] text-white rounded-br-sm"
            : "bg-[#2b2b2b] text-white rounded-bl-sm"
        }`}
      >
        {/* ✅ PLAIN MESSAGE TEXT */}
        <div className="whitespace-pre-wrap wrap-break-word">
          {message.content}
        </div>

        {/* ✅ ATTACHMENTS */}
        {message.attachments?.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {message.attachments.map((file, i) => (
              <a
                key={i}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline opacity-90"
              >
                📎 {file.fileName}
              </a>
            ))}
          </div>
        )}

        {/* ✅ FOOTER (TIME + EDITED) */}
        <div className="mt-1 text-[10px] opacity-70 flex justify-end gap-2">
          {message.edited && <span>edited</span>}
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* ✅ REACTIONS */}
        {message.reactions &&
          Object.keys(message.reactions).length > 0 && (
            <div
              className={`absolute -bottom-4 flex gap-1 ${
                isMe ? "right-2" : "left-2"
              }`}
            >
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <div
                  key={emoji}
                  className="bg-[#1f1f1f] text-xs px-2 py-0.5 rounded-full border border-gray-700"
                >
                  {emoji} {users.length}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
