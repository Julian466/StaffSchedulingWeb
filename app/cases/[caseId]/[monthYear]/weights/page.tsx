import { WeightsPageClient } from './weights-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function WeightsPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <WeightsPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
