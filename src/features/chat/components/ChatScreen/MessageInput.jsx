import {
  Smile,
  Paperclip,
  Send
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createNewDirectChatApi, createNewGroupChatApi } from "../../../../api/conversation.api";
import { useAuth } from "../../../../store/auth.context";
import { useSocket } from "../../../../store/socket.context";
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  File,
  X
} from "lucide-react";


const EMOJIS = ["😀", "😁", "😂", "🤣", "😊", "😍", "😎", "😢", "😡", "👍", "🙏", "🔥", "🎉", "❤️"];

export default function MessageInput({
  setChats,
  newChatDetails,
  setAddNewChat,
  setNewChatDetails,
  fetchAllConversations,
  activeChat,
  setNewChatMembers,
  replyingTo,
  setReplyingTo
}) {
  const { auth } = useAuth();
  const { socket } = useSocket();

  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  //  Handle Typing
  const handleTyping = () => {
    socket.emit("typing", {
      conversationId: activeChat.id
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        conversationId: activeChat.id
      });
    }, 800);
  };

  //  Send Message
  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit("send_message", {
      conversationId: activeChat.id,
      content: text.trim(),
      replyTo: replyingTo?._id || null
    });
    if (replyingTo) setReplyingTo(null)
    setText(""); //  clear input
  };

  //  Enter to Send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  //  Stop typing on unmount
  useEffect(() => {
    if (!activeChat) return
    return () => {
      socket.emit("stop_typing", {
        conversationId: activeChat.id
      });
    };
  }, [activeChat?.id]);


  //  Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  //  Emoji insert
  const handleEmojiClick = (emoji) => {
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newText =
      text.slice(0, start) + emoji + text.slice(end);

    setText(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);

    setShowEmoji(false);
  };

  //  File attach
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = null; // reset input
  };

  //  Remove attachment
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createNewChat = async () => {
    try {
      if (!newChatDetails || !auth?.token) return;

      let body = {};
      let res = null; //  FIX: declare OUTSIDE

      if (newChatDetails.type === "direct") {
        const userId = newChatDetails.members?.[0]?.id;

        if (!userId) {
          console.warn("No user selected for direct chat");
          return;
        }

        body = { userId };

        res = await createNewDirectChatApi({
          token: auth.token,
          body
        });

      } else {
        const members = newChatDetails.members?.map(m => m.id);

        if (!members?.length) {
          console.warn("No members selected for group chat");
          return;
        }

        body = {
          name: newChatDetails.name || "",
          members
        };

        res = await createNewGroupChatApi({
          token: auth.token,
          body
        });
      }

      if (res?.status === 200 || res?.status === 201) {
        await fetchAllConversations();
      }

    } catch (err) {
      console.error("Failed to create chat:", err); //  message fixed
    }
  };


  const handleInputFocus = () => {
    if (newChatDetails) {
      // setChats(prev => ([...prev, newChatDetails]))
      createNewChat()
    }
    setNewChatDetails(null)
    setAddNewChat(false)
    setNewChatMembers([])
  }

  const getFileIconComponent = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return FileImage;
    if (["mp4", "mov", "avi"].includes(ext)) return FileVideo;
    if (["mp3", "wav"].includes(ext)) return FileAudio;
    if (["pdf", "doc", "docx"].includes(ext)) return FileText;
    if (["zip", "rar", "7z"].includes(ext)) return Archive;

    return File;
  };


  const canSend = text.trim().length > 0 || files.length > 0;

  return (
    <div className="w-full border-t border-gray-700 bg-[#1f1f1f] px-4 py-3 relative">
      {replyingTo && (
        <div className="absolute top-0 left-0 right-0 -translate-y-full
                  bg-gray-800 px-3 py-2 text-xs
                  flex items-center justify-between
                  rounded-t-lg border-b border-gray-700">

          {/* ✅ TEXT WITH HARD TRUNCATION */}
          <div className="flex-1 min-w-0 pr-3">
            <span className="text-blue-400 mr-1">Replying to:</span>
            <span className="block truncate text-gray-200">
              {replyingTo.content}
            </span>
          </div>

          {/* ✅ CLOSE BUTTON */}
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/*  EMOJI PICKER */}
      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-16 left-4 bg-[#2b2b2b] border border-gray-600 rounded-xl p-3 grid grid-cols-6 gap-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-xl hover:scale-110 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/*  FILE PREVIEW */}
      {files.length > 0 && (
        <div className="mb-2 flex gap-2 max-w-full overflow-x-auto absolute -top-4 pr-2">
          {files.map((file, i) => {
            const Icon = getFileIconComponent(file.name);

            return (
              <div
                key={i}
                title={file.name} // ✅ Full name on hover
                className="flex items-center gap-2 bg-[#2b2b2b] px-3 py-1 rounded-full text-xs text-white max-w-[220px]"
              >
                {/* ✅ FILE TYPE ICON */}
                <Icon size={14} className="text-gray-300 shrink-0" />

                {/* ✅ TRUNCATED FILENAME */}
                <span className="truncate max-w-[130px]">
                  {file.name}
                </span>

                {/* ✅ REMOVE BUTTON */}
                <button
                  onClick={() => removeFile(i)}
                  className="text-red-400 hover:text-red-500 shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}


      {/*  INPUT CONTAINER */}
      <div className="flex items-center gap-2 bg-[#2b2b2b] rounded-full px-4 py-2 shadow-inner border-b-2 border-transparent focus-within:border-[rgb(var(--color-active))] transition-colors duration-200">

        {/*  LEFT ICONS */}
        <div className="flex items-center gap-3 text-gray-400">
          <Smile
            className={`cursor-pointer hover:text-[rgb(var(--color-active))] ${showEmoji && 'text-[rgb(var(--color-active))]'}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowEmoji((prev) => !prev);
            }}
          />

          {/*  FILE INPUT */}
          <Paperclip
            className={`cursor-pointer hover:text-[rgb(var(--color-active))] `}
            onClick={() => fileInputRef.current.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </div>

        {/*  MESSAGE INPUT */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
          onFocus={handleInputFocus}
        />

        {/*  SEND BUTTON */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`ml-2 flex items-center justify-center w-9 h-9 rounded-full text-white transition
            ${canSend
              ? "bg-[rgb(var(--color-active)/0.9)] hover:bg-[rgb(var(--color-active)/0.7)] cursor-pointer"
              : "bg-gray-600 cursor-not-allowed opacity-60"
            }
          `}
        >
          <Send size={18} />
        </button>

      </div>
    </div>
  );
}
