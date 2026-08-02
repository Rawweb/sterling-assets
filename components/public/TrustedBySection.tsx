/**
 * Server component — no JS needed.
 * animate-marquee and marquee-mask come from globals.css.
 * Brand names are doubled so the track loops seamlessly.
 */

const TRUST = [
  'BINANCE',
  'BLOCKCHAIN',
  'BITGET',
  'LOCALCOINSWAP',
  'BITCOIN.COM',
];

export default function TrustedBySection() {
  return (
    <section className='bg-surface py-12 overflow-hidden'>
      <p className='text-center text-muted text-xs font-medium tracking-widest uppercase mb-7'>
        Trusted by investors using
      </p>

      {/*
        marquee-mask fades the edges to transparent so the loop looks infinite.
        animate-marquee scrolls the track left continuously.
        The track is doubled so there is always content in view during the loop.
      */}
      <div className='marquee-mask'>
        <div className='flex gap-[60px] w-max animate-marquee'>
          {[...TRUST, ...TRUST].map((name, i) => (
            <span
              key={i}
              className='text-lg font-bold tracking-[0.5px] text-text/40 whitespace-nowrap select-none'
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
