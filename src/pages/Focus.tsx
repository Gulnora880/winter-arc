import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useCompanion } from "../hooks/useCompanion";
import { useAuth } from "../hooks/useAuth";

const SOUND_KEY = "wa.focus.sound";

export default function Focus() {
  const { user } = useAuth();
  const companion = useCompanion(user?.id);
  const [work, setWork] = useState(25);
  const [brk, setBrk] = useState(5);
  const [long, setLong] = useState(15);
  const [mode, setMode] = useState<"work" | "break" | "long">("work");
  const [secondsLeft, setSecondsLeft] = useState(work * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundOn, setSoundOn] = useState(
    () => localStorage.getItem(SOUND_KEY) === "1",
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0");
  }, [soundOn]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          beep();
          setRunning(false);
          if (mode === "work") {
            const newSessions = sessions + 1;
            setSessions(newSessions);
            companion.trigger("focusDone");
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, sessions, companion]);

  function start() {
    if (secondsLeft === 0) resetTo(mode);
    companion.trigger("focusStart");
    setRunning(true);
  }
  function resetTo(m: "work" | "break" | "long") {
    setMode(m);
    setRunning(false);
    const mins = m === "work" ? work : m === "break" ? brk : long;
    setSecondsLeft(mins * 60);
  }

  // Встроенный звук (генерируется кодом, файл не нужен)
  function beep() {
    if (!soundOn) return;
    try {
      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 660;
      o.type = "sine";
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      o.start();
      o.stop(ctx.currentTime + 0.8);
    } catch {}
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const total = (mode === "work" ? work : mode === "break" ? brk : long) * 60;
  const pct = total ? ((total - secondsLeft) / total) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Focus Mode</h1>
      <div className="card flex flex-col items-center py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: `radial-gradient(circle at center, rgba(128,191,255,${0.05 + pct / 500}), transparent 60%)`,
          }}
        />
        <div className="relative z-10 text-center">
          <div className="text-sm text-muted mb-2 uppercase tracking-widest">
            {mode === "work"
              ? "Focus"
              : mode === "break"
                ? "Short break"
                : "Long break"}
          </div>
          <div className="text-[120px] md:text-[180px] leading-none font-extrabold tabular-nums">
            {mm}:{ss}
          </div>
          <div className="h-2 w-64 max-w-full mx-auto bg-white/10 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              className="btn-primary px-6 py-3"
              onClick={() => (running ? setRunning(false) : start())}
            >
              {running ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> Start
                </>
              )}
            </button>
            <button
              className="btn-ghost px-4 py-3"
              onClick={() => resetTo(mode)}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="card">
          <div className="text-sm text-muted mb-2">Работа (мин)</div>
          <input
            type="number"
            min={1}
            max={90}
            className="input"
            value={work}
            onChange={(e) => {
              const v = +e.target.value;
              setWork(v);
              if (mode === "work" && !running) setSecondsLeft(v * 60);
            }}
          />
        </div>
        <div className="card">
          <div className="text-sm text-muted mb-2">Короткий отдых</div>
          <input
            type="number"
            min={1}
            max={30}
            className="input"
            value={brk}
            onChange={(e) => {
              const v = +e.target.value;
              setBrk(v);
              if (mode === "break" && !running) setSecondsLeft(v * 60);
            }}
          />
        </div>
        <div className="card">
          <div className="text-sm text-muted mb-2">Длинный отдых</div>
          <input
            type="number"
            min={1}
            max={60}
            className="input"
            value={long}
            onChange={(e) => {
              const v = +e.target.value;
              setLong(v);
              if (mode === "long" && !running) setSecondsLeft(v * 60);
            }}
          />
        </div>
      </div>

      <div className="card flex items-center justify-between">
        <div>
          Завершено сессий: <b>{sessions}</b>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={soundOn}
            onChange={(e) => setSoundOn(e.target.checked)}
          />{" "}
          Звук
        </label>
      </div>

      <div className="flex gap-2">
        <button className="btn-ghost" onClick={() => resetTo("work")}>
          Focus 25
        </button>
        <button className="btn-ghost" onClick={() => resetTo("break")}>
          Break 5
        </button>
        <button className="btn-ghost" onClick={() => resetTo("long")}>
          Long 15
        </button>
      </div>
    </div>
  );
}
