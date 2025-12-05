import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages, currentUserId, setReplyingTo, isGroup }) {
  return (
    <div className="flex p-4 flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          currentUserId={currentUserId}
          setReplyingTo={setReplyingTo}
          isGroup={isGroup}
        />
      ))}
    </div>
  );
}
