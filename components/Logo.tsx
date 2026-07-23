type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  onDark?: boolean;
};

const RATIO = 848 / 915;

export default function Logo({ size = 40, withWordmark = false, onDark = false }: LogoProps) {
  const mark = (
    <img
      src="/logo-mark.svg"
      alt="Sterling Assets Holdings"
      width={Math.round(size * RATIO)}
      height={size}
      style={{ display: "block" }}
    />
  );

  if (!withWordmark) return mark;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {mark}
      <span style={{ lineHeight: 1.05 }}>
        <b
          style={{
            display: "block",
            fontWeight: 700,
            fontSize: size * 0.55,
            letterSpacing: 0.5,
            color: onDark ? "#fff" : "#0F1B2D",
          }}
        >
          STERLING
        </b>
        <span
          style={{
            display: "block",
            fontWeight: 500,
            fontSize: size * 0.22,
            letterSpacing: 2,
            color: onDark ? "rgba(255,255,255,.6)" : "#667085",
          }}
        >
          ASSETS HOLDINGS
        </span>
      </span>
    </span>
  );
}
