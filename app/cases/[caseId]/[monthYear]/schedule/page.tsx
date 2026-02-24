import { SchedulePageClient } from './schedule-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function SchedulePage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <SchedulePageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
