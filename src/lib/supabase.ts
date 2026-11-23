import { createClient } from "@supabase/supabase-js";

const RAW_URL = "https://xzonuxmjhdpzdndxtcvk.supabase.co";
const RAW_KEY = "сюда_вставьте_ключ_начинающийся_на_eyJ";

function cleanEnv(str: string) {
  return str.replace(/[^\x20-\x7E]/g, "").trim();
}

const url = cleanEnv(RAW_URL);
const key = cleanEnv(RAW_KEY);

export const supabase = createClient(url, key);
