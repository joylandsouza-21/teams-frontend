import React from "react";

export default function IncomingCallCard({
  fromUser,
  type,
  conversationName,
  conversationType,
  onAccept,
  onReject
}) {
  const isGroup = conversationType === "group";

  return (
    <div
      className="
        fixed bottom-6 right-6 w-[340px] p-4 
        bg-[#1F1F1F] text-white shadow-2xl rounded-2xl border border-gray-700 
        z-9999 animate-slide-up
      "
    >
      {/* Caller Section */}
      <div className="flex items-center mb-3 gap-3">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${fromUser?.avatar}` || "/default_avatar.png"}
          alt="caller"
          className="w-14 h-14 rounded-full object-cover border border-gray-600"
        />

        <div className="flex flex-col">
          <span className="text-lg font-semibold">
            {fromUser?.name}
          </span>

          <span className="text-sm text-gray-400">
            {isGroup
              ? `${conversationName} • ${type === "audio" ? "Group Voice Call" : "Group Video Call"}`
              : type === "audio"
              ? "Incoming Voice Call"
              : "Incoming Video Call"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onReject}
          className="
            bg-red-600 hover:bg-red-700
            text-white px-4 py-2 rounded-lg flex-1 mr-2 
            transition-all duration-200
          "
        >
          Reject
        </button>

        <button
          onClick={onAccept}
          className="
            bg-green-600 hover:bg-green-700
            text-white px-4 py-2 rounded-lg flex-1 ml-2
            transition-all duration-200
          "
        >
          Accept
        </button>
      </div>
    </div>
  );
}
