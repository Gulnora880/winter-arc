import { supabase } from "../lib/supabase";

export async function listAllAchievements() {
  const { data } = await supabase.from("achievements").select("*").order("id");
  return data || [];
}

export async function listUserAchievements(userId: string) {
  const { data } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId);
  return data || [];
}

export async function unlock(userId: string, achievementId: string) {
  const { error } = await supabase
    .from("user_achievements")
    .insert({ user_id: userId, achievement_id: achievementId });
  return !error;
}

export async function checkAchievements(
  userId: string,
  totalTasks: number,
  activeDays: number,
  perfectDays: number,
) {
  const checks = [
    { id: "first_step", cond: totalTasks >= 1 },
    { id: "seven_days", cond: activeDays >= 7 },
    { id: "thirty_days", cond: activeDays >= 30 },
    { id: "fifty_tasks", cond: totalTasks >= 50 },
    { id: "perfect_day", cond: perfectDays >= 1 },
  ];
  const unlocked: string[] = [];
  for (const c of checks)
    if (c.cond) {
      if (await unlock(userId, c.id)) unlocked.push(c.id);
    }
  return unlocked;
}
