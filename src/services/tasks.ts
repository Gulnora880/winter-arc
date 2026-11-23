import { supabase } from "../lib/supabase";
import type { Task } from "../types";

export async function listTasks(userId: string, date: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("due_date", date)
    .order("due_time", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data as Task[];
}

export async function listAllTasks(userId: string) {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: false });
  return (data || []) as Task[];
}

export async function createTask(
  payload: Omit<
    Task,
    "id" | "created_at" | "completed" | "completed_at" | "user_id"
  >,
) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...payload, user_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, patch: Partial<Task>) {
  const { error } = await supabase.from("tasks").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
