import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages, currentUserId }) {
  return (
    <div className="flex max-h-full overflow-auto p-4 flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
