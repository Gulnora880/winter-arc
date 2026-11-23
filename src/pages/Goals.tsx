import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../services/goals";
import type { Goal } from "../types";
import { Modal } from "../components/Modal";
import { ProgressBar } from "../components/ProgressBar";
import { Plus, Trash2 } from "lucide-react";

const TIMEFRAMES = ["day", "week", "month", "92days"] as const;

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    timeframe: (typeof TIMEFRAMES)[number];
    deadline: string;
  }>({
    title: "",
    description: "",
    timeframe: "month",
    deadline: "",
  });

  async function load() {
    if (user) setGoals(await listGoals(user.id));
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [user?.id]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await createGoal({
      title: form.title.trim(),
      description: form.description,
      timeframe: form.timeframe,
      deadline: form.deadline || undefined,
      progress: 0,
      status: "active",
    });
    setForm({ title: "", description: "", timeframe: "month", deadline: "" });
    setOpen(false);
    await load();
  }

  async function bump(g: Goal, delta: number) {
    const p = Math.max(0, Math.min(100, g.progress + delta));
    await updateGoal(g.id, { progress: p });
    await load();
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goals</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> Новая цель
        </button>
      </div>

      {goals.length === 0 && (
        <div className="card text-muted text-center py-10">Пока нет целей.</div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {goals.map((g) => (
          <div key={g.id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold">{g.title}</div>
                <div className="text-xs text-muted">
                  {g.timeframe}
                  {g.deadline ? ` · до ${g.deadline}` : ""}
                </div>
              </div>
              <button
                className="btn-ghost !p-2"
                onClick={() => deleteGoal(g.id).then(load)}
              >
                <Trash2 size={14} />
              </button>
            </div>
            {g.description && (
              <p className="text-sm text-muted mb-3">{g.description}</p>
            )}
            <ProgressBar value={g.progress} />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted">{g.progress}%</span>
              <div className="flex gap-1">
                <button
                  className="btn-ghost !p-1 !px-2 text-xs"
                  onClick={() => bump(g, -10)}
                >
                  −10
                </button>
                <button
                  className="btn-ghost !p-1 !px-2 text-xs"
                  onClick={() => bump(g, 10)}
                >
                  +10
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Новая цель">
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
              <label className="label">Срок</label>
              <select
                className="input"
                value={form.timeframe}
                onChange={(e) =>
                  setForm({ ...form, timeframe: e.target.value as any })
                }
              >
                {TIMEFRAMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Дедлайн</label>
              <input
                type="date"
                className="input"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>
          <button className="btn-primary w-full py-3">Создать</button>
        </form>
      </Modal>
    </div>
  );
}
