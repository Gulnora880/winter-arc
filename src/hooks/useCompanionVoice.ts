import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  rate: number;
  voiceName: string | null;
  quietHoursStart: number;
  quietHoursEnd: number;
}

const DEFAULT: VoiceSettings = {
  enabled: false,
  volume: 0.7,
  rate: 1.0,
  voiceName: null,
  quietHoursStart: 22,
  quietHoursEnd: 8,
};

export function useCompanionVoice() {
  const { profile, user, refresh } = useAuth();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastSpoken = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  const settings: VoiceSettings = {
    enabled: profile?.voice_enabled ?? false,
    volume: profile?.voice_volume ?? 0.7,
    rate: profile?.voice_rate ?? 1.0,
    voiceName: profile?.voice_name ?? null,
    quietHoursStart: profile?.voice_quiet_start ?? 22,
    quietHoursEnd: profile?.voice_quiet_end ?? 8,
  };

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      const v = window.speechSynthesis
        .getVoices()
        .filter((x) => x.lang.startsWith("ru") || x.lang.startsWith("en"));
      setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const inQuiet = useCallback(() => {
    const h = new Date().getHours();
    const s = settings.quietHoursStart,
      e = settings.quietHoursEnd;
    return s < e ? h >= s && h < e : h >= s || h < e;
  }, [settings.quietHoursStart, settings.quietHoursEnd]);

  const speak = useCallback(
    (text: string) => {
      if (!settings.enabled || !("speechSynthesis" in window)) return;
      if (inQuiet()) return;
      const now = Date.now();
      if (
        lastSpoken.current.text === text &&
        now - lastSpoken.current.at < 6000
      )
        return;
      lastSpoken.current = { text, at: now };
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.volume = settings.volume;
      u.rate = settings.rate;
      const pick =
        voices.find(
          (v) => v.name === settings.voiceName && v.lang.startsWith("ru"),
        ) ??
        voices.find((v) => v.lang.startsWith("ru")) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (pick) {
        u.voice = pick;
        u.lang = pick.lang;
      }
      window.speechSynthesis.speak(u);
    },
    [settings, voices, inQuiet],
  );

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const updateVoice = useCallback(
    async (patch: Partial<VoiceSettings>) => {
      if (!user) return;
      const dbPatch: any = {};
      if (patch.enabled !== undefined) dbPatch.voice_enabled = patch.enabled;
      if (patch.volume !== undefined) dbPatch.voice_volume = patch.volume;
      if (patch.rate !== undefined) dbPatch.voice_rate = patch.rate;
      if (patch.voiceName !== undefined) dbPatch.voice_name = patch.voiceName;
      if (patch.quietHoursStart !== undefined)
        dbPatch.voice_quiet_start = patch.quietHoursStart;
      if (patch.quietHoursEnd !== undefined)
        dbPatch.voice_quiet_end = patch.quietHoursEnd;
      await supabase.from("profiles").update(dbPatch).eq("id", user.id);
      await refresh();
    },
    [user, refresh],
  );

  return { settings, voices, speak, stop, updateVoice, inQuiet };
}
