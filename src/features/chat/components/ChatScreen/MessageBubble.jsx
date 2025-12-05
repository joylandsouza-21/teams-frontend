import { useRef, useState } from "react";
import { Pencil, Trash2, Smile, Check, X, Reply, CircleUser } from "lucide-react";
import { useSocket } from "../../../../store/socket.context";

export default function MessageBubble({ message, currentUserId, setReplyingTo, isGroup }) {
  const { socket } = useSocket();
  const isMe = Number(message.senderId) === Number(currentUserId);
  const senderName = message.sender?.name || "Unknown";
  const senderPic = message.sender?.profile_pic;

  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const actionTimerRef = useRef(null);
  const reactionTimerRef = useRef(null);

  const reactionTypes = Object.keys(message.reactions || {});
  const reactionTypeCount = reactionTypes.length;

  // 1 reaction pill ≈ 48px (emoji + padding + count)
  const requiredReactionWidth = reactionTypeCount * 48;

  let minWidthStyle = {};

  if (requiredReactionWidth > 0) {
    minWidthStyle = {
      minWidth: Math.min(requiredReactionWidth + 32, 420) + "px"
    };
  }


  const onBubbleEnter = () => {
    clearTimeout(actionTimerRef.current);
    if (isEditing) return;
    setShowActions(true);
  };

  const onBubbleLeave = () => {
    actionTimerRef.current = setTimeout(() => {
      if (!showReactions) setShowActions(false);
    }, 120);
  };


  const onToolbarEnter = () => {
    clearTimeout(actionTimerRef.current);
  };

  const onToolbarLeave = () => {
    actionTimerRef.current = setTimeout(() => {
      if (!showReactions) setShowActions(false);
    }, 120);
  };


  const onReactionEnter = () => {
    clearTimeout(reactionTimerRef.current);
  };

  const onReactionLeave = () => {
    reactionTimerRef.current = setTimeout(() => {
      setShowReactions(false);
      setShowActions(false);
    }, 120);
  };


  const handleReact = (emoji) => {
    socket.emit("react_message", {
      messageId: message._id,
      emoji,
    });

    setShowReactions(false);
    setShowActions(false);
  };

  const handleDelete = () => {
    socket.emit("delete_message", {
      messageId: message._id,
    });
  };

  const handleEditSave = () => {
    if (!editText.trim()) return;

    socket.emit("edit_message", {
      messageId: message._id,
      content: editText,
    });

    setIsEditing(false);
  };

  const scrollToOriginal = (id) => {
    const el = document.querySelector(`[data-msg-id="${id}"]`);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    el.classList.add("ring-2", "ring-white-300");
    setTimeout(() => {
      el.classList.remove("ring-2", "ring-white-300");
    }, 1200);
  };


  if (message.deleted) {
    return (
      <div className={`text-xs text-gray-400 italic flex w-full my-1 ${isMe ? "justify-end" : "justify-start"}`}>
        This message was deleted
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = (type) => type?.startsWith("image/");

  return (
    <div className={`flex w-full my-1 flex-row items-start gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <div className="shrink-0 mt-4">
          {senderPic ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${senderPic}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <CircleUser className="w-8 h-8 opacity-70" />
          )}
        </div>
      )}

      <div className={`flex flex-col gap-1 w-full ${isMe ? "items-end" : "items-start"}`}>
        <div className="opacity-70 text-xs">{senderName}</div>
        <div
          onMouseEnter={onBubbleEnter}
          onMouseLeave={onBubbleLeave}
          style={minWidthStyle}
          data-msg-id={message._id}
          className={`max-w-[70%] min-w-20 px-4 py-2 rounded-2xl text-sm relative ${isMe
            ? "bg-[rgb(var(--color-active)/0.9)] text-white rounded-tr-sm"
            : "bg-[#2b2b2b] text-white rounded-tl-sm"
            }`}
        >
          {/* ✅ ACTION TOOLBAR */}
          {showActions && !isEditing && (
            <div
              onMouseEnter={onToolbarEnter}
              onMouseLeave={onToolbarLeave}
              className="absolute -top-[26px] right-1 flex gap-2 bg-black/90 px-2 py-1 rounded-lg text-xs z-20"
            >
              <Smile
                size={14}
                className="cursor-pointer hover:text-yellow-400"
                onClick={() => setShowReactions((p) => !p)}
              />

              {isMe && (
                <>
                  <Pencil
                    size={14}
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => {
                      setShowActions(false);
                      setIsEditing(true);
                      setEditText(message.content);
                    }}
                  />
                  <Trash2
                    size={14}
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => {
                      setShowActions(false);
                      handleDelete()
                    }}
                  />
                </>
              )}
              <Reply
                size={14}
                className="cursor-pointer hover:text-blue-400"
                onClick={() => {
                  setReplyingTo(message)
                }}
              />
            </div>
          )}

          {/* ✅ REACTION PICKER */}
          {showReactions && (
            <div
              onMouseEnter={onReactionEnter}
              onMouseLeave={onReactionLeave}
              className={`absolute -top-16 right-0 flex gap-2 bg-black px-3 py-2 rounded-lg text-sm z-30 ${!isMe && 'flex-wrap'}`}
            >
              {["👍", "❤️", "😂", "😮", "🔥"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="hover:scale-110 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* ✅ EDIT MODE */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-black/40 border border-gray-500 text-white text-sm p-2 rounded resize-none min-w-200"
                rows={4}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-400 hover:text-white flex gap-1 items-center"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="text-xs text-green-400 hover:text-green-300 flex gap-1 items-center"
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ✅ REPLY PREVIEW (CLICKABLE) */}
              {message.replyTo && message.replyPreview && (
                <div
                  onClick={() => scrollToOriginal(message.replyTo)}
                  className={`mb-2 px-2 py-1 text-xs rounded cursor-pointer border-l-4 
                  ${isMe ? "bg-black/30 border-white/40" : "bg-black/40 border-blue-400"}
                `}
                >
                  <div className="opacity-70 truncate max-w-[220px]">
                    {message.replyPreview.content}
                  </div>
                </div>
              )}
              {/* ✅ ATTACHMENT PREVIEW */}
              {message.attachments?.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {message.attachments.map((file) => (
                    <a
                      key={file.url}
                      href={`${import.meta.env.VITE_API_BASE_URL}${file.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      {isImage(file.type) ? (
                        // ✅ IMAGE PREVIEW
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${file.url}`}
                          alt={file.fileName}
                          className="max-w-[220px] rounded-lg border border-gray-600 hover:opacity-90 transition"
                        />
                      ) : (
                        // ✅ FILE PREVIEW CARD (PDF, ZIP, DOC, ETC)
                        <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-lg border border-gray-600 hover:bg-black/60 transition">
                          <span className="text-lg">📎</span>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-white truncate max-w-[180px]">
                              {file.fileName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}


              {/* ✅ MESSAGE TEXT */}
              <div className="whitespace-pre-wrap wrap-anywhere">
                {message.content}
              </div>

              {/* ✅ FOOTER */}
              <div className="mt-1 text-[10px] opacity-70 flex justify-end gap-2">
                {message.edited && <span>edited</span>}
                <span>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </>
          )}

          {/* ✅ REACTION DISPLAY */}
          {message.reactions &&
            Object.keys(message.reactions).length > 0 && (
              <div
                className={`absolute -bottom-4 flex gap-1 ${isMe ? "right-2" : "left-2"
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
    </div>
  );
}
