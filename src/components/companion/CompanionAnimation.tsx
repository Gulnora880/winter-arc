import { useEffect, useState } from "react";
import type { CompanionState, CharacterStage } from "../../data/characters";

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
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      setBlink(true);
      setTimeout(() => {
        if (alive) setBlink(false);
      }, 140);
      setTimeout(loop, 2800 + Math.random() * 2500);
    };
    loop();
    return () => {
      alive = false;
    };
  }, []);

  const eyeScale = blink ? 0.1 : 1;
  const mouth = (() => {
    switch (state) {
      case "happy":
      case "celebrate":
      case "streak":
      case "levelup":
        return (
          <path
            d="M88 132 Q120 162 152 132"
            stroke="#fff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        );
      case "motivation":
      case "welcome":
        return (
          <path
            d="M96 138 Q120 152 144 138"
            stroke="#fff"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        );
      case "rest":
        return (
          <ellipse
            cx="120"
            cy="140"
            rx="10"
            ry="6"
            stroke="#fff"
            strokeWidth="3"
            fill="none"
          />
        );
      case "focus":
        return (
          <line
            x1="102"
            y1="138"
            x2="138"
            y2="138"
            stroke="#fff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M104 136 Q120 144 136 136"
            stroke="#fff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  })();

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
      <div className="companion-aura" />
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
      <svg
        viewBox="0 0 240 240"
        width="100%"
        height="100%"
        className="companion-svg"
      >
        <ellipse cx="120" cy="230" rx="80" ry="22" fill="rgba(0,0,0,0.35)" />
        <path
          d="M60 220 Q60 170 120 168 Q180 170 180 220 Z"
          fill={characterColor}
          opacity="0.85"
        />
        <circle cx="120" cy="110" r="60" fill="#F2E4D2" />
        <path
          d="M62 92 Q70 40 120 42 Q170 40 178 92 Q160 70 120 72 Q80 70 62 92 Z"
          fill={characterColor}
        />
        <path d="M62 92 Q54 84 56 76 Q70 78 78 88 Z" fill={characterColor} />
        <path
          d="M178 92 Q186 84 184 76 Q170 78 162 88 Z"
          fill={characterColor}
        />
        <g
          style={{
            transformOrigin: "120px 108px",
            transition: "transform 80ms",
            transform: `scale(1, ${eyeScale})`,
          }}
        >
          <ellipse cx="100" cy="108" rx="6" ry="9" fill="#0B1420" />
          <ellipse cx="140" cy="108" rx="6" ry="9" fill="#0B1420" />
          <circle cx="102" cy="105" r="2" fill="#fff" />
          <circle cx="142" cy="105" r="2" fill="#fff" />
        </g>
        {mouth}
        {(state === "happy" || state === "celebrate" || state === "streak") && (
          <>
            <circle cx="86" cy="124" r="7" fill="#F59E0B" opacity="0.35" />
            <circle cx="154" cy="124" r="7" fill="#F59E0B" opacity="0.35" />
          </>
        )}
      </svg>

      <style>{`
        .companion-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.35)); }
        .companion-svg { position: relative; z-index: 1; animation: companionIdle 4s ease-in-out infinite; }
        .companion-aura { position: absolute; inset: 8%; border-radius: 50%; background: radial-gradient(circle, var(--aura), transparent 70%); animation: auraPulse 3.5s ease-in-out infinite; z-index: 0; filter: blur(10px); }
        .companion-accessory { position: absolute; font-size: 22px; z-index: 2; animation: accessoryFloat 3s ease-in-out infinite; filter: drop-shadow(0 0 8px var(--accent)); }
        @keyframes companionIdle { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-6px) rotate(-1deg); } }
        @keyframes auraPulse { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes accessoryFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .anim-happy .companion-svg { animation: companionBounce 0.9s ease-in-out infinite; }
        .anim-celebrate .companion-svg, .anim-levelup .companion-svg { animation: companionCelebrate 0.7s ease-in-out infinite; }
        .anim-motivation .companion-svg, .anim-welcome .companion-svg { animation: companionWave 1.6s ease-in-out infinite; }
        .anim-focus .companion-svg { animation: companionFocus 3s ease-in-out infinite; }
        .anim-rest .companion-svg { animation: companionRest 4s ease-in-out infinite; }
        .anim-streak .companion-svg { animation: companionBounce 0.8s ease-in-out infinite; }
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
