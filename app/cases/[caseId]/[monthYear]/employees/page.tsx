import { EmployeesPageClient } from './employees-page-client';

interface PageProps {
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function EmployeesPage({ params }: PageProps) {
  const { caseId, monthYear } = await params;
  return <EmployeesPageClient caseId={Number(caseId)} monthYear={monthYear} />;
}
