import { GlobalWishesTemplatesPageClient } from './global-wishes-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function GlobalWishesTemplatesPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <GlobalWishesTemplatesPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
