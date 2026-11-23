import { supabase } from "../lib/supabase";

export async function signUp(
  email: string,
  password: string,
  username: string,
  challengeStart: string,
  characterId: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        challenge_start: challengeStart,
        character_id: characterId,
      },
    },
  });
  if (error) throw error;
  // update profile with extra info (trigger already created it)
  if (data.user) {
    await supabase
      .from("profiles")
      .update({
        challenge_start: challengeStart,
        character_id: characterId,
      })
      .eq("id", data.user.id);
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });
  if (error) throw error;
}
