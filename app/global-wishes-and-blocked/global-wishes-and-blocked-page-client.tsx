'use client';

import {useState, useTransition} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Plus, Save, Upload} from 'lucide-react';
import {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';
import {WishesAndBlockedList} from '@/features/wishes_and_blocked/components/wishes-and-blocked-list';
import {WishesAndBlockedDialog} from '@/features/wishes_and_blocked/components/wishes-and-blocked-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
    createGlobalWishesAction,
    deleteGlobalWishesAction,
    importGlobalWishesTemplateAction,
    updateGlobalWishesAction,
} from '@/features/global_wishes_and_blocked/global-wishes-and-blocked.actions';
import {SaveTemplateDialog} from '@/components/save-template-dialog';
import {ImportGlobalWishesTemplateDialog} from '@/components/import-global-wishes-template-dialog';
import {createTemplateAction, getTemplateAction} from '@/features/templates/templates.actions';
import {Employee} from '@/src/entities/models/employee.model';
import {GlobalWishesTemplateContent, TemplateSummary, Template} from '@/src/entities/models/template.model';
import {toast} from 'sonner';

interface GlobalWishesAndBlockedPageClientProps {
    caseId: number;
    monthYear: string;
    employees: WishesAndBlockedEmployee[];
    currentEmployees: Employee[];
    templates: TemplateSummary[];
}

