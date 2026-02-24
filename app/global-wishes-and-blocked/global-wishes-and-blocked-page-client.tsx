'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload, Save } from 'lucide-react';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { WishesAndBlockedList } from '@/features/wishes_and_blocked/components/wishes-and-blocked-list';
import { WishesAndBlockedDialog } from '@/features/wishes_and_blocked/components/wishes-and-blocked-dialog';

import {
    useGlobalWishesAndBlocked,
    useCreateGlobalWishesAndBlocked,
    useUpdateGlobalWishesAndBlocked,
    useDeleteGlobalWishesAndBlocked,
} from '@/features/global_wishes_and_blocked/hooks/use-global-wishes-and-blocked';
import { useWishesAndBlocked } from '@/features/wishes_and_blocked/hooks/use-wishes-and-blocked';
import { GlobalWishesConflictDialog } from '@/features/global_wishes_and_blocked/components/global-wishes-conflict-dialog';
import { SaveTemplateDialog } from '@/components/save-template-dialog';
import { ImportGlobalWishesTemplateDialog } from '@/components/import-global-wishes-template-dialog';
import { useGlobalWishesTemplates, useGlobalWishesTemplate, useCreateGlobalWishesTemplate } from '@/features/global_wishes_and_blocked/hooks/use-global-wishes-templates';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { toast } from 'sonner';
import { matchTemplateEmployees } from '@/lib/utils/employee-matching';

interface GlobalWishesAndBlockedPageClientProps {
  caseId: number;
  monthYear: string;
}

