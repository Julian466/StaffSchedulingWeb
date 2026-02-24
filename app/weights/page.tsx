'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeightsEditor } from '@/features/weights/components/weights-editor';
import { useWeights, useUpdateWeights } from '@/features/weights/hooks/use-weights';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Scale, Info } from 'lucide-react';
import { useCase } from '@/components/case-provider';

export default function WeightsPage() {
  const { currentCase } = useCase();
  const { data: weights, isLoading, error } = useWeights(currentCase?.caseId ?? 0, currentCase?.monthYear ?? '');
  const { mutate: updateWeights, isPending } = useUpdateWeights(currentCase?.caseId ?? 0, currentCase?.monthYear ?? '');

  if (error) {
    return (
      <div className="py-6 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler beim Laden</AlertTitle>
          <AlertDescription>
            Die Gewichtungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
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
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Solver-Gewichtungen</CardTitle>
                <CardDescription>
                  Konfigurieren Sie die Wichtigkeit der verschiedenen Optimierungsziele
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weights) {
    return null;
  }

  return (
    <div className="py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>Solver-Gewichtungen</CardTitle>
              <CardDescription>
                Konfigurieren Sie die Wichtigkeit der verschiedenen Optimierungsziele für den Scheduling-Solver
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Hinweis</AlertTitle>
        <AlertDescription>
          Höhere Werte bedeuten, dass das entsprechende Ziel stärker gewichtet wird. 
          Ein Wert von 0 deaktiviert das Ziel komplett. Änderungen werden sofort für neue Solver-Läufe verwendet.
        </AlertDescription>
      </Alert>

      <WeightsEditor
        weights={weights}
        onSave={updateWeights}
        isSaving={isPending}
      />
    </div>
  );
}
