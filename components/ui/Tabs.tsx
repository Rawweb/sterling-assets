'use client';

export default function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div
      role='tablist'
      className='mb-5 grid gap-2.5 rounded-xl bg-bg p-1.5'
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type='button'
          role='tab'
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`rounded-[9px] p-2 md:2.5 text-xs md:text-[13px] font-semibold transition-colors truncate ${
            active === tab
              ? 'bg-primary text-surface shadow-[0_8px_18px_-8px_rgba(79,107,246,0.7)]'
              : 'text-muted hover:text-text active:scale-[0.97] active:text-primary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
