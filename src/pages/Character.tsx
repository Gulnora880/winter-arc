import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { AnimeCompanion } from "../components/companion/AnimeCompanion";
import { CHARACTERS, CharacterId } from "../data/characters";
import { updateProfile } from "../services/profile";
import { Modal } from "../components/Modal";

export default function CharacterPage() {
  const { profile, progress, user, refresh } = useAuth();
  const [open, setOpen] = useState(false);

  async function choose(id: CharacterId) {
    if (!user) return;
    await updateProfile(user.id, { character_id: id });
    await refresh();
    setOpen(false);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Character</h1>
        <button className="btn-ghost" onClick={() => setOpen(true)}>
          Сменить персонажа
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <AnimeCompanion />
        <div className="card space-y-3">
          <h2 className="font-semibold">Статистика персонажа</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-white/5">
              Уровень: <b>{progress?.level ?? 1}</b>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              XP: <b>{progress?.xp ?? 0}</b>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              Задач: <b>{progress?.total_tasks_done ?? 0}</b>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              Привычек: <b>{progress?.total_habits_done ?? 0}</b>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              Активных дней: <b>{progress?.active_days ?? 0}</b>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              Streak: <b>{progress?.best_streak ?? 0}</b>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Выбор персонажа">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
            <button
              key={id}
              onClick={() => choose(id)}
              className={`p-3 rounded-xl border text-sm ${profile?.character_id === id ? "border-accent bg-accent/10" : "border-white/10 bg-white/5"}`}
            >
              <div className="font-medium">{CHARACTERS[id].name}</div>
              <div className="text-xs text-muted">
                {CHARACTERS[id].fullName}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
