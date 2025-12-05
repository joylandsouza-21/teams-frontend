import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import { getMessageHistoryApi } from "../../../../api/message.api";
import { useAuth } from "../../../../store/auth.context";
import { useSocket } from "../../../../store/socket.context";

export default function MessageBox({ activeChat, currentUserId, setReplyingTo }) {
  const { auth } = useAuth();
  const { socket, isSocketConnected } = useSocket();

  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const lastMessageIdRef = useRef(null);
  const oldestMessageIdRef = useRef(null);
  const containerRef = useRef(null);

  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    if (!activeChat?.id) return;

    let isMounted = true;

    const joinAndLoad = async () => {
      socket.emit("join_conversation", {
        conversationId: activeChat.id
      });

      const res = await getMessageHistoryApi({
        token: auth.token,
        conversationId: activeChat.id,
        params: { limit: 50 }
      });

      if (isMounted && res?.data?.messages) {
        const msgs = res.data.messages;

        shouldAutoScrollRef.current = true;

        setMessages(msgs);
        setHasMore(res.data.hasMore ?? msgs.length === 50);

        const lastMsg = msgs.at(-1);
        const firstMsg = msgs.at(0);

        if (lastMsg) {
          lastMessageIdRef.current = lastMsg._id;

          socket.emit("mark_read", {
            conversationId: activeChat.id,
            lastMessageId: lastMsg._id
          });
        }

        if (firstMsg) {
          oldestMessageIdRef.current = firstMsg._id;
        }
      }
    };

    joinAndLoad();

    return () => {
      isMounted = false;

      socket.emit("leave_conversation", {
        conversationId: activeChat.id,
      });

      setMessages([]);
      setTypingUsers([]);
      setHasMore(true);
      oldestMessageIdRef.current = null;
      lastMessageIdRef.current = null;
    };
  }, [activeChat?.id]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      !activeChat?.id ||
      messages.length === 0 ||
      !shouldAutoScrollRef.current
    ) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [activeChat?.id, messages.length]);


  const fetchMoreHistory = async () => {
    if (!hasMore || loadingMore || !oldestMessageIdRef.current) return;

    setLoadingMore(true);

    const container = containerRef.current;
    const previousHeight = container.scrollHeight;

    const res = await getMessageHistoryApi({
      token: auth.token,
      conversationId: activeChat.id,
      params: {
        limit: 50,
        before: oldestMessageIdRef.current,
      },
    });

    if (res?.data?.messages?.length) {
      // ❌ DO NOT AUTO SCROLL when loading old messages
      shouldAutoScrollRef.current = false;

      setMessages((prev) => [
        ...res.data.messages,
        ...prev
      ]);

      oldestMessageIdRef.current = res.data.messages[0]?._id;

      setHasMore(
        res.data.hasMore ?? res.data.messages.length === 50
      );

      // ✅ Maintain exact visual position
      requestAnimationFrame(() => {
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - previousHeight;
      });
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  // ✅ 3. SCROLL LISTENER
  const handleScroll = () => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollTop === 0) {
      fetchMoreHistory();
    }
  };

  // ✅ 4. SOCKET LISTENERS
  useEffect(() => {
    if (!activeChat?.id) return;

    const onNewMessage = (msg) => {
      if (msg.conversationId !== activeChat.id) return;

      shouldAutoScrollRef.current = true;
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      lastMessageIdRef.current = msg._id;

      socket.emit("mark_read", {
        conversationId: activeChat.id,
        lastMessageId: msg._id
      });

      // ✅ Auto-scroll to bottom if user is near bottom
      const container = containerRef.current;
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 120;

      if (nearBottom) {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
          });
        }, 0);
      }
    };

    // ✅ EDIT MESSAGE
    const onMessageEdited = (updatedMsg) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === updatedMsg._id ? updatedMsg : m
        )
      );
    };

    // ✅ DELETE MESSAGE
    const onMessageDeleted = (deletedMsg) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === deletedMsg._id
            ? { ...m, deleted: true }
            : m
        )
      );
    };

    // ✅ REACT MESSAGE
    const onMessageReacted = (reactedMsg) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === reactedMsg._id ? reactedMsg : m
        )
      );
    };

    const onTyping = ({ userId }) => {
      setTypingUsers(prev => [...new Set([...prev, userId])]);
    };

    const onStopTyping = ({ userId }) => {
      setTypingUsers(prev => prev.filter(id => id !== userId));
    };

    socket.on("new_message", onNewMessage);
    socket.on("message_edited", onMessageEdited);
    socket.on("message_deleted", onMessageDeleted);
    socket.on("message_reacted", onMessageReacted);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("message_edited", onMessageEdited);
      socket.off("message_deleted", onMessageDeleted);
      socket.off("message_reacted", onMessageReacted);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
    };
  }, [activeChat?.id]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100%-135px)] overflow-y-auto relative px-2"
    >
      {/* ✅ LOADING OLD MESSAGES */}
      {loadingMore && (
        <div className="text-xs text-center text-gray-400 py-2">
          Loading older messages...
        </div>
      )}

      {/* ✅ EMPTY STATE */}
      {messages.length === 0 && !loadingMore ? (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
          No messages yet. Say hello 👋
        </div>
      ) :
        <ChatMessages
          messages={messages}
          currentUserId={currentUserId}
          setReplyingTo={setReplyingTo}
          isGroup={activeChat?.type === 'group'}
        />
      }


      {/* ✅ TYPING INDICATOR */}
      {typingUsers.length > 0 && (
        <div className="sticky bottom-1 left-4 text-xs text-gray-400 animate-pulse">
          Someone is typing...
        </div>
      )}
    </div>
  );
}
