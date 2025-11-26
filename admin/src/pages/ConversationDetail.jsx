import { conversationDetail } from "../mock/conversationDetail";
import { useState } from "react";

export default function ConversationDetail() {
  const [isTakenOver, setIsTakenOver] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">
          Conversation • {conversationDetail.user}
        </h1>

        {!isTakenOver && (
          <button
            className="bg-red-600 px-4 py-1.5 rounded text-sm"
            onClick={() => setIsTakenOver(true)}
          >
            Take Over Chat
          </button>
        )}
      </div>

      {/* Chat window */}
      <div className="bg-slate-800 rounded-xl p-4 h-[400px] overflow-y-auto mb-4">
        {conversationDetail.messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              msg.from === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-xs text-sm
                ${
                  msg.from === "user"
                    ? "bg-slate-700 text-white"
                    : "bg-indigo-600 text-white"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Takeover input */}
      {isTakenOver && (
        <div className="flex gap-2">
          <input
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
            placeholder="Type message as human agent..."
          />
          <button className="bg-indigo-600 px-4 rounded text-sm">Send</button>
        </div>
      )}
    </div>
  );
}
