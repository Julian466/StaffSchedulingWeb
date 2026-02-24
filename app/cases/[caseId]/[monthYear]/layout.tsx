interface CaseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ caseId: string; monthYear: string }>;
}

export default async function CaseLayout({ children, params }: CaseLayoutProps) {
  const { caseId, monthYear } = await params;
  
  // Basic validation
  const numericCaseId = Number(caseId);
  if (isNaN(numericCaseId) || numericCaseId <= 0) {
    return <div>Invalid case ID</div>;
  }
  
  if (!/^\d{1,2}_\d{4}$/.test(monthYear)) {
    return <div>Invalid month/year format. Expected format: M_YYYY or MM_YYYY</div>;
  }
  
  return <>{children}</>;
}
