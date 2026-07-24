export default function DetailRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'up' | 'down';
}) {
  const toneClass = tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : '';

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-mono font-semibold ${toneClass}`}>{value}</dd>
    </div>
  );
}