import { supabase } from "../lib/supabase";
import type { Goal } from "../types";

export async function listGoals(userId: string) {
  const { data } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data || []) as Goal[];
}

export async function createGoal(g: Omit<Goal, "id" | "user_id">) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("goals")
    .insert({ ...g, user_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function updateGoal(id: string, patch: Partial<Goal>) {
  await supabase.from("goals").update(patch).eq("id", id);
}

export async function deleteGoal(id: string) {
  await supabase.from("goals").delete().eq("id", id);
}
