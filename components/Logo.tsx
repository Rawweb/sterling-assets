type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  onDark?: boolean;
};

const RATIO = 848 / 915;

export default function Logo({
  size = 40,
  withWordmark = false,
  onDark = false,
}: LogoProps) {
  const mark = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src='/logo-mark.svg'
      alt={withWordmark ? '' : 'Sterling Assets Holdings'}
      width={Math.round(size * RATIO)}
      height={size}
      style={{ display: 'block' }}
    />
  );

  if (!withWordmark) return mark;

  return (
    <span className='inline-flex items-center gap-2.5'>
      {mark}
      <span style={{ lineHeight: 1.05 }}>
        <b
          className={onDark ? 'block text-surface' : 'block text-navy'}
          style={{ fontWeight: 700, fontSize: size * 0.55, letterSpacing: 0.5 }}
        >
          STERLING
        </b>
        <span
          className={onDark ? 'block text-surface/60' : 'block text-muted'}
          style={{ fontWeight: 500, fontSize: size * 0.22, letterSpacing: 2 }}
        >
          ASSETS HOLDINGS
        </span>
      </span>
    </span>
  );
}
