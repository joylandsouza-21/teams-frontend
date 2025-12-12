import React from "react";

export default function IncomingCallCard({ caller, type, onAccept, onReject }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[320px] p-4 bg-white shadow-xl rounded-xl border z-[9999] animate-slide-up">
      <div className="font-semibold text-lg">{caller.name} is calling…</div>
      <div className="text-gray-500 text-sm mb-3">
        {type === "audio" ? "Voice Call" : "Video Call"}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onReject}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Reject
        </button>
        <button
          onClick={onAccept}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
