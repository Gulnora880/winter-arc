// Временная заглушка, чтобы Vercel смог собрать проект
export type CharacterId = "luffy" | "itadori" | "midoriya";

export function playCharacterSound(characterId: CharacterId = "luffy") {
  console.log("Звук персонажа:", characterId);
}

export function playSound(type: "level") {
  console.log("Звук уровня:", type);
}
