import 'server-only';

const COINS = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'tether', symbol: 'USDT' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'usd-coin', symbol: 'USDC' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'tron', symbol: 'TRX' },
  { id: 'polkadot', symbol: 'DOT' },
  { id: 'aave', symbol: 'AAVE' },
];

export type Ticker = { symbol: string; price: number; change24h: number };

export async function getMarketTicker(): Promise<Ticker[]> {
  const ids = COINS.map((c) => c.id).join(',');
  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 60, tags: ['market'] },
    });
    if (!res.ok) return [];

    const data = await res.json();

    return COINS.flatMap(({ id, symbol }) => {
      const row = data[id];
      if (!row || typeof row.usd !== 'number') return [];
      return [{ symbol, price: row.usd, change24h: row.usd_24h_change ?? 0 }];
    });
  } catch {
    return [];
  }
}

export function formatPrice(price: number) {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: price >= 1 ? 2 : 4,
    maximumFractionDigits: price >= 1 ? 2 : 4,
  });
}
