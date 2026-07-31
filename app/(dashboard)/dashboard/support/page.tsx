import PageShell from '@/components/dashboard/PageShell';

export default function SupportPage() {
  return (
    <PageShell title='Support'>
      <div className='rounded-[14px] border border-line p-8 text-center'>
        <h2 className='text-base font-semibold'>Need help?</h2>
        <p className='mt-2 text-sm text-muted'>
          Contact us at{' '}
          <a
            href='mailto:support@sterlingassetsholdings.com'
            className='font-semibold text-primary hover:underline'
          >
            support@sterlingassetsholdings.com
          </a>
        </p>
      </div>
    </PageShell>
  );
}
