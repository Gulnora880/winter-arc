import { useMemo, useState } from "react";
import {
  Volume2,
  VolumeX,
  MessageCircle,
  Zap,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCompanion } from "../../hooks/useCompanion";
import { CHARACTERS, CharacterId, stageForLevel } from "../../data/characters";
import { CompanionAnimation } from "./CompanionAnimation";
import { CompanionReaction } from "./CompanionReaction";
import { CompanionSettings } from "./CompanionSettings";
import { CompanionProgression } from "./CompanionProgression";

export function AnimeCompanion({ compact = false }: { compact?: boolean }) {
  const { profile, progress, user } = useAuth();
  const companion = useCompanion(user?.id);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const characterId: CharacterId =
    (profile?.character_id as CharacterId) ?? "luffy";
  const character = CHARACTERS[characterId] ?? CHARACTERS.luffy;
  const xp = progress?.xp ?? 0;
  const level = progress?.level ?? 1;
  const stage = useMemo(
    () => stageForLevel(characterId, level),
    [characterId, level],
  );

  const size = compact ? 140 : 240;

  return (
    <div className="card relative flex flex-col items-center text-center overflow-visible">
      <div className="relative mb-3">
        <CompanionReaction
          text={companion.message}
          visible={companion.messageVisible}
        />
        <CompanionAnimation
          state={companion.state}
          stage={stage}
          characterColor={character.color}
          accentColor={stage.accent}
          size={size}
          onTap={() => companion.trigger("motivation")}
        />
      </div>

      <div className="font-semibold">{character.fullName}</div>
      <div className="text-xs text-muted mb-3">{stage.label}</div>

      <div className="w-full max-w-xs mb-4">
        <CompanionProgression character={character} stage={stage} xp={xp} />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          className="btn-ghost text-xs"
          onClick={() => companion.trigger("motivation")}
        >
          <Zap size={14} /> MOTIVATE ME
        </button>
        <button
          className="btn-ghost text-xs"
          onClick={() => companion.trigger("motivation")}
        >
          <MessageCircle size={14} /> TALK
        </button>
        <button
          className="btn-ghost text-xs"
          onClick={() =>
            companion.voice.updateVoice({
              enabled: !companion.voice.settings.enabled,
            })
          }
        >
          {companion.voice.settings.enabled ? (
            <Volume2 size={14} />
          ) : (
            <VolumeX size={14} />
          )}
          {companion.voice.settings.enabled ? "Звук вкл" : "Звук выкл"}
        </button>
        <button
          className="btn-ghost text-xs"
          onClick={() => setSettingsOpen(true)}
        >
          <SettingsIcon size={14} /> Голос
        </button>
      </div>

      <CompanionSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
