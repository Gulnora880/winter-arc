export function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`h-2.5 w-full bg-white/10 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-sky-300 transition-all duration-500 shadow-[0_0_20px_rgba(128,191,255,0.6)]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
