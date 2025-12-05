import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages, currentUserId, setReplyingTo }) {
  return (
    <div className="flex p-4 flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          currentUserId={currentUserId}
          setReplyingTo={setReplyingTo}
        />
      ))}
    </div>
  );
}
