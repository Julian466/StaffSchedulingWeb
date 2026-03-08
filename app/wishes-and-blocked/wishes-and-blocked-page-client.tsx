'use client';

import {useState, useTransition} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Plus} from 'lucide-react';
import {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';
import {WishesAndBlockedList} from '@/features/wishes_and_blocked/components/wishes-and-blocked-list';
import {WishesAndBlockedDialog} from '@/features/wishes_and_blocked/components/wishes-and-blocked-dialog';
import {toast} from 'sonner';

import {
    createWishesAction,
    deleteWishesAction,
    updateWishesAction,
} from '@/features/wishes_and_blocked/wishes-and-blocked.actions';

interface WishesAndBlockedPageClientProps {
    caseId: number;
    monthYear: string;
    employees: WishesAndBlockedEmployee[];
}

export function WishesAndBlockedPageClient({caseId, monthYear, employees}: WishesAndBlockedPageClientProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<WishesAndBlockedEmployee | undefined>();
    const [isSubmitting, startSubmitTransition] = useTransition();
    const [isDeleting, startDeleteTransition] = useTransition();

    // Get list of employee keys that already have wishes
    const existingEmployeeKeys = employees.map(emp => emp.key);

    const handleCreate = () => {
        setEditingEmployee(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (employee: WishesAndBlockedEmployee) => {
        setEditingEmployee(employee);
        setDialogOpen(true);
    };

    const handleSubmit = async (data: WishesAndBlockedEmployee) => {
        startSubmitTransition(async () => {
            let result;
            if (editingEmployee) {
                result = await updateWishesAction(caseId, monthYear, editingEmployee.key, data);
            } else {
                result = await createWishesAction(caseId, monthYear, data);
            }
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            setDialogOpen(false);
            setEditingEmployee(undefined);
        });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
            startDeleteTransition(async () => {
                const result = await deleteWishesAction(caseId, monthYear, id);
                if (!result.success) {
                    toast.error(result.error);
                }
            });
        }
    };

    return (
        <div className="py-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Wünsche & Blockierungen</CardTitle>
                            <CardDescription>
                                Verwalte Wunsch-Tage, Wunsch-Schichten, blockierte Tage und blockierte Schichten für
                                Mitarbeiter
                            </CardDescription>
                        </div>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4"/>
                            Neuer Eintrag
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <WishesAndBlockedList
                        employees={employees}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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
                excludedEmployeeKeys={existingEmployeeKeys}
            />
        </div>
    );
}
