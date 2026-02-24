'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeList } from '@/features/employees/components/employee-list';
import {
  useEmployees,
} from '@/features/employees/hooks/use-employees';
import { useCase } from '@/components/case-provider';

export default function EmployeesPage() {
  const { currentCase } = useCase();

  // TanStack Query Hooks
  const { data: employees = [], isLoading } = useEmployees(currentCase?.caseId ?? 0, currentCase?.monthYear ?? '');

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
