'use client';

import {useTransition} from 'react';
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {WeightsEditor} from '@/features/weights/components/weights-editor';
import {updateWeightsAction} from '@/features/weights/weights.actions';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Info, Scale} from 'lucide-react';
import {Weights} from '@/src/entities/models/weights.model';
import {toast} from 'sonner';

interface WeightsPageClientProps {
    caseId: number;
    monthYear: string;
    weights: Weights;
}

export function WeightsPageClient({caseId, monthYear, weights}: WeightsPageClientProps) {
    const [isPending, startTransition] = useTransition();

    const handleSave = (newWeights: Weights) => {
        startTransition(async () => {
            const result = await updateWeightsAction(caseId, monthYear, newWeights);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Gewichtungen erfolgreich aktualisiert');
        });
    };

    return (
        <div className="py-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Scale className="h-6 w-6 text-primary"/>
                        </div>
                        <div className="flex-1">
                            <CardTitle>Solver-Gewichtungen</CardTitle>
                            <CardDescription>
                                Konfigurieren Sie die Wichtigkeit der verschiedenen Optimierungsziele für den
                                Scheduling-Solver
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Alert>
                <Info className="h-4 w-4"/>
                <AlertTitle>Hinweis</AlertTitle>
                <AlertDescription>
                    Höhere Werte bedeuten, dass das entsprechende Ziel stärker gewichtet wird.
                    Ein Wert von 0 deaktiviert das Ziel komplett. Änderungen werden sofort für neue Solver-Läufe
                    verwendet.
                </AlertDescription>
            </Alert>

            <WeightsEditor
                weights={weights}
                onSave={handleSave}
                isSaving={isPending}
            />
        </div>
    );
}
