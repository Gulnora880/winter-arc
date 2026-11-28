import { useAuth } from "../../hooks/useAuth"; // ⬅️ Добавлено для выбора персонажа
import type { CompanionState, CharacterStage } from "../../data/characters";

// ⬇️ ИМПОРТ ТРЕХ ВИДЕО
import luffyVideo from "../../assets/videos/luffy.mp4";
import itadoriVideo from "../../assets/videos/itadori.mp4";
import midoriyaVideo from "../../assets/videos/midoriya.mp4";

interface Props {
  state: CompanionState;
  stage: CharacterStage;
  characterColor: string;
  accentColor: string;
  size?: number;
  onTap?: () => void;
}

export function CompanionAnimation({
  state,
  stage,
  characterColor,
  accentColor,
  size = 240,
  onTap,
}: Props) {
  const { profile } = useAuth();

  // Выбираем видео в зависимости от персонажа в профиле
  const getVideoSrc = () => {
    const charId = profile?.character_id || "luffy";
    if (charId === "itadori") return itadoriVideo;
    if (charId === "midoriya") return midoriyaVideo;
    return luffyVideo;
  };

  return (
    <div
      className={`companion-wrap anim-${state}`}
      style={{
        width: size,
        height: size,
        ["--aura" as any]: stage.aura,
        ["--accent" as any]: accentColor,
      }}
      onClick={onTap}
      role="button"
      tabIndex={0}
    >
      {/* Свечение вокруг персонажа */}
      <div className="companion-aura" />

      {/* Аксессуары (короны, молнии) */}
      {stage.accessories.map((acc, i) => (
        <span
          key={i}
          className="companion-accessory"
          style={{
            left: `${18 + i * 28}%`,
            top: `${-6 - i * 4}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {acc}
        </span>
      ))}

      {/* ⬇️ ВИДЕО ВМЕСТО SVG */}
      <video
        key={profile?.character_id} // Перезапускает видео при смене персонажа
        src={getVideoSrc()}
        autoPlay
        loop
        muted
        playsInline
        className="companion-video relative z-10 w-full h-full object-cover rounded-full"
      />

      <style>{`
        .companion-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.35)); }
        .companion-video { position: relative; z-index: 1; animation: companionIdle 4s ease-in-out infinite; }
        .companion-aura { position: absolute; inset: 8%; border-radius: 50%; background: radial-gradient(circle, var(--aura), transparent 70%); animation: auraPulse 3.5s ease-in-out infinite; z-index: 0; filter: blur(10px); }
        .companion-accessory { position: absolute; font-size: 22px; z-index: 2; animation: accessoryFloat 3s ease-in-out infinite; filter: drop-shadow(0 0 8px var(--accent)); }
        
        @keyframes companionIdle { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-6px) rotate(-1deg); } }
        @keyframes auraPulse { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes accessoryFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        
        .anim-happy .companion-video { animation: companionBounce 0.9s ease-in-out infinite; }
        .anim-celebrate .companion-video, .anim-levelup .companion-video { animation: companionCelebrate 0.7s ease-in-out infinite; }
        .anim-motivation .companion-video, .anim-welcome .companion-video { animation: companionWave 1.6s ease-in-out infinite; }
        .anim-focus .companion-video { animation: companionFocus 3s ease-in-out infinite; }
        .anim-rest .companion-video { animation: companionRest 4s ease-in-out infinite; }
        .anim-streak .companion-video { animation: companionBounce 0.8s ease-in-out infinite; }
        
        @keyframes companionBounce { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.02); } }
        @keyframes companionCelebrate { 0% { transform: rotate(-4deg) scale(1); } 50% { transform: rotate(4deg) scale(1.06); } 100% { transform: rotate(-4deg) scale(1); } }
        @keyframes companionWave { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes companionFocus { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes companionRest { 0%,100% { transform: translateY(0) scale(1); opacity: 1; } 50% { transform: translateY(2px) scale(0.99); opacity: 0.9; } }
        .anim-levelup .companion-aura { animation: levelAura 0.8s ease-out infinite; }
        @keyframes levelAura { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.4); opacity: 0; } }
      `}</style>
    </div>
  );
}
