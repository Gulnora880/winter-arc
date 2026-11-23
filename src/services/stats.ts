import { supabase } from "../lib/supabase";

export async function getDailyProgressRange(
  userId: string,
  from: string,
  to: string,
) {
  const { data } = await supabase
    .from("daily_progress")
    .select("*")
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to)
    .order("date");
  return data || [];
}

export async function getXpHistory(userId: string, limit = 60) {
  const { data } = await supabase
    .from("xp_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function upsertDailyProgress(
  userId: string,
  date: string,
  patch: {
    tasks_done?: number;
    tasks_total?: number;
    habits_done?: number;
    habits_total?: number;
    xp_earned?: number;
  },
) {
  const { data } = await supabase
    .from("daily_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (data) {
    await supabase
      .from("daily_progress")
      .update(patch)
      .eq("user_id", userId)
      .eq("date", date);
  } else {
    await supabase
      .from("daily_progress")
      .insert({ user_id: userId, date, ...patch });
  }
}
