import {
  Smile,
  Paperclip,
  Send
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createNewDirectChatApi, createNewGroupChatApi } from "../../../api/conversation.api";
import { useAuth } from "../../../store/auth.context";

const EMOJIS = ["😀", "😁", "😂", "🤣", "😊", "😍", "😎", "😢", "😡", "👍", "🙏", "🔥", "🎉", "❤️"];

export default function MessageInput({
  onSend,
  setChats,
  newChatDetails,
  setAddNewChat,
  setNewChatDetails,
  fetchAllConversations
}) {
  const { auth } = useAuth();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  // ✅ Emoji insert
  const handleEmojiClick = (emoji) => {
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newText =
      message.slice(0, start) + emoji + message.slice(end);

    setMessage(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);

    setShowEmoji(false);
  };

  // ✅ File attach
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = null; // reset input
  };

  // ✅ Remove attachment
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Send message
  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;

    onSend?.({
      text: message,
      files,
    });

    setMessage("");
    setFiles([]);
  };

  const createNewChat = async () => {
    try {
      if (!newChatDetails || !auth?.token) return;

      let body = {};
      let res = null; // ✅ FIX: declare OUTSIDE

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
      console.error("Failed to create chat:", err); // ✅ message fixed
    }
  };


  const handleInputFocus = () => {
    if (newChatDetails) {
      // setChats(prev => ([...prev, newChatDetails]))
      createNewChat()
      setNewChatDetails(null)
      setAddNewChat(false)
    }
  }

  return (
    <div className="w-full border-t border-gray-700 bg-[#1f1f1f] px-4 py-3 relative">

      {/* ✅ EMOJI PICKER */}
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

      {/* ✅ FILE PREVIEW */}
      {files.length > 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto absolute -top-4">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-[#2b2b2b] px-3 py-1 rounded-full text-xs text-white"
            >
              <span>{file.name}</span>
              <button onClick={() => removeFile(i)} className="text-red-400">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ INPUT CONTAINER */}
      <div className="flex items-center gap-2 bg-[#2b2b2b] rounded-full px-4 py-2 shadow-inner border-b-2 border-transparent focus-within:border-[rgb(var(--color-active))] transition-colors duration-200">

        {/* ✅ LEFT ICONS */}
        <div className="flex items-center gap-3 text-gray-400">
          <Smile
            className={`cursor-pointer hover:text-[rgb(var(--color-active))] ${showEmoji && 'text-[rgb(var(--color-active))]'}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowEmoji((prev) => !prev);
            }}
          />

          {/* ✅ FILE INPUT */}
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

        {/* ✅ MESSAGE INPUT */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onFocus={handleInputFocus}
        />

        {/* ✅ SEND BUTTON */}
        <button
          onClick={handleSend}
          className="ml-2 flex items-center justify-center w-9 h-9 rounded-full bg-[rgb(var(--color-active)/0.9)] hover:bg-[rgb(var(--color-active)/0.7)] text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
