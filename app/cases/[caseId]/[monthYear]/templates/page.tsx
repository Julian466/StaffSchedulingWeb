import { TemplatesPageClient } from './templates-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function TemplatesPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <TemplatesPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
