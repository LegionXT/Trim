import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Conversations from "./pages/Conversations";
import Tickets from "./pages/Tickets";
import Settings from "./pages/Settings";
import ConversationDetail from "./pages/conversationDetail";

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/conversations/:id" element={<ConversationDetail />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