export function GlobalWishesAndBlockedPageClient({
    caseId,
    monthYear,
    employees,
    currentEmployees,
    templates,
}: GlobalWishesAndBlockedPageClientProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<WishesAndBlockedEmployee | undefined>();
    const [isSubmitting, startSubmitTransition] = useTransition();
    const [isDeleting, startDeleteTransition] = useTransition();

    // Template functionality
    const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
    const [importTemplateDialogOpen, setImportTemplateDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template<GlobalWishesTemplateContent> | null>(null);
    const [isCreatingTemplate, startCreateTemplateTransition] = useTransition();
    const [isImporting, startImportTransition] = useTransition();
    const [, startLoadTemplateTransition] = useTransition();

    // Confirmation dialog for save (create / edit)
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
    const [pendingEntry, setPendingEntry] = useState<{
        entry: WishesAndBlockedEmployee;
        isEdit: boolean;
    } | null>(null);

    // Confirmation dialog for delete
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleCreate = () => {
        setEditingEmployee(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (employee: WishesAndBlockedEmployee) => {
        setEditingEmployee(employee);
        setDialogOpen(true);
    };

    /**
     * Called when the form is submitted.
     * Resolves the employee key and opens the confirmation dialog.
     */
    const handleSubmit = (data: Omit<WishesAndBlockedEmployee, 'key'>) => {
        const isEdit = !!editingEmployee;

        let key: number;
        if (isEdit) {
            key = editingEmployee!.key;
        } else {
            const found = currentEmployees.find(
                (e) => e.firstname === data.firstname && e.name === data.name
            );
            if (!found) {
                toast.error('Mitarbeiter nicht gefunden.');
                return;
            }
            key = found.key;
        }

        setPendingEntry({entry: {key, ...data}, isEdit});
        setDialogOpen(false);
        setConfirmSaveOpen(true);
    };

    const handleConfirmSave = async () => {
        if (!pendingEntry) return;
        const {entry, isEdit} = pendingEntry;
        startSubmitTransition(async () => {
            try {
                if (isEdit) {
                    const {key, ...data} = entry;
                    await updateGlobalWishesAction(caseId, monthYear, key, data);
                    toast.success('Globale Wünsche gespeichert. Monatliche Wünsche wurden zurückgesetzt.');
                } else {
                    await createGlobalWishesAction(caseId, monthYear, entry);
                    toast.success('Globale Wünsche erstellt. Monatliche Wünsche wurden neu berechnet.');
                }
            } catch {
                toast.error('Fehler beim Speichern.');
            }
            setPendingEntry(null);
            setEditingEmployee(undefined);
        });
    };

    const handleDeleteRequest = (id: number) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (confirmDeleteId === null) return;
        startDeleteTransition(async () => {
            try {
                await deleteGlobalWishesAction(caseId, monthYear, confirmDeleteId);
                toast.success('Eintrag und zugehörige monatliche Wünsche wurden gelöscht.');
            } catch {
                toast.error('Fehler beim Löschen.');
            }
            setConfirmDeleteId(null);
        });
    };

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

        startCreateTemplateTransition(async () => {
            try {
                await createTemplateAction('global-wishes', caseId, content, description);
                setSaveTemplateDialogOpen(false);
                toast.success(`Template "${description}" wurde erfolgreich gespeichert.`);
            } catch {
                toast.error('Das Template konnte nicht gespeichert werden.');
            }
        });
    };

    const handleSelectTemplate = (templateId: string) => {
        startLoadTemplateTransition(async () => {
            try {
                const template = await getTemplateAction<GlobalWishesTemplateContent>('global-wishes', caseId, templateId);
                setSelectedTemplate(template);
            } catch {
                toast.error('Template konnte nicht geladen werden.');
            }
        });
    };

    const handleImport = async (templateId: string) => {
        startImportTransition(async () => {
            try {
                const result = await importGlobalWishesTemplateAction(caseId, monthYear, templateId);
                toast.success(
                    `Template importiert: ${result.matchCount} von ${result.totalCount} Mitarbeiter wurden importiert.` +
                    (result.unmatchedCount > 0 ? ` ${result.unmatchedCount} Mitarbeiter wurden übersprungen.` : '')
                );
                setImportTemplateDialogOpen(false);
                setSelectedTemplate(null);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Das Template konnte nicht importiert werden.';
                toast.error(`Fehler beim Importieren: ${message}`);
            }
        });
    };

    const pendingEmployeeName = pendingEntry
        ? `${pendingEntry.entry.firstname} ${pendingEntry.entry.name}`
        : '';

    return (
        <div className="py-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Globale Wünsche & Blockierungen</CardTitle>
                            <CardDescription>
                                Verwalte allgemeine Wunsch-Tage, Wunsch-Schichten, blockierte Tage und blockierte
                                Schichten für Mitarbeiter
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setImportTemplateDialogOpen(true)}
                                disabled={templates.length === 0}
                            >
                                <Upload className="mr-2 h-4 w-4"/>
                                Template laden
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSaveTemplateDialogOpen(true)}
                                disabled={employees.length === 0}
                            >
                                <Save className="mr-2 h-4 w-4"/>
                                Als Template speichern
                            </Button>
                            <Button onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4"/>
                                Neuer Eintrag
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <WishesAndBlockedList
                        employees={employees}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        isDeleting={isDeleting}
                    />
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

            {/* Confirmation: save creates/edits a gw entry → resets mw */}
            <AlertDialog open={confirmSaveOpen} onOpenChange={setConfirmSaveOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Monatliche Wünsche werden zurückgesetzt</AlertDialogTitle>
                        <AlertDialogDescription>
                            Die monatlichen Wünsche für <strong>{pendingEmployeeName}</strong> werden gelöscht
                            und aus den globalen Wünschen neu berechnet. Fortfahren?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingEntry(null)}>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSave}>Speichern</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirmation: delete gw entry also deletes mw */}
            <AlertDialog
                open={confirmDeleteId !== null}
                onOpenChange={(open) => {
                    if (!open) setConfirmDeleteId(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eintrag löschen</AlertDialogTitle>
                        <AlertDialogDescription>
                            Die globalen <strong>und</strong> monatlichen Wünsche für diesen Mitarbeiter
                            werden unwiderruflich gelöscht. Fortfahren?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Löschen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                    if (!open) setSelectedTemplate(null);
                }}
                templates={templates}
                selectedTemplateContent={selectedTemplate}
                currentEmployees={currentEmployees}
                onImport={handleImport}
                onSelectTemplate={handleSelectTemplate}
                isImporting={isImporting}
            />
        </div>
    );
}

