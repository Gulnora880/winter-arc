import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { listTasks, updateTask } from "../services/tasks";
import {
  listHabits,
  getRecordsForRange,
  toggleHabit,
} from "../services/habits";
import { awardXP, touchActiveDay } from "../services/profile";
import { upsertDailyProgress } from "../services/stats";
import { checkAchievements } from "../services/achievements";
import { XP_TASK, XP_HABIT, XP_PERFECT_DAY_BONUS } from "../lib/xp";
import {
  today as todayStr,
  dayOfChallenge,
  fmtDate,
  fmtTime,
} from "../lib/date";
import { quoteOfDay } from "../data/quotes";
import type { Task, Habit, HabitRecord } from "../types";
import { ProgressBar } from "../components/ProgressBar";
import { AnimeCompanion } from "../components/companion/AnimeCompanion";
import { useCompanion } from "../hooks/useCompanion";
import { LevelUpToast } from "../components/LevelUpToast";
import { Check, Clock, Flame } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { playCharacterSound, playSound } from "../assets/sounds"; // ⬅️ ИМПОРТ ЗВУКОВ

export default function Dashboard() {
  const { user, profile, progress, refresh } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [levelToast, setLevelToast] = useState<number | null>(null);
  const companion = useCompanion(user?.id);
  const [now, setNow] = useState(new Date());
  const today = todayStr();

  useNotifications(user?.id);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);

  async function load() {
    if (!user) return;
    const [t, h, r] = await Promise.all([
      listTasks(user.id, today),
      listHabits(user.id),
      getRecordsForRange(user.id, today, today),
    ]);
    setTasks(t);
    setHabits(h);
    setRecords(r);
    await touchActiveDay(user.id);
    await refresh();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [user?.id]);

  const tasksDone = tasks.filter((t) => t.completed).length;
  const habitsDone = habits.filter((h) =>
    records.find((r) => r.habit_id === h.id && r.completed),
  ).length;
  const tasksPct = tasks.length ? (tasksDone / tasks.length) * 100 : 0;
  const habitsPct = habits.length ? (habitsDone / habits.length) * 100 : 0;

  async function toggleTask(t: Task) {
    const nowCompleted = !t.completed;
    await updateTask(t.id, {
      completed: nowCompleted,
      completed_at: nowCompleted ? new Date().toISOString() : null,
    });

    if (nowCompleted) {
      const p = await awardXP(user!.id, XP_TASK, "task");
      setTasks((prev) =>
        prev.map((x) => (x.id === t.id ? { ...x, completed: true } : x)),
      );

      // ⬇️ ЗВУК ПЕРСОНАЖА ПРИ ВЫПОЛНЕНИИ ЗАДАЧИ
      playCharacterSound((profile?.character_id as any) || "luffy");

      companion.trigger("taskDone");
      const newDone = tasksDone + 1;
      await upsertDailyProgress(user!.id, today, {
        tasks_done: newDone,
        tasks_total: tasks.length,
      });
      await checkAchievements(
        user!.id,
        p.total_tasks_done + 1,
        p.active_days,
        0,
      );

      if (newDone === tasks.length && tasks.length > 0) {
        const p2 = await awardXP(user!.id, XP_PERFECT_DAY_BONUS, "perfect_day");
        if (p2.level > p.level) {
          setLevelToast(p2.level);
          playSound("level"); // ⬅️ ЗВУК ПОВЫШЕНИЯ УРОВНЯ
        }
        companion.trigger("allTasksDone");
      }
      if (p.level > (progress?.level ?? 1)) {
        setLevelToast(p.level);
        playSound("level"); // ⬅️ ЗВУК ПОВЫШЕНИЯ УРОВНЯ
      }
      await refresh();
    } else {
      await updateTask(t.id, { completed: false, completed_at: null });
      setTasks((prev) =>
        prev.map((x) => (x.id === t.id ? { ...x, completed: false } : x)),
      );
    }
  }

  async function toggleHabitDone(h: Habit) {
    if (!user) return;
    const rec = records.find((r) => r.habit_id === h.id);
    const nowCompleted = !rec?.completed;
    await toggleHabit(h.id, user.id, today, nowCompleted);

    if (nowCompleted) {
      const p = await awardXP(user.id, XP_HABIT, "habit");
      // ⬇️ ЗВУК ПЕРСОНАЖА ПРИ ВЫПОЛНЕНИИ ПРИВЫЧКИ
      playCharacterSound((profile?.character_id as any) || "luffy");
      companion.trigger("habitDone");
      if (p.level > (progress?.level ?? 1)) {
        setLevelToast(p.level);
        playSound("level"); // ⬅️ ЗВУК ПОВЫШЕНИЯ УРОВНЯ
      }
    }
    const updated = await getRecordsForRange(user.id, today, today);
    setRecords(updated);
    await refresh();
  }

  const day = profile ? dayOfChallenge(profile.challenge_start) : 1;
  const challengePct = (day / 92) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {levelToast && (
        <LevelUpToast level={levelToast} onClose={() => setLevelToast(null)} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            WINTER <span className="text-accent">ARC</span>
          </h1>
          <p className="text-muted text-sm">
            Привет, {profile?.username}. {fmtDate(now.toISOString())},{" "}
            {now.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="card !p-3 !px-5 text-right">
          <div className="text-xs text-muted">DAY</div>
          <div className="text-2xl font-bold">
            <span className="text-accent">{day}</span> / 92
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted">Прогресс челленджа</span>
          <span>{Math.round(challengePct)}%</span>
        </div>
        <ProgressBar value={challengePct} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-muted">XP</div>
          <div className="text-2xl font-bold">{progress?.xp ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-xs text-muted">Уровень</div>
          <div className="text-2xl font-bold">{progress?.level ?? 1}</div>
        </div>
        <div className="card">
          <div className="text-xs text-muted flex items-center gap-1">
            <Flame size={14} /> Streak
          </div>
          <div className="text-2xl font-bold">{progress?.best_streak ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-xs text-muted">Активных дней</div>
          <div className="text-2xl font-bold">{progress?.active_days ?? 0}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-1">
          <h2 className="font-semibold mb-3">Цитата дня</h2>
          <p className="text-muted italic">«{quoteOfDay()}»</p>
        </div>

        <div className="lg:col-span-2">
          <AnimeCompanion />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Задачи на сегодня</h2>
            <span className="text-xs text-muted">
              {tasksDone}/{tasks.length}
            </span>
          </div>
          <ProgressBar value={tasksPct} className="mb-4" />
          {tasks.length === 0 ? (
            <p className="text-muted text-sm">
              Пока нет задач. Добавьте через Daily Planner.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <button
                    onClick={() => toggleTask(t)}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition ${
                      t.completed
                        ? "bg-accent border-accent text-bg"
                        : "border-white/20"
                    }`}
                  >
                    {t.completed && <Check size={14} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium ${
                        t.completed ? "line-through text-muted" : ""
                      }`}
                    >
                      {t.title}
                    </div>
                    <div className="text-xs text-muted flex gap-2">
                      {t.due_time && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {fmtTime(t.due_time)}
                        </span>
                      )}
                      <span>{t.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Привычки сегодня</h2>
            <span className="text-xs text-muted">
              {habitsDone}/{habits.length}
            </span>
          </div>
          <ProgressBar value={habitsPct} className="mb-4" />
          {habits.length === 0 ? (
            <p className="text-muted text-sm">
              Пока нет привычек. Добавьте на странице Habits.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {habits.map((h) => {
                const done = !!records.find(
                  (r) => r.habit_id === h.id && r.completed,
                );
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabitDone(h)}
                    className={`p-3 rounded-xl border text-left transition ${
                      done
                        ? "bg-accent/15 border-accent/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-lg">{h.icon}</div>
                    <div className="text-sm font-medium truncate">{h.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
