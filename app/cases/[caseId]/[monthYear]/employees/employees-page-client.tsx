'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeList } from '@/features/employees/components/employee-list';
import {
  useEmployees,
} from '@/features/employees/hooks/use-employees';

interface EmployeesPageClientProps {
  caseId: number;
  monthYear: string;
}

export function EmployeesPageClient({ caseId, monthYear }: EmployeesPageClientProps) {
  // TanStack Query Hooks
  const { data: employees = [], isLoading } = useEmployees(caseId, monthYear);

  return (
    <div className="py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mitarbeiter-Datenbank</CardTitle>
              <CardDescription>
                Verwalte alle Mitarbeiter an einem Ort
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Lädt...</div>
          ) : (
            <EmployeeList
              employees={employees}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
