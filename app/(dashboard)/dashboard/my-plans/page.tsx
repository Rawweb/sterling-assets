import PageShell from '@/components/dashboard/PageShell';
import MyPlansView from '@/components/dashboard/MyPlansView';

export default function MyPlansPage() {
  return (
    <PageShell title='My investment plans'>
      <MyPlansView />
    </PageShell>
  );
}
