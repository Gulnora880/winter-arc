export function CompanionReaction({
  text,
  visible,
}: {
  text: string;
  visible: boolean;
}) {
  if (!text) return null;
  return (
    <div
      className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 260,
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(17,27,43,0.95)",
        border: "1px solid rgba(128,191,255,0.25)",
        color: "#F2F6FC",
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
}
