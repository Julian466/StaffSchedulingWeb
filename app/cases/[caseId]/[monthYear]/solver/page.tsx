import { SolverPageClient } from './solver-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function SolverPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <SolverPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
