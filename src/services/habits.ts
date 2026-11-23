import { supabase } from "../lib/supabase";
import type { Habit, HabitRecord } from "../types";

export async function listHabits(userId: string) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at");
  if (error) throw error;
  return data as Habit[];
}

export async function createHabit(
  h: Omit<Habit, "id" | "created_at" | "user_id">,
) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("habits")
    .insert({ ...h, user_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Habit;
}

export async function deleteHabit(id: string) {
  await supabase.from("habits").delete().eq("id", id);
}

export async function getRecordsForRange(
  userId: string,
  from: string,
  to: string,
) {
  const { data } = await supabase
    .from("habit_records")
    .select("*")
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to);
  return (data || []) as HabitRecord[];
}

export async function toggleHabit(
  habitId: string,
  userId: string,
  date: string,
  completed: boolean,
) {
  const { data: existing } = await supabase
    .from("habit_records")
    .select("id")
    .eq("habit_id", habitId)
    .eq("date", date)
    .maybeSingle();
  if (existing) {
    await supabase
      .from("habit_records")
      .update({ completed })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("habit_records")
      .insert({ habit_id: habitId, user_id: userId, date, completed });
  }
}
