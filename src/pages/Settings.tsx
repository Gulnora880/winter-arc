import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../services/profile";
import { supabase } from "../lib/supabase";
import { signOut } from "../services/auth";
import {
  listNotifications,
  createNotification,
  deleteNotification,
  toggleNotification,
} from "../services/notifications";
import { useEffect } from "react";
import type { NotificationSchedule } from "../types";

export default function Settings() {
  const { profile, user, refresh } = useAuth();
  const [theme, setTheme] = useState(profile?.theme ?? "dark");
  const [snow, setSnow] = useState(profile?.snow_enabled ?? true);
  const [sound, setSound] = useState(profile?.sound_enabled ?? true);
  const [notif, setNotif] = useState(profile?.notifications_enabled ?? true);
  const [challengeStart, setChallengeStart] = useState(
    profile?.challenge_start ?? "",
  );
  const [newPassword, setNewPassword] = useState("");
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([]);
  const [nTitle, setNTitle] = useState("");
  const [nTime, setNTime] = useState("09:00");
  const [nBody, setNBody] = useState("");

  useEffect(() => {
    if (profile) {
      setTheme(profile.theme);
      setSnow(profile.snow_enabled);
      setSound(profile.sound_enabled);
      setNotif(profile.notifications_enabled);
      setChallengeStart(profile.challenge_start);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (user) listNotifications(user.id).then(setSchedules);
  }, [user?.id]);

  async function save() {
    if (!user) return;
    await updateProfile(user.id, {
      theme: theme as any,
      snow_enabled: snow,
      sound_enabled: sound,
      notifications_enabled: notif,
      challenge_start: challengeStart,
    });
    await refresh();
  }

  async function changePassword() {
    if (newPassword.length < 6) return alert("Минимум 6 символов");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message);
    else {
      alert("Пароль обновлён");
      setNewPassword("");
    }
  }

  async function addSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!nTitle.trim()) return;
    await createNotification({
      title: nTitle,
      body: nBody,
      time_of_day: nTime,
    });
    setNTitle("");
    setNBody("");
    if (user) setSchedules(await listNotifications(user.id));
  }
  async function removeSchedule(id: string) {
    await deleteNotification(id);
    if (user) setSchedules(await listNotifications(user.id));
  }
  async function toggleSched(s: NotificationSchedule) {
    await toggleNotification(s.id, !s.enabled);
    if (user) setSchedules(await listNotifications(user.id));
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card space-y-3">
        <h2 className="font-semibold">Внешний вид</h2>
        <div className="flex items-center justify-between">
          <label>Тема</label>
          <select
            className="input max-w-[200px]"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="dark">Тёмная</option>
            <option value="light">Светлая</option>
          </select>
        </div>
        <label className="flex items-center justify-between">
          <span>Снег</span>
          <input
            type="checkbox"
            checked={snow}
            onChange={(e) => setSnow(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between">
          <span>Звуки</span>
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between">
          <span>Уведомления</span>
          <input
            type="checkbox"
            checked={notif}
            onChange={(e) => setNotif(e.target.checked)}
          />
        </label>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Челлендж</h2>
        <div className="flex items-center justify-between">
          <label>Дата начала</label>
          <input
            type="date"
            className="input max-w-[200px]"
            value={challengeStart}
            onChange={(e) => setChallengeStart(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={save}>
          Сохранить
        </button>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Пароль</h2>
        <input
          type="password"
          className="input"
          placeholder="Новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="btn-ghost" onClick={changePassword}>
          Изменить пароль
        </button>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Расписание напоминаний</h2>
        <form
          onSubmit={addSchedule}
          className="grid md:grid-cols-[1fr_1fr_auto] gap-2"
        >
          <input
            className="input"
            placeholder="Заголовок"
            value={nTitle}
            onChange={(e) => setNTitle(e.target.value)}
          />
          <input
            className="input"
            type="time"
            value={nTime}
            onChange={(e) => setNTime(e.target.value)}
          />
          <button className="btn-primary">Добавить</button>
        </form>
        <div className="space-y-2">
          {schedules.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5"
            >
              <div>
                <b>{s.time_of_day}</b> · {s.title}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-ghost !p-1 !px-2 text-xs"
                  onClick={() => toggleSched(s)}
                >
                  {s.enabled ? "On" : "Off"}
                </button>
                <button
                  className="btn-danger !p-1 !px-2 text-xs"
                  onClick={() => removeSchedule(s.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">
          Напоминания работают, пока вкладка открыта. Для фоновых
          push-уведомлений нужен service worker + push-сервер (VAPID). Базовые
          локальные — работают из коробки.
        </p>
      </div>

      <div className="card">
        <button className="btn-danger" onClick={() => signOut()}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
