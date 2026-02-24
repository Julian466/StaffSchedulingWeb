import { WeightsTemplatesPageClient } from './weights-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function WeightTemplatesPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <WeightsTemplatesPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
