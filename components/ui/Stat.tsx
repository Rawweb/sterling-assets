export default function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'up' | 'down';
}) {
  const toneClass =
    tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : '';

  return (
    <div className='rounded-[14px] border border-line bg-bg px-4 py-3.5'>
      <p className='text-xs text-muted'>{label}</p>
      <p className={`mt-1 font-mono text-lg font-semibold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
