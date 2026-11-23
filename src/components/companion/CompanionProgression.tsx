import { xpProgress } from "../../services/companion";
import { ProgressBar } from "../ProgressBar";
import { CharacterDef, CharacterStage } from "../../data/characters";

export function CompanionProgression({
  character,
  stage,
  xp,
}: {
  character: CharacterDef;
  stage: CharacterStage;
  xp: number;
}) {
  const p = xpProgress(xp);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted mb-1">
        <span>
          {character.name} · {stage.label}
        </span>
        <span>Lv {p.level}</span>
      </div>
      <ProgressBar value={p.pct} />
      <div className="text-right text-xs text-muted mt-1">
        {p.into} / {p.into + p.next} XP
      </div>
    </div>
  );
}
