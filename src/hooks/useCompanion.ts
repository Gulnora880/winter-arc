import { useCallback, useEffect, useRef, useState } from "react";
import type { CompanionState } from "../data/characters";
import { pickPhrase } from "../data/companion-phrases";
import { useCompanionVoice } from "./useCompanionVoice";

export type CompanionEvent =
  | "welcome"
  | "taskStart"
  | "taskDone"
  | "allTasksDone"
  | "levelUp"
  | "missed"
  | "returnAfterLongAbsence"
  | "focusStart"
  | "focusDone"
  | "habitDone"
  | "achievement"
  | "motivation"
  | "streak";

export function useCompanion(userId?: string) {
  const [state, setState] = useState<CompanionState>("idle");
  const [lastMessage, setLastMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const voice = useCompanionVoice();

  const setTransient = useCallback((s: CompanionState, ms = 4000) => {
    setState(s);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setState("idle"), ms);
  }, []);

  const trigger = useCallback(
    (event: CompanionEvent) => {
      const phrase = pickPhrase(event);
      setLastMessage(phrase.text);
      setTransient(
        phrase.state,
        event === "levelUp" ||
          event === "allTasksDone" ||
          event === "achievement"
          ? 6000
          : 4000,
      );
      setVisible(true);
      voice.speak(phrase.text);
      window.setTimeout(() => setVisible(false), 5500);
    },
    [setTransient, voice],
  );

  const welcomed = useRef(false);
  useEffect(() => {
    if (!userId || welcomed.current) return;
    welcomed.current = true;
    const t = window.setTimeout(() => trigger("welcome"), 1200);
    return () => window.clearTimeout(t);
  }, [userId, trigger]);

  return {
    state,
    message: lastMessage,
    messageVisible: visible,
    trigger,
    voice,
  };
}
