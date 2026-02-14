'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
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

export default function GlobalWishesAndBlockedPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<WishesAndBlockedEmployee | undefined>();

    const { data: employees = [], isLoading } = useGlobalWishesAndBlocked();
    const createMutation = useCreateGlobalWishesAndBlocked();
    const updateMutation = useUpdateGlobalWishesAndBlocked();
    const deleteMutation = useDeleteGlobalWishesAndBlocked();

    const handleCreate = () => {
        setEditingEmployee(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (employee: WishesAndBlockedEmployee) => {
        setEditingEmployee(employee);
        setDialogOpen(true);
    };

    // State for conflict dialog
    const { data: monthlyEmployees = [] } = useWishesAndBlocked();
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
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Neuer Eintrag
                        </Button>
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
        </div>
    );
}
