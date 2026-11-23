export const XP_TASK = 10;
export const XP_HABIT = 15;
export const XP_PERFECT_DAY_BONUS = 25;
export const XP_PER_LEVEL = 100;

export const levelFromXp = (xp: number) =>
  Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);

export const xpProgress = (xp: number) => {
  const level = levelFromXp(xp);
  const into = xp % XP_PER_LEVEL;
  const pct = (into / XP_PER_LEVEL) * 100;
  return { level, into, pct, next: XP_PER_LEVEL - into };
};
