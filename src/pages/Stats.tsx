import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDailyProgressRange, getXpHistory } from "../services/stats";
import { today as todayStr } from "../lib/date";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

export default function Stats() {
  const { user, progress } = useAuth();
  const [range, setRange] = useState<7 | 30 | 92>(7);
  const [daily, setDaily] = useState<any[]>([]);
  const [xp, setXp] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const to = todayStr();
    const from = new Date();
    from.setDate(from.getDate() - range + 1);
    Promise.all([
      getDailyProgressRange(user.id, from.toISOString().slice(0, 10), to),
      getXpHistory(user.id, 100),
    ]).then(([d, x]) => {
      setDaily(d);
      setXp(x.reverse());
    });
  }, [user?.id, range]);

  const xpSeries = xp.map((x, i) => ({
    i,
    xp: x.amount,
    reason: x.reason,
    at: new Date(x.created_at).toLocaleDateString("ru-RU"),
  }));
  let acc = 0;
  const xpCum = xpSeries.map((p) => {
    acc += p.xp;
    return { ...p, total: acc };
  });
  const dailySeries = daily.map((d) => ({
    date: d.date.slice(5),
    tasks: d.tasks_done,
    habits: d.habits_done,
    pct: d.tasks_total ? Math.round((d.tasks_done / d.tasks_total) * 100) : 0,
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <div className="flex gap-1">
          {[7, 30, 92].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={`btn text-xs ${range === r ? "btn-primary" : "btn-ghost"}`}
            >
              {r}д
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card">
          <div className="text-xs text-muted">Всего задач</div>
          <div className="text-2xl font-bold">
            {progress?.total_tasks_done ?? 0}
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-muted">Всего привычек</div>
          <div className="text-2xl font-bold">
            {progress?.total_habits_done ?? 0}
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-muted">Активных дней</div>
          <div className="text-2xl font-bold">{progress?.active_days ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-xs text-muted">Best streak</div>
          <div className="text-2xl font-bold">{progress?.best_streak ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Weekly activity</h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={dailySeries}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#111B2B",
                  border: "1px solid rgba(128,191,255,0.3)",
                  borderRadius: 12,
                  color: "#F2F6FC",
                }}
              />
              <Bar dataKey="tasks" fill="#80BFFF" radius={[6, 6, 0, 0]} />
              <Bar dataKey="habits" fill="#4ADE80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">XP progression</h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={xpCum}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis dataKey="at" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#111B2B",
                  border: "1px solid rgba(128,191,255,0.3)",
                  borderRadius: 12,
                  color: "#F2F6FC",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#80BFFF"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
