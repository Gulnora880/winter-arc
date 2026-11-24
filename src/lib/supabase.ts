import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

console.log("URL exists:", Boolean(url));
console.log(
  "URL format:",
  url.startsWith("https://") && url.endsWith(".supabase.co"),
);
console.log("Key exists:", Boolean(key));
console.log("Key ASCII:", /^[\x00-\x7F]*$/.test(key));
console.log(
  "Key type:",
  key.startsWith("sb_publishable_")
    ? "publishable"
    : key.startsWith("eyJ")
      ? "legacy anon"
      : "unknown",
);

export const supabase = createClient(url, key);
