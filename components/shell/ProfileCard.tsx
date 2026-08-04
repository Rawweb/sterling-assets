'use client';

import { useEffect, useState } from 'react';
import { User, Wallet } from 'lucide-react';
import { formatCents } from '@/lib/money';

// Sidebar/Topbar are rendered in the shared dashboard layout, which Next.js
// does not re-fetch on client-side navigation between sibling dashboard
// routes (only the changed page segment refetches). Balance changes here
// are also driven by admin approvals in a separate session, so there's no
// client-side event to hook a router.refresh() to. Polling + refetch-on-
// focus keeps this specific figure live without touching the layout's
// caching behavior at all.
const POLL_INTERVAL_MS = 30_000;

export default function ProfileCard({
  fullName,
  balanceCents,
  avatarUrl,
}: {
  fullName: string;
  balanceCents: number;
  avatarUrl?: string | null;
}) {
  const [liveBalanceCents, setLiveBalanceCents] = useState(balanceCents);

  useEffect(() => {
    let cancelled = false;

    async function refreshBalance() {
      try {
        const res = await fetch('/api/balance', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.balanceCents === 'number') {
          setLiveBalanceCents(data.balanceCents);
        }
      } catch {
        // best-effort — keep showing the last known balance on failure
      }
    }

    const interval = setInterval(refreshBalance, POLL_INTERVAL_MS);

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') refreshBalance();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', refreshBalance);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', refreshBalance);
    };
  }, []);

  return (
    <div className='flex flex-col items-center rounded-2xl bg-navy-900 px-3 py-4 text-center'>
      <div className='size-16 overflow-hidden rounded-full border border-on-navy/20'>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={fullName}
            className='size-16 rounded-full object-cover'
          />
        ) : (
          <div className='grid size-16 place-items-center rounded-full bg-surface text-navy-900'>
            <User size={30} />
          </div>
        )}
      </div>

      <p className='mt-2.5 text-sm font-semibold text-surface'>{fullName}</p>

      <span className='mt-0.5 flex items-center gap-1.5 text-[11px] text-surface/60'>
        <span className='size-1.5 rounded-full bg-up' />
        online
      </span>

      <span className='mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 font-mono text-[13px] text-surface'>
        <Wallet size={14} />
        {formatCents(liveBalanceCents)}
      </span>
    </div>
  );
}
