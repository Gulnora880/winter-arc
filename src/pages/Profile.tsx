import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../services/profile";
import { CHARACTERS, CharacterId } from "../data/characters";
import { AnimeCompanion } from "../components/companion/AnimeCompanion";
import { fmtDate } from "../lib/date";

export default function Profile() {
  const { profile, progress, user, refresh } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? "");
  const [characterId, setCharacterId] = useState(
    profile?.character_id ?? "luffy",
  );
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [saved, setSaved] = useState(false);

  async function save() {
    if (!user) return;
    await updateProfile(user.id, {
      username,
      character_id: characterId,
      avatar_url: avatarUrl || null,
    });
    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <AnimeCompanion />
        </div>
        <div className="lg:col-span-2 card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={profile?.email ?? ""} disabled />
            </div>
            <div>
              <label className="label">Аватар URL</label>
              <input
                className="input"
                value={avatarUrl ?? ""}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Персонаж</label>
              <select
                className="input"
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
              >
                {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
                  <option key={id} value={id}>
                    {CHARACTERS[id].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs text-muted">
            Регистрация:{" "}
            {profile?.created_at ? fmtDate(profile.created_at) : "—"} ·
            Challenge start: {profile?.challenge_start ?? "—"}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-white/5">
              XP: <b>{progress?.xp ?? 0}</b>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              Level: <b>{progress?.level ?? 1}</b>
            </div>
          </div>
          <button className="btn-primary" onClick={save}>
            {saved ? "✓ Сохранено" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
