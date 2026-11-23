export type CharacterId = "luffy" | "itadori" | "midoriya";
export type CompanionState =
  | "idle"
  | "happy"
  | "motivation"
  | "levelup"
  | "focus"
  | "rest"
  | "welcome"
  | "streak"
  | "celebrate";

export interface CharacterStage {
  minLevel: number;
  label: string;
  accent: string;
  aura: string;
  accessories: string[];
}

export interface CharacterDef {
  id: CharacterId;
  name: string;
  fullName: string;
  color: string;
  accent: string;
  personality: string;
  stages: CharacterStage[];
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  luffy: {
    id: "luffy",
    name: "Luffy",
    fullName: "Monkey D. Luffy",
    color: "#E23B3B",
    accent: "#FFD966",
    personality: "straightforward, energetic, fearless",
    stages: [
      {
        minLevel: 1,
        label: "East Blue Rookie",
        accent: "#FFD966",
        aura: "rgba(255,217,102,0.25)",
        accessories: [],
      },
      {
        minLevel: 3,
        label: "Straw Hat Pirate",
        accent: "#FFD966",
        aura: "rgba(255,217,102,0.40)",
        accessories: ["🔥"],
      },
      {
        minLevel: 6,
        label: "Supernova",
        accent: "#FF8C42",
        aura: "rgba(255,140,66,0.45)",
        accessories: ["🔥", "⚡"],
      },
      {
        minLevel: 10,
        label: "Yonko Candidate",
        accent: "#E23B3B",
        aura: "rgba(226,59,59,0.50)",
        accessories: ["👑", "🔥", "⚡"],
      },
    ],
  },
  itadori: {
    id: "itadori",
    name: "Itadori",
    fullName: "Yuji Itadori",
    color: "#8B5CF6",
    accent: "#C4B5FD",
    personality: "kind, resilient, selfless",
    stages: [
      {
        minLevel: 1,
        label: "First Year",
        accent: "#C4B5FD",
        aura: "rgba(196,181,253,0.25)",
        accessories: [],
      },
      {
        minLevel: 3,
        label: "Cursed Energy User",
        accent: "#A78BFA",
        aura: "rgba(167,139,250,0.40)",
        accessories: ["✨"],
      },
      {
        minLevel: 6,
        label: "Vessel",
        accent: "#8B5CF6",
        aura: "rgba(139,92,246,0.45)",
        accessories: ["✨", "🩸"],
      },
      {
        minLevel: 10,
        label: "Grade 1 Sorcerer",
        accent: "#7C3AED",
        aura: "rgba(124,58,237,0.50)",
        accessories: ["👑", "✨", "🩸"],
      },
    ],
  },
  midoriya: {
    id: "midoriya",
    name: "Deku",
    fullName: "Izuku Midoriya",
    color: "#22C55E",
    accent: "#86EFAC",
    personality: "analytical, determined, hopeful",
    stages: [
      {
        minLevel: 1,
        label: "Quirkless Dreamer",
        accent: "#86EFAC",
        aura: "rgba(134,239,172,0.25)",
        accessories: [],
      },
      {
        minLevel: 3,
        label: "U.A. Student",
        accent: "#4ADE80",
        aura: "rgba(74,222,128,0.40)",
        accessories: ["📓"],
      },
      {
        minLevel: 6,
        label: "One For All",
        accent: "#22C55E",
        aura: "rgba(34,197,94,0.45)",
        accessories: ["⚡", "📓"],
      },
      {
        minLevel: 10,
        label: "Symbol of Hope",
        accent: "#16A34A",
        aura: "rgba(22,163,74,0.50)",
        accessories: ["👑", "⚡", "📓"],
      },
    ],
  },
};

export function stageForLevel(id: CharacterId, level: number): CharacterStage {
  const stages = CHARACTERS[id].stages;
  let active = stages[0];
  for (const s of stages) if (level >= s.minLevel) active = s;
  return active;
}
