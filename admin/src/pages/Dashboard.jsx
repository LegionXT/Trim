import { analytics } from "../mock/analytics";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#ef4444", "#22c55e"];

export default function Dashboard() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">Analytics Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Avg Response Time</p>
          <p className="text-2xl font-bold">
            {analytics.metrics.avgResponseTime}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Escalation Rate</p>
          <p className="text-2xl font-bold text-red-400">
            {analytics.metrics.escalationRate}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">CSAT</p>
          <p className="text-2xl font-bold text-green-400">
            {analytics.metrics.csat}
          </p>
        </div>
      </div>

      {/* Intent chart */}
      <div className="bg-slate-800 p-4 rounded-xl w-96">
        <h2 className="text-sm mb-4">Intent Distribution</h2>
        <PieChart width={300} height={250}>
          <Pie
            data={analytics.intentDistribution}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
          >
            {analytics.intentDistribution.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
