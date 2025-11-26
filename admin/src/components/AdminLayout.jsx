import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <aside className="w-56 bg-slate-950 p-4 border-r border-slate-800">
        <h2 className="font-bold mb-6">TriMode Admin</h2>
        <nav className="space-y-2 text-sm">
          <Link to="/" className="block p-2 hover:bg-slate-800 rounded">
            Dashboard
          </Link>
          <Link
            to="/conversations"
            className="block p-2 hover:bg-slate-800 rounded"
          >
            Conversations
          </Link>
          <Link to="/tickets" className="block p-2 hover:bg-slate-800 rounded">
            Tickets
          </Link>
          <Link to="/settings" className="block p-2 hover:bg-slate-800 rounded">
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
