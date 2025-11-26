export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Settings</h1>
      <div className="space-y-4 max-w-xl">
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-medium text-white mb-2">
            Greeting message
          </h2>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
            rows={3}
            defaultValue="Hi! I’m TriMode — I can help with productivity, shopping and support."
          />
          <button className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs">
            Save
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-medium text-white mb-2">Enabled modes</h2>
          <div className="space-y-1 text-sm text-slate-200">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Productivity
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> E-commerce
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Support
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
