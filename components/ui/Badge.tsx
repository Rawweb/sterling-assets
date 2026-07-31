type Tone = 'active' | 'pending' | 'success' | 'danger' | 'neutral';

const TONES: Record<Tone, string> = {
  active: 'bg-primary/12 text-primary',
  pending: 'bg-gold/14 text-gold',
  success: 'bg-up/20 text-up',
  danger: 'bg-down/12 text-down',
  neutral: 'bg-line/60 text-muted',
};

export default function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
