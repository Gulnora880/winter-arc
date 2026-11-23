import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function LevelUpToast({
  level,
  onClose,
}: {
  level: number;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 400);
    }, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none transition-opacity ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div className="card !bg-gradient-to-br !from-accent/30 !to-card text-center !p-10 animate-glow">
        <Sparkles
          size={48}
          className="text-accent mx-auto mb-4 animate-float"
        />
        <div className="text-2xl font-bold mb-2">LEVEL UP!</div>
        <div className="text-5xl font-extrabold text-accent">{level}</div>
      </div>
    </div>
  );
}
