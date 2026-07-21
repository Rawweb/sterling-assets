export default function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[85em] px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
