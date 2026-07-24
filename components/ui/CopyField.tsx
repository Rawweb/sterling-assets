'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, TriangleAlert } from 'lucide-react';

type State = 'idle' | 'copied' | 'failed';

export default function CopyField({ value }: { value: string }) {
  const [state, setState] = useState<State>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const t = setTimeout(() => setState('idle'), 1600);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  }

  return (
    <div className='flex flex-col gap-2 sm:flex-row'>
      <input
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        className='min-w-0 flex-1 rounded-xl border border-line bg-bg px-3.5 py-2.5 font-mono text-[13px] text-muted'
      />
      <button
        type='button'
        onClick={copy}
        className='flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary active:scale-[0.99]'
      >
        {state === 'copied' && <Check size={16} className='text-up' />}
        {state === 'failed' && (
          <TriangleAlert size={16} className='text-down' />
        )}
        {state === 'idle' && <Copy size={16} />}
        {state === 'copied'
          ? 'Copied'
          : state === 'failed'
            ? 'Copy failed'
            : 'Copy'}
      </button>
    </div>
  );
}
