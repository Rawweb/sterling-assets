export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col items-center gap-3.5 px-5 py-8 text-center'>
      <p className='text-sm text-muted'>{message}</p>
      {action}
    </div>
  );
}
