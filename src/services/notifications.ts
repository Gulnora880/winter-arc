import { supabase } from "../lib/supabase";
import type { NotificationSchedule } from "../types";

export async function listNotifications(userId: string) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("time_of_day");
  return (data || []) as NotificationSchedule[];
}

export async function createNotification(n: {
  title: string;
  body?: string;
  time_of_day: string;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("notifications")
    .insert({ ...n, user_id: u.user.id });
  if (error) throw error;
}

export async function deleteNotification(id: string) {
  await supabase.from("notifications").delete().eq("id", id);
}

export async function toggleNotification(id: string, enabled: boolean) {
  await supabase.from("notifications").update({ enabled }).eq("id", id);
}
