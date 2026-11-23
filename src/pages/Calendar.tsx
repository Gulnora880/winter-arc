import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDailyProgressRange } from "../services/stats";
import { monthName, daysInMonth, today as todayStr } from "../lib/date";
import { Modal } from "../components/Modal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [progress, setProgress] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const to = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth(year, month)}`;
    setProgress(await getDailyProgressRange(user.id, from, to));
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [year, month, user?.id]);

  const map = useMemo(() => {
    const m = new Map<string, any>();
    progress.forEach((p) => m.set(p.date, p));
    return m;
  }, [progress]);

  const days = daysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay() || 7;
  const cells: (number | null)[] = [];
  for (let i = 1; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const todayS = todayStr();
  const selectedData = selected ? map.get(selected) : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <button
            className="btn-ghost !p-2"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear((y) => y - 1);
              } else setMonth((m) => m - 1);
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="font-semibold capitalize">
            {monthName(year, month)}
          </div>
          <button
            className="btn-ghost !p-2"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear((y) => y + 1);
              } else setMonth((m) => m + 1);
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted mb-2">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const p = map.get(key);
            const ratio = p && p.tasks_total ? p.tasks_done / p.tasks_total : 0;
            const isToday = key === todayS;
            return (
              <button
                key={i}
                onClick={() => setSelected(key)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition
                  ${isToday ? "ring-2 ring-accent" : ""}
                  hover:bg-white/5`}
                style={{
                  background: p
                    ? `rgba(128,191,255,${0.15 + ratio * 0.6})`
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <span className="font-medium">{d}</span>
                {p && (
                  <span className="text-[10px] text-muted">
                    {p.tasks_done}/{p.tasks_total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ?? ""}
      >
        {selectedData ? (
          <div className="space-y-2">
            <div>
              Задачи: {selectedData.tasks_done} / {selectedData.tasks_total}
            </div>
            <div>
              Привычки: {selectedData.habits_done} / {selectedData.habits_total}
            </div>
            <div>XP заработано: {selectedData.xp_earned}</div>
          </div>
        ) : (
          <p className="text-muted">Нет данных за этот день.</p>
        )}
      </Modal>
    </div>
  );
}
