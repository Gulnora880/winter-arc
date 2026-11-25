import luffySound from "./assets/sounds/luffy-sound.mp3";
import itadoriSound from "./assets/sounds/itadori-sound.mp3";
import midoriyaSound from "./assets/sounds/midoriya-sound.mp3";

export type CharacterId = "luffy" | "itadori" | "midoriya";

const characterSounds: Record<CharacterId, string> = {
  luffy: luffySound,
  itadori: itadoriSound,
  midoriya: midoriyaSound,
};

const levelSound = new Audio(luffySound);

export function playCharacterSound(characterId: CharacterId = "luffy") {
  const src = characterSounds[characterId] || characterSounds.luffy;
  const audio = new Audio(src);
  audio.volume = 0.7;
  audio.play().catch((e) => console.warn("Ошибка звука:", e));
}

export function playSound(type: "level") {
  const audio = levelSound;
  audio.currentTime = 0;
  audio.volume = 0.6;
  audio.play().catch((e) => console.warn("Ошибка звука:", e));
}
