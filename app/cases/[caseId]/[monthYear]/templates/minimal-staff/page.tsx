import { MinimalStaffTemplatesPageClient } from './minimal-staff-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function MinimalStaffTemplatesPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <MinimalStaffTemplatesPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
