'use client';

import {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {MinimalStaffEditor} from '@/features/minimal-staff/components/minimal-staff-editor';
import {updateMinimalStaffAction} from '@/features/minimal-staff/minimal-staff.actions';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {CheckCircle2, UserCog} from 'lucide-react';
import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';
import {toast} from 'sonner';

interface MinimalStaffPageClientProps {
    caseId: number;
    monthYear: string;
    requirements: MinimalStaffRequirements;
}

export function MinimalStaffPageClient({caseId, monthYear, requirements}: MinimalStaffPageClientProps) {
    const [isPending, startTransition] = useTransition();

    const handleSave = (newRequirements: MinimalStaffRequirements) => {
        startTransition(async () => {
            try {
                await updateMinimalStaffAction(caseId, monthYear, newRequirements);
                toast.success('Mindestbesetzung erfolgreich aktualisiert');
            } catch {
                toast.error('Fehler beim Aktualisieren der Mindestbesetzung');
            }
        });
    };

    return (
        <div className="py-6 space-y-4">
            {/* Info Banner */}
            <Alert>
                <CheckCircle2 className="h-4 w-4"/>
                <AlertTitle>Personalplanung optimieren</AlertTitle>
                <AlertDescription>
                    Legen Sie hier fest, wie viele Mitarbeiter jeder Kategorie mindestens pro Schicht eingeplant werden
                    müssen.
                    Diese Vorgaben werden bei der automatischen Dienstplanerstellung berücksichtigt.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <UserCog className="h-6 w-6 text-primary"/>
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
                    <MinimalStaffEditor
                        requirements={requirements}
                        onSave={handleSave}
                        isSaving={isPending}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
