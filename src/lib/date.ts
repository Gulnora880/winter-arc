export const today = () => new Date().toISOString().slice(0, 10);

export const dayOfChallenge = (startIso: string) => {
  const start = new Date(startIso + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.max(1, Math.min(92, diff));
};

export const fmtTime = (t?: string | null) => (t ? t.slice(0, 5) : "");

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const monthName = (y: number, m: number) =>
  new Date(y, m, 1).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

export const daysInMonth = (y: number, m: number) =>
  new Date(y, m + 1, 0).getDate();
