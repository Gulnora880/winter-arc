import { useAuth } from "../hooks/useAuth";

export function Snow() {
  const { profile } = useAuth();
  if (!profile?.snow_enabled) return null;
  const flakes = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {flakes.map((i) => {
        const size = 3 + (i % 5) * 2;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              width: size,
              height: size,
              left: `${(i * 37) % 100}%`,
              top: "-10vh",
              animation: `fall ${8 + (i % 6)}s linear infinite`,
              animationDelay: `${-(i % 10)}s`,
              opacity: 0.25 + (i % 4) * 0.15,
            }}
          />
        );
      })}
      <style>{`@keyframes fall { to { transform: translateY(120vh); } }`}</style>
    </div>
  );
}
