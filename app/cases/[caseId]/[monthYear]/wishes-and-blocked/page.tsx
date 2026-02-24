import { WishesAndBlockedPageClient } from './wishes-and-blocked-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function WishesAndBlockedPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <WishesAndBlockedPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
