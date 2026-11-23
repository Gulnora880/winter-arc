import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      nav("/");
    } catch (e: any) {
      setError(e.message ?? "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          Войти в WINTER ARC
        </h1>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            {error}
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Пароль</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={loading}
        >
          {loading ? "Вхожу…" : "Войти"}
        </button>
        <div className="flex justify-between text-sm text-muted">
          <Link to="/forgot" className="hover:text-accent">
            Забыли пароль?
          </Link>
          <Link to="/register" className="hover:text-accent">
            Регистрация
          </Link>
        </div>
      </form>
    </div>
  );
}
