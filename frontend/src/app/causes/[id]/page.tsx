// src/app/causes/[id]/page.tsx
import CauseDetailPage from '@/components/features/causes/CauseDetailPage';

export const metadata = {
  title: 'Cause Details | Hope Charity',
  description: 'Learn more about our specific causes and how you can contribute.',
};

export default function Page({ params }: { params: { id: string } }) {
  return <CauseDetailPage params={params} />;
}