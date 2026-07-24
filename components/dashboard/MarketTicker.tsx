import { getMarketTicker, formatPrice } from '@/lib/market';

export default async function MarketTicker() {
  const coins = await getMarketTicker();
  if (coins.length === 0) return null;

  const row = (aria: boolean) =>
    coins.map((c) => (
      <span
        key={`${aria}-${c.symbol}`}
        className='inline-flex items-center gap-2 font-mono text-[12.5px] text-surface/80'
      >
        <b className='text-surface'>{c.symbol}</b>
        <span className='text-surface/60'>${formatPrice(c.price)}</span>
        <span className={c.change24h >= 0 ? 'text-up' : 'text-down'}>
          {c.change24h >= 0 ? '+' : ''}
          {c.change24h.toFixed(2)}%
        </span>
      </span>
    ));

  return (
    <div
      className='relative flex h-11 items-center overflow-hidden rounded-xl bg-navy-900'
      aria-label='Live market prices'
    >
      <div className='flex gap-8 whitespace-nowrap pl-5 animate-marquee motion-reduce:animate-none'>
        {row(false)}
        <span aria-hidden='true' className='flex gap-8'>
          {row(true)}
        </span>
      </div>

      <div className='pointer-events-none absolute inset-y-0 left-0 w-11 bg-linear-to-r from-navy-900 to-transparent' />
      <div className='pointer-events-none absolute inset-y-0 right-0 w-11 bg-linear-to-l from-navy-900 to-transparent' />
    </div>
  );
}
