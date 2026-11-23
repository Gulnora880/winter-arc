import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  listHabits,
  createHabit,
  deleteHabit,
  toggleHabit,
  getRecordsForRange,
} from "../services/habits";
import { awardXP } from "../services/profile";
import { XP_HABIT } from "../lib/xp";
import { today as todayStr, daysInMonth } from "../lib/date";
import type { Habit, HabitRecord } from "../types";
import { Modal } from "../components/Modal";
import { Plus, Trash2 } from "lucide-react";
import { useCompanion } from "../hooks/useCompanion";

export default function Habits() {
  const { user, refresh } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    icon: "⭐",
    color: "#80BFFF",
    frequency: "daily",
    target_time: "",
  });
  const today = todayStr();
  const companion = useCompanion(user?.id);

  async function load() {
    if (!user) return;
    const [h, r] = await Promise.all([
      listHabits(user.id),
      getRecordsForRange(user.id, monthStart(), today),
    ]);
    setHabits(h);
    setRecords(r);
  }
  function monthStart() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [user?.id]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await createHabit({
      name: form.name.trim(),
      icon: form.icon,
      color: form.color,
      frequency: form.frequency as "daily" | "weekly",
      target_time: form.target_time || null,
    });
    setForm({
      name: "",
      icon: "⭐",
      color: "#80BFFF",
      frequency: "daily",
      target_time: "",
    });
    setOpen(false);
    await load();
  }

  async function toggle(h: Habit) {
    if (!user) return;
    const rec = records.find((r) => r.habit_id === h.id && r.date === today);
    const c = !rec?.completed;
    await toggleHabit(h.id, user.id, today, c);
    if (c) {
      await awardXP(user.id, XP_HABIT, "habit");
      companion.trigger("habitDone");
      await refresh();
    }
    await load();
  }

  function streakFor(habitId: string) {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 60; i++) {
      const key = d.toISOString().slice(0, 10);
      const rec = records.find(
        (r) => r.habit_id === habitId && r.date === key && r.completed,
      );
      if (rec) s++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }

  function last30(habitId: string) {
    const days: string[] = [];
    const d = new Date();
    for (let i = 29; i >= 0; i--) {
      const x = new Date();
      x.setDate(d.getDate() - i);
      days.push(x.toISOString().slice(0, 10));
    }
    return days.map((day) => {
      const rec = records.find(
        (r) => r.habit_id === habitId && r.date === day && r.completed,
      );
      return { day, done: !!rec };
    });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Habits</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> Новая привычка
        </button>
      </div>

      {habits.length === 0 && (
        <div className="card text-muted text-center py-10">
          Пока нет привычек.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {habits.map((h) => {
          const done = !!records.find(
            (r) => r.habit_id === h.id && r.date === today && r.completed,
          );
          const streak = streakFor(h.id);
          const grid = last30(h.id);
          return (
            <div key={h.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: h.color + "22",
                      border: `1px solid ${h.color}55`,
                    }}
                  >
                    {h.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-xs text-muted">
                      🔥 Streak: {streak}
                    </div>
                  </div>
                </div>
                <button
                  className="btn-ghost !p-2"
                  onClick={() => deleteHabit(h.id).then(load)}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div
                className="grid grid-cols-30 gap-1 mb-3"
                style={{ gridTemplateColumns: "repeat(30, minmax(0,1fr))" }}
              >
                {grid.map((d) => (
                  <div
                    key={d.day}
                    title={d.day}
                    className="aspect-square rounded-sm"
                    style={{
                      background: d.done ? h.color : "rgba(255,255,255,0.06)",
                    }}
                  />
                ))}
              </div>

              <button
                className={`btn w-full ${done ? "bg-accent/20 text-accent" : "btn-ghost"}`}
                onClick={() => toggle(h)}
              >
                {done ? "✓ Выполнено сегодня" : "Отметить сегодня"}
              </button>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Новая привычка">
        <form onSubmit={add} className="space-y-3">
          <div>
            <label className="label">Название</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Иконка</label>
              <input
                className="input"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Цвет</label>
              <input
                type="color"
                className="input h-[42px]"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Частота</label>
              <select
                className="input"
                value={form.frequency}
                onChange={(e) =>
                  setForm({ ...form, frequency: e.target.value })
                }
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
              </select>
            </div>
            <div>
              <label className="label">Время</label>
              <input
                type="time"
                className="input"
                value={form.target_time}
                onChange={(e) =>
                  setForm({ ...form, target_time: e.target.value })
                }
              />
            </div>
          </div>
          <button className="btn-primary w-full py-3">Добавить</button>
        </form>
      </Modal>
    </div>
  );
}
