import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!url || !key) {
  throw new Error(
    `Supabase configuration missing: URL=${Boolean(url)}, KEY=${Boolean(key)}`,
  );
}

export const supabase = createClient(url, key);
