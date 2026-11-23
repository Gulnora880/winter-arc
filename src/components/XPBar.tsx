import { xpProgress } from "../lib/xp";
import { ProgressBar } from "./ProgressBar";

export function XPBar({ xp, level }: { xp: number; level?: number }) {
  const { into, pct, next, level: lvl } = xpProgress(xp);
  return (
    <div>
      <div className="flex justify-between text-xs text-muted mb-1">
        <span>Level {level ?? lvl}</span>
        <span>
          {into} / {into + next} XP
        </span>
      </div>
      <ProgressBar value={pct} />
    </div>
  );
}
