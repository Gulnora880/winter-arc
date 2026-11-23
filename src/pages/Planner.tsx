import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  listTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/tasks";
import { today as todayStr } from "../lib/date";
import { XP_TASK } from "../lib/xp";
import { awardXP } from "../services/profile";
import type { Task, Category, Priority } from "../types";
import { Modal } from "../components/Modal";
import { Plus, Trash2, Check, Search } from "lucide-react";
import { useCompanion } from "../hooks/useCompanion";

const CATEGORIES: Category[] = [
  "Study",
  "Health",
  "Personal",
  "Work",
  "Skills",
  "Sport",
  "Other",
];
const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PRIORITY_COLOR: Record<Priority, string> = {
  low: "bg-slate-500/30 text-slate-300",
  medium: "bg-amber-500/20 text-amber-300",
  high: "bg-red-500/20 text-red-300",
};

export default function Planner() {
  const { user, refresh } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [date, setDate] = useState(todayStr());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category: Category;
    priority: Priority;
    due_time: string;
  }>({
    title: "",
    description: "",
    category: "Study",
    priority: "medium",
    due_time: "",
  });
  const companion = useCompanion(user?.id);

  async function load() {
    if (!user) return;
    setTasks(await listTasks(user.id, date));
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [user?.id, date]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await createTask({
      title: form.title.trim(),
      description: form.description || null,
      category: form.category,
      priority: form.priority,
      due_time: form.due_time || null,
      due_date: date,
      xp_reward: XP_TASK,
    });
    setForm({
      title: "",
      description: "",
      category: "Study",
      priority: "medium",
      due_time: "",
    });
    setOpen(false);
    await load();
  }

  async function toggle(t: Task) {
    const c = !t.completed;
    await updateTask(t.id, {
      completed: c,
      completed_at: c ? new Date().toISOString() : null,
    });
    if (c && user) {
      await awardXP(user.id, XP_TASK, "task");
      companion.trigger("taskDone");
      await refresh();
    }
    await load();
  }

  async function remove(id: string) {
    await deleteTask(id);
    await load();
  }

  const filtered = useMemo(() => {
    let r = tasks;
    if (filter === "active") r = r.filter((t) => !t.completed);
    if (filter === "done") r = r.filter((t) => t.completed);
    if (query.trim())
      r = r.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
    return r;
  }, [tasks, filter, query]);

  const total = tasks.length,
    done = tasks.filter((t) => t.completed).length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Daily Planner</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> Новая задача
        </button>
      </div>

      <div className="card flex flex-wrap gap-3 items-center">
        <input
          type="date"
          className="input max-w-[200px]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            className="input pl-9"
            placeholder="Поиск"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input max-w-[160px]"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="done">Выполненные</option>
        </select>
        <div className="text-sm text-muted">
          {done}/{total} · {Math.round(pct)}%
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card text-muted text-center py-10">Пусто.</div>
        )}
        {filtered.map((t) => (
          <div key={t.id} className="card flex items-center gap-3">
            <button
              onClick={() => toggle(t)}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition ${t.completed ? "bg-accent border-accent text-bg" : "border-white/20 hover:border-accent"}`}
            >
              {t.completed && <Check size={14} />}
            </button>
            <div className="flex-1 min-w-0">
              <div
                className={`font-medium ${t.completed ? "line-through text-muted" : ""}`}
              >
                {t.title}
              </div>
              {t.description && (
                <div className="text-xs text-muted">{t.description}</div>
              )}
              <div className="flex flex-wrap gap-2 text-xs mt-1">
                <span className="px-2 py-0.5 rounded-md bg-white/5">
                  {t.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md ${PRIORITY_COLOR[t.priority]}`}
                >
                  {t.priority}
                </span>
                {t.due_time && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5">
                    {t.due_time.slice(0, 5)}
                  </span>
                )}
              </div>
            </div>
            <button className="btn-ghost !p-2" onClick={() => remove(t.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Новая задача">
        <form onSubmit={add} className="space-y-3">
          <div>
            <label className="label">Название</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Описание</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Категория</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Приоритет</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as Priority })
                }
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Время</label>
            <input
              type="time"
              className="input"
              value={form.due_time}
              onChange={(e) => setForm({ ...form, due_time: e.target.value })}
            />
          </div>
          <button className="btn-primary w-full py-3">Добавить</button>
        </form>
      </Modal>
    </div>
  );
}
