import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await resetPassword(email);
      setMsg("Письмо со ссылкой отправлено. Проверьте почту.");
    } catch (e: any) {
      setError(e.message ?? "Ошибка");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Восстановление пароля
        </h1>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {msg && <div className="text-green-400 text-sm">{msg}</div>}
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
        <button className="btn-primary w-full py-3">Отправить ссылку</button>
        <div className="text-center text-sm text-muted">
          <Link to="/login" className="text-accent">
            Вернуться к входу
          </Link>
        </div>
      </form>
    </div>
  );
}