export function GlobalWishesAndBlockedPageClient({ caseId, monthYear }: GlobalWishesAndBlockedPageClientProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<WishesAndBlockedEmployee | undefined>();

    const { data: employees = [] as WishesAndBlockedEmployee[], isLoading } = useGlobalWishesAndBlocked(caseId, monthYear);
    const createMutation = useCreateGlobalWishesAndBlocked(caseId, monthYear);
    const updateMutation = useUpdateGlobalWishesAndBlocked(caseId, monthYear);
    const deleteMutation = useDeleteGlobalWishesAndBlocked(caseId, monthYear);

    // Template functionality
    const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
    const [importTemplateDialogOpen, setImportTemplateDialogOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    
    const { data: templates = [] } = useGlobalWishesTemplates(caseId);
    const { data: selectedTemplate } = useGlobalWishesTemplate(caseId, selectedTemplateId);
    const { mutate: createTemplate, isPending: isCreatingTemplate } = useCreateGlobalWishesTemplate(caseId);
    const { data: currentEmployees = [] } = useEmployees(caseId, monthYear);

    const handleCreate = () => {
        setEditingEmployee(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (employee: WishesAndBlockedEmployee) => {
        setEditingEmployee(employee);
        setDialogOpen(true);
    };

    // State for conflict dialog
    const { data: monthlyEmployees = [] } = useWishesAndBlocked(caseId, monthYear);
    const [conflictOpen, setConflictOpen] = useState(false);
    const [pendingPayload, setPendingPayload] = useState<{
        data: Omit<WishesAndBlockedEmployee, 'key'>;
        isEdit: boolean;
        employeeKey?: number;
        employeeName?: string;
    } | null>(null);

    const handleSubmit = async (data: Omit<WishesAndBlockedEmployee, 'key'>) => {
        // Determine if there are existing monthly wishes for this employee
        const employeeKey = editingEmployee?.key;
        const monthlyEntry = employeeKey
            ? monthlyEmployees?.find((e: WishesAndBlockedEmployee) => e.key === employeeKey)
            : monthlyEmployees?.find((e: WishesAndBlockedEmployee) => e.firstname === data.firstname && e.name === data.name);

        const hasMonthlyWishes = !!monthlyEntry && (
            (monthlyEntry.wish_days?.length || 0) > 0 ||
            (monthlyEntry.wish_shifts?.length || 0) > 0 ||
            (monthlyEntry.blocked_days?.length || 0) > 0 ||
            (monthlyEntry.blocked_shifts?.length || 0) > 0
        );

        if (hasMonthlyWishes) {
            setPendingPayload({ data, isEdit: !!editingEmployee, employeeKey: editingEmployee?.key, employeeName: `${data.firstname} ${data.name}` });
            setConflictOpen(true);
            return;
        }

        if (editingEmployee) {
            await updateMutation.mutateAsync({ id: editingEmployee.key, data });
        } else {
            await createMutation.mutateAsync({ data, options: {} });
        }
        setDialogOpen(false);
        setEditingEmployee(undefined);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Template handlers
    const handleSaveAsTemplate = (description: string) => {
        const content = {
            employees: employees.map((emp: WishesAndBlockedEmployee) => ({
                key: emp.key,
                firstname: emp.firstname,
                name: emp.name,
                wish_days: emp.wish_days,
                wish_shifts: emp.wish_shifts,
                blocked_days: emp.blocked_days,
                blocked_shifts: emp.blocked_shifts,
            })),
        };

        createTemplate(
            { content, description },
            {
                onSuccess: () => {
                    setSaveTemplateDialogOpen(false);
                    toast.success(`Template "${description}" wurde erfolgreich gespeichert.`);
                },
                onError: () => {
                    toast.error('Das Template konnte nicht gespeichert werden.');
                },
            }
        );
    };

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
    };

    const handleImportMerge = async (templateId: string) => {
        if (!selectedTemplate) return;

        const matchResult = matchTemplateEmployees(
            selectedTemplate.content.employees,
            currentEmployees
        );

        if (matchResult.matchCount === 0) {
            toast.error('Keine passenden Mitarbeiter gefunden. Es wurden keine Mitarbeiter gefunden, die importiert werden können.');
            setImportTemplateDialogOpen(false);
            setSelectedTemplateId(null);
            return;
        }

        try {
            // Merge mode: update existing, create new, keep unmatched current employees
            for (const { templateEmployee, currentEmployee } of matchResult.matched) {
                const existingGlobal = employees.find((e: WishesAndBlockedEmployee) => e.key === currentEmployee.key);
                
                if (existingGlobal) {
                    // Update existing
                    await updateMutation.mutateAsync({
                        id: currentEmployee.key,
                        data: {
                            firstname: templateEmployee.firstname,
                            name: templateEmployee.name,
                            wish_days: templateEmployee.wish_days,
                            wish_shifts: templateEmployee.wish_shifts,
                            blocked_days: templateEmployee.blocked_days,
                            blocked_shifts: templateEmployee.blocked_shifts,
                        },
                        options: { skipSyncToMonthly: false },
                    });
                } else {
                    // Create new
                    await createMutation.mutateAsync({
                        data: {
                            firstname: templateEmployee.firstname,
                            name: templateEmployee.name,
                            wish_days: templateEmployee.wish_days,
                            wish_shifts: templateEmployee.wish_shifts,
                            blocked_days: templateEmployee.blocked_days,
                            blocked_shifts: templateEmployee.blocked_shifts,
                        },
                        options: { skipSyncToMonthly: false },
                    });
                }
            }

            toast.success(`Template importiert (Merge): ${matchResult.matchCount} von ${matchResult.totalCount} Mitarbeiter wurden importiert.${
                matchResult.unmatched.length > 0
                    ? ` ${matchResult.unmatched.length} Mitarbeiter wurden übersprungen.`
                    : ''
            }`);

            setImportTemplateDialogOpen(false);
            setSelectedTemplateId(null);
        } catch (error) {
            toast.error('Fehler beim Importieren: Das Template konnte nicht importiert werden.');
        }
    };

    const handleImportOverwrite = async (templateId: string) => {
        if (!selectedTemplate) return;

        const matchResult = matchTemplateEmployees(
            selectedTemplate.content.employees,
            currentEmployees
        );

        if (matchResult.matchCount === 0) {
            toast.error('Keine passenden Mitarbeiter gefunden. Es wurden keine Mitarbeiter gefunden, die importiert werden können.');
            setImportTemplateDialogOpen(false);
            setSelectedTemplateId(null);
            return;
        }

        try {
            // Overwrite mode: delete all current, then create matched employees
            for (const employee of employees) {
                await deleteMutation.mutateAsync(employee.key);
            }

            for (const { templateEmployee } of matchResult.matched) {
                await createMutation.mutateAsync({
                    data: {
                        firstname: templateEmployee.firstname,
                        name: templateEmployee.name,
                        wish_days: templateEmployee.wish_days,
                        wish_shifts: templateEmployee.wish_shifts,
                        blocked_days: templateEmployee.blocked_days,
                        blocked_shifts: templateEmployee.blocked_shifts,
                    },
                    options: { skipSyncToMonthly: false },
                });
            }

            toast.success(`Template importiert (Überschreiben): ${matchResult.matchCount} von ${matchResult.totalCount} Mitarbeiter wurden importiert.${
                matchResult.unmatched.length > 0
                    ? ` ${matchResult.unmatched.length} Mitarbeiter wurden übersprungen.`
                    : ''
            }`);

            setImportTemplateDialogOpen(false);
            setSelectedTemplateId(null);
        } catch (error) {
            toast.error('Fehler beim Importieren: Das Template konnte nicht importiert werden.');
        }
    };


    return (
        <div className="py-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Globale Wünsche & Blockierungen</CardTitle>
                            <CardDescription>
                                Verwalte allgemeine Wunsch-Tage, Wunsch-Schichten, blockierte Tage und blockierte Schichten für Mitarbeiter
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setImportTemplateDialogOpen(true)}
                                disabled={templates.length === 0}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Template laden
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSaveTemplateDialogOpen(true)}
                                disabled={employees.length === 0}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Als Template speichern
                            </Button>
                            <Button onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Neuer Eintrag
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Lädt...</div>
                    ) : (
                        <WishesAndBlockedList
                            employees={employees}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={deleteMutation.isPending}
                        />
                    )}
                </CardContent>
            </Card>

            <WishesAndBlockedDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                employee={editingEmployee}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isGlobal={true}
            />

            <GlobalWishesConflictDialog
                open={conflictOpen}
                onOpenChange={setConflictOpen}
                onChoice={async (choice) => {
                    if (!pendingPayload) return;
                    const { data, isEdit, employeeKey } = pendingPayload;

                    if (choice === 'overwrite') {
                        if (isEdit && employeeKey) {
                            await updateMutation.mutateAsync({ id: employeeKey, data });
                        } else {
                            await createMutation.mutateAsync({ data, options: {} });
                        }
                    } else if (choice === 'keep-monthly') {
                        if (isEdit && employeeKey) {
                            await updateMutation.mutateAsync({ id: employeeKey, data, options: { skipSyncToMonthly: true } });
                        } else {
                            await createMutation.mutateAsync({ data, options: { skipSyncToMonthly: true } });
                        }
                    } else {
                        // cancel -> do nothing
                    }

                    setPendingPayload(null);
                    setDialogOpen(false);
                    setEditingEmployee(undefined);
                }}
                employeeName={pendingPayload?.employeeName || ''}
            />

            <SaveTemplateDialog
                open={saveTemplateDialogOpen}
                onOpenChange={setSaveTemplateDialogOpen}
                onSave={handleSaveAsTemplate}
                isSaving={isCreatingTemplate}
            />

            <ImportGlobalWishesTemplateDialog
                open={importTemplateDialogOpen}
                onOpenChange={(open) => {
                    setImportTemplateDialogOpen(open);
                    if (!open) {
                        setSelectedTemplateId(null);
                    }
                }}
                templates={templates}
                selectedTemplateContent={selectedTemplate}
                currentEmployees={currentEmployees}
                onImportMerge={handleImportMerge}
                onImportOverwrite={handleImportOverwrite}
                onSelectTemplate={handleSelectTemplate}
                isImporting={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
            />
        </div>
    );
}
