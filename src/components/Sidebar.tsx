import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Repeat,
  Calendar,
  User,
  Target,
  Timer,
  StickyNote,
  BarChart3,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "../services/auth";

const items = [
  { to: "/", label: "Главная", icon: LayoutDashboard, end: true },
  { to: "/planner", label: "Планер", icon: ListTodo },
  { to: "/habits", label: "Привычки", icon: Repeat },
  { to: "/calendar", label: "Календарь", icon: Calendar },
  { to: "/character", label: "Персонаж", icon: User },
  { to: "/goals", label: "Цели", icon: Target },
  { to: "/focus", label: "Фокус", icon: Timer },
  { to: "/notes", label: "Заметки", icon: StickyNote },
  { to: "/stats", label: "Статистика", icon: BarChart3 },
  { to: "/achievements", label: "Достижения", icon: Trophy },
  { to: "/profile", label: "Профиль", icon: User },
  { to: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const content = (
    <>
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div>
          <div className="text-lg font-extrabold tracking-wide">WINTER ARC</div>
          <div className="text-xs text-muted">92-day discipline</div>
        </div>
        <button
          className="md:hidden btn-ghost !p-2"
          onClick={() => setOpen(false)}
        >
          <X size={16} />
        </button>
      </div>
      <nav className="p-3 flex-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all text-sm
               ${isActive ? "bg-accent/15 text-accent border border-accent/30" : "text-muted hover:text-text hover:bg-white/5"}`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button className="btn-ghost w-full" onClick={() => signOut()}>
          <LogOut size={16} /> Выйти
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-40 btn-ghost !p-2"
        onClick={() => setOpen(true)}
      >
        <Menu size={18} />
      </button>
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-white/10 bg-card/40 backdrop-blur-xl z-30">
        {content}
      </aside>
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-bg border-r border-white/10 flex flex-col">
            {content}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}







