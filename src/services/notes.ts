import { supabase } from "../lib/supabase";
import type { Note } from "../types";

export async function listNotes(userId: string) {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return (data || []) as Note[];
}

export async function createNote(n: { title: string; content: string }) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("notes")
    .insert({ ...n, user_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: string, patch: Partial<Note>) {
  await supabase
    .from("notes")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteNote(id: string) {
  await supabase.from("notes").delete().eq("id", id);
}
