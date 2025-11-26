import { conversations } from "../mock/Conversations";
import { Link } from "react-router-dom";

export default function Conversations() {
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Live Conversations</h1>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Message</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {conversations.map((conv) => (
              <tr
                key={conv.id}
                className="border-t border-slate-700 hover:bg-slate-700/40"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{conv.user}</div>
                  <div className="text-xs text-slate-400">{conv.email}</div>
                </td>

                <td className="px-4 py-3 capitalize text-slate-300">
                  {conv.mode}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full
                      ${
                        conv.status === "open"
                          ? "bg-green-500/20 text-green-400"
                          : conv.status === "escalated"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-500/20 text-slate-300"
                      }
                    `}
                  >
                    {conv.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-400">{conv.lastMessage}</td>

                <td className="px-4 py-3 text-slate-400">{conv.updatedAt}</td>

                <td className="px-4 py-3">
                  <Link
                    to={`/conversations/${conv.id}`}
                    className="text-xs bg-indigo-600 px-3 py-1 rounded"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
