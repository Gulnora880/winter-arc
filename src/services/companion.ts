import {
  CHARACTERS,
  stageForLevel,
  CharacterId,
  CharacterStage,
} from "../data/characters";

const XP_PER_LEVEL = 100;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgress(xp: number) {
  const level = levelFromXp(xp);
  const into = xp % XP_PER_LEVEL;
  const pct = (into / XP_PER_LEVEL) * 100;
  return { level, into, pct, next: XP_PER_LEVEL - into };
}

export function getStage(characterId: CharacterId, xp: number): CharacterStage {
  const lvl = levelFromXp(xp);
  return stageForLevel(characterId, lvl);
}

export function characterInfo(characterId: CharacterId) {
  return CHARACTERS[characterId] ?? CHARACTERS.luffy;
}
