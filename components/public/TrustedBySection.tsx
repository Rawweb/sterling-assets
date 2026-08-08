import {
  Activity,
  BarChart2,
  Bitcoin,
  Building2,
  Coins,
  Globe,
  Home as HomeIcon,
  Landmark,
  Sprout,
  TrendingUp,
  Wallet,
} from 'lucide-react';

/**
 * Server component. Pure CSS marquee — no JS.
 * Each item carries its brand color applied via inline style (brand colors
 * cannot be design-system tokens because they are per-partner identity).
 * 11 items doubled = 22 in the track, keeping the loop seamless.
 * OKX brand is primarily black/white — #1C1C1C is accurate to their identity.
 */

const ITEMS = [
  { icon: Bitcoin, name: 'Binance', color: '#F3BA2F' },
  { icon: Landmark, name: 'Banking', color: '#1A56DB' },
  { icon: Coins, name: 'Blockchain', color: '#2CA6E0' },
  { icon: HomeIcon, name: 'Real Estate', color: '#E07B39' },
  { icon: BarChart2, name: 'Bitget', color: '#00C0A3' },
  { icon: Sprout, name: 'Agriculture', color: '#4CAF50' },
  { icon: Wallet, name: 'LocalCoinSwap', color: '#1A6AFF' },
  { icon: Globe, name: 'Kraken', color: '#5741D9' },
  { icon: TrendingUp, name: 'Cryptocurrency', color: '#F7931A' },
  { icon: Activity, name: 'Bybit', color: '#F7A600' },
  { icon: Building2, name: 'OKX', color: '#1C1C1C' },
];

export default function TrustedBySection() {
  return (
    <section className='bg-surface py-12 overflow-hidden'>
      <p className='text-center text-muted text-sm font-medium tracking-widest uppercase mb-8'>
        Trusted by investors using
      </p>

      <div className='marquee-mask'>
        <div className='flex items-center gap-14 w-max animate-marquee'>
          {[...ITEMS, ...ITEMS].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className='flex items-center gap-2.5 select-none'>
                <Icon
                  size={18}
                  style={{ color: item.color }}
                  className='flex-shrink-0'
                />
                <span
                  className='text-sm font-bold tracking-[0.5px] whitespace-nowrap'
                  style={{ color: item.color }}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
