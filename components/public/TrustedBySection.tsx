import {
  BarChart2,
  Bitcoin,
  Coins,
  Globe,
  Home as HomeIcon,
  Landmark,
  Sprout,
  TrendingUp,
  Wallet,
} from 'lucide-react';

/**
 * Server component — pure CSS marquee, no JS needed.
 * Nine items doubled = 18 in the track so the loop is always seamless
 * and there are no visible gaps at any viewport width.
 * animate-marquee and marquee-mask are defined in globals.css.
 */

const ITEMS = [
  { icon: Bitcoin, name: 'Binance' },
  { icon: Landmark, name: 'Banking' },
  { icon: Coins, name: 'Blockchain' },
  { icon: HomeIcon, name: 'Real Estate' },
  { icon: BarChart2, name: 'Bitget' },
  { icon: Sprout, name: 'Agriculture' },
  { icon: Wallet, name: 'LocalCoinSwap' },
  { icon: Globe, name: 'Kraken' },
  { icon: TrendingUp, name: 'Cryptocurrency' },
];

export default function TrustedBySection() {
  return (
    <section className='bg-surface py-12 overflow-hidden'>
      <p className='text-center text-muted text-xs font-medium tracking-widest uppercase mb-8'>
        Trusted by investors using
      </p>

      <div className='marquee-mask'>
        <div className='flex items-center gap-14 w-max animate-marquee'>
          {[...ITEMS, ...ITEMS].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className='flex items-center gap-2.5 select-none'>
                <Icon size={18} className='text-muted/60 flex-shrink-0' />
                <span className='text-sm font-bold tracking-[0.5px] text-text/40 whitespace-nowrap'>
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
