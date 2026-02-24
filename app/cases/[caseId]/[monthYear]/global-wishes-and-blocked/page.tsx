import { GlobalWishesAndBlockedPageClient } from './global-wishes-and-blocked-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function GlobalWishesAndBlockedPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <GlobalWishesAndBlockedPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
