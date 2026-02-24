'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MinimalStaffEditor } from '@/features/minimal-staff/components/minimal-staff-editor';
import { useMinimalStaff, useUpdateMinimalStaff } from '@/features/minimal-staff/hooks/use-minimal-staff';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, UserCog, CheckCircle2 } from 'lucide-react';
import { useCase } from '@/components/case-provider';

export default function MinimalStaffPage() {
  const { currentCase } = useCase();
  const { data: requirements, isLoading, error } = useMinimalStaff(currentCase?.caseId ?? 0, currentCase?.monthYear ?? '');
  const { mutate: updateRequirements, isPending } = useUpdateMinimalStaff(currentCase?.caseId ?? 0, currentCase?.monthYear ?? '');

  if (error) {
    return (
      <div className="py-6 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler beim Laden</AlertTitle>
          <AlertDescription>
            Die Mindestbesetzung konnte nicht geladen werden. Bitte versuchen Sie es später erneut.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Mindestbesetzung</CardTitle>
                <CardDescription>
                  Definieren Sie die minimale Anzahl von Mitarbeitern pro Kategorie, Wochentag und Schicht
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-4">
      {/* Info Banner */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Personalplanung optimieren</AlertTitle>
        <AlertDescription>
          Legen Sie hier fest, wie viele Mitarbeiter jeder Kategorie mindestens pro Schicht eingeplant werden müssen.
          Diese Vorgaben werden bei der automatischen Dienstplanerstellung berücksichtigt.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Mindestbesetzung konfigurieren</CardTitle>
              <CardDescription>
                Verwalten Sie die Mindestanforderungen für alle Mitarbeiterkategorien
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {requirements && (
            <MinimalStaffEditor
              requirements={requirements}
              onSave={updateRequirements}
              isSaving={isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
