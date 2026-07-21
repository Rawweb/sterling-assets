type LogoProps = {
  size?: number;          // height of the mark in px
  withWordmark?: boolean; // show "STERLING / ASSETS HOLDINGS" beside the mark
  onDark?: boolean;       // wordmark color: true = light text, false = dark text
};

const S_PATH =
  "M657 322 C598 286 470 270 400 300 C316 336 300 430 372 476 " +
  "C420 506 520 520 560 548 C640 604 604 690 512 706 C430 720 356 700 300 660";

export default function Logo({ size = 40, withWordmark = false, onDark = false }: LogoProps) {
  const mark = (
    <svg width={size} height={size} viewBox="0 0 960 960" aria-label="Sterling Assets Holdings" role="img">
      <defs>
        <linearGradient id="sah-gold" x1="0" y1="0.1" x2="1" y2="0.95">
          <stop offset="0" stopColor="#F6DE8B" />
          <stop offset="0.5" stopColor="#E0A100" />
          <stop offset="1" stopColor="#B7791A" />
        </linearGradient>
      </defs>
      <rect width="960" height="960" rx="208" fill="#0F1B2D" />
      <path
        d={S_PATH}
        fill="none"
        stroke="url(#sah-gold)"
        strokeWidth={112}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!withWordmark) return mark;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {mark}
      <span style={{ lineHeight: 1.05 }}>
        <b style={{ display: "block", fontWeight: 700, fontSize: size * 0.4, letterSpacing: 0.5, color: onDark ? "#fff" : "#0F1B2D" }}>
          STERLING
        </b>
        <span style={{ display: "block", fontWeight: 500, fontSize: size * 0.22, letterSpacing: 2, color: onDark ? "rgba(255,255,255,.6)" : "#667085" }}>
          ASSETS HOLDINGS
        </span>
      </span>
    </span>
  );
}
