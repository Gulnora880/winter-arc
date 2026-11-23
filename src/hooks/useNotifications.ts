import { useEffect } from "react";
import { listNotifications } from "../services/notifications";

export function useNotifications(userId?: string) {
  useEffect(() => {
    if (!userId || !("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission();

    let timers: number[] = [];
    (async () => {
      const list = await listNotifications(userId);
      const enabled = list.filter((n) => n.enabled);
      enabled.forEach((n) => {
        const [hh, mm] = n.time_of_day.split(":").map(Number);
        const now = new Date();
        const t = new Date();
        t.setHours(hh, mm, 0, 0);
        if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1);
        const delay = t.getTime() - now.getTime();
        const id = window.setTimeout(() => {
          if (Notification.permission === "granted")
            new Notification(n.title, { body: n.body || "WINTER ARC" });
        }, delay);
        timers.push(id);
      });
    })();

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [userId]);
}
