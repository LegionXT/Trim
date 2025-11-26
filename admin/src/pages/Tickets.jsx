import { tickets } from "../mock/tickets";

export default function Tickets() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Support Tickets</h1>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Ticket</th>
              <th className="px-4 py-3 text-left">Issue</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t border-slate-700 hover:bg-slate-700/40"
              >
                <td className="px-4 py-3 font-medium">{ticket.id}</td>

                <td className="px-4 py-3 text-slate-400">{ticket.issue}</td>

                <td className="px-4 py-3 capitalize">
                  <span
                    className={`text-xs px-2 py-1 rounded-full
                      ${
                        ticket.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : ticket.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-400"
                      }
                    `}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td className="px-4 py-3 capitalize text-slate-300">
                  {ticket.status.replace("_", " ")}
                </td>

                <td className="px-4 py-3 text-slate-400">{ticket.createdAt}</td>

                <td className="px-4 py-3">
                  <button className="text-xs border border-slate-600 px-3 py-1 rounded hover:bg-slate-700">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
