import { MinimalStaffPageClient } from './minimal-staff-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function MinimalStaffPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <MinimalStaffPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
