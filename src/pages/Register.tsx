import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/auth";
import { CHARACTERS, CharacterId } from "../data/characters";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [challengeStart, setChallengeStart] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [characterId, setCharacterId] = useState<CharacterId>("luffy");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Пароль минимум 6 символов");
    if (password !== confirm) return setError("Пароли не совпадают");
    if (username.length < 2) return setError("Username минимум 2 символа");
    setLoading(true);
    try {
      await signUp(email, password, username, challengeStart, characterId);
      nav("/");
    } catch (e: any) {
      setError(e.message ?? "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card max-w-lg w-full space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          Начать WINTER ARC
        </h1>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            {error}
          </div>
        )}

        <div>
          <label className="label">Username (Имя пользователя)</label>
          <input
            className="input"
            placeholder="Например: Azamova"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p className="text-xs text-muted mt-1">
            Придумайте никнейм (латиницей, минимум 2 символа).
          </p>
        </div>

        <div>
          <label className="label">Email (Почта)</label>
          <input
            type="email"
            className="input"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted mt-1">Введите действующую почту.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Пароль</label>
            <input
              type="password"
              className="input"
              placeholder="winter2026"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Повтор</label>
            <input
              type="password"
              className="input"
              placeholder="winter2026"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>
        <p className="text-xs text-muted -mt-2">
          Пароль на английском, минимум 6 символов.
        </p>

        <div>
          <label className="label">Дата начала челленджа</label>
          <input
            type="date"
            className="input"
            value={challengeStart}
            onChange={(e) => setChallengeStart(e.target.value)}
            required
          />
          <p className="text-xs text-muted mt-1">
            С какого дня начинается ваш путь.
          </p>
        </div>

        <div>
          <label className="label">Выбери персонажа</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
              <button
                type="button"
                key={id}
                onClick={() => setCharacterId(id)}
                className={`p-3 rounded-xl border text-sm transition ${characterId === id ? "border-accent bg-accent/10" : "border-white/10 bg-white/5"}`}
              >
                <div className="font-medium">{CHARACTERS[id].name}</div>
                <div className="text-xs text-muted">
                  {CHARACTERS[id].fullName}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">
            Ваш аниме-компаньон на 92 дня.
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={loading}
        >
          {loading ? "Создаю…" : "Создать аккаунт"}
        </button>

        <div className="text-center text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-accent">
            Войти
          </Link>
        </div>
      </form>
    </div>
  );
}
