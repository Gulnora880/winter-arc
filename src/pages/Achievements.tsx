import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  listAllAchievements,
  listUserAchievements,
  checkAchievements,
} from "../services/achievements";

export default function Achievements() {
  const { user, progress } = useAuth();
  const [all, setAll] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);

  async function load() {
    const [a, m] = await Promise.all([
      listAllAchievements(),
      user ? listUserAchievements(user.id) : [],
    ]);
    setAll(a);
    setMine(m);
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [user?.id]);

  useEffect(() => {
    if (user && progress) {
      checkAchievements(
        user.id,
        progress.total_tasks_done,
        progress.active_days,
        0,
      ).then(load);
    }
    /* eslint-disable-next-line */
  }, [progress?.total_tasks_done, progress?.active_days]);

  const owned = new Set(mine.map((m) => m.achievement_id));

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Achievements</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {all.map((a) => {
          const got = owned.has(a.id);
          return (
            <div
              key={a.id}
              className={`card relative ${got ? "ring-2 ring-accent/60" : "opacity-70"}`}
            >
              <div className="text-4xl mb-2">{a.icon}</div>
              <div className="font-semibold">{a.name}</div>
              <div className="text-sm text-muted">{a.description}</div>
              <div className="text-xs mt-2">
                {got ? (
                  <span className="text-green-400">✓ Разблокировано</span>
                ) : (
                  <span className="text-muted">
                    Условие: {a.condition_type} ≥ {a.condition_value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
