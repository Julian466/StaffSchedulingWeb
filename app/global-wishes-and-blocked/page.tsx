import {GlobalWishesAndBlockedPageClient} from './global-wishes-and-blocked-page-client';
import {getAllGlobalWishesAction} from '@/features/global_wishes_and_blocked/global-wishes-and-blocked.actions';
import {getAllEmployeesAction} from '@/features/employees/employees.actions';
import {listGlobalWishesTemplatesAction} from '@/features/templates/global-wishes-templates.actions';

export default async function GlobalWishesAndBlockedPage({
                                                             searchParams,
                                                         }: {
    searchParams: Promise<{ caseId?: string; monthYear?: string }>;
}) {
    const {caseId: caseIdStr, monthYear} = await searchParams;

    if (!caseIdStr || !monthYear) {
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case
            aus</div>;
    }

    const caseId = Number(caseIdStr);
    if (isNaN(caseId) || caseId <= 0 || !/^(0?[1-9]|1[0-2])_\d{4}$/.test(monthYear)) {
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case
            aus</div>;
    }

    const [employees, currentEmployees, templates] = await Promise.all([
        getAllGlobalWishesAction(caseId, monthYear),
        getAllEmployeesAction(caseId, monthYear),
        listGlobalWishesTemplatesAction(caseId),
    ]);

    return <GlobalWishesAndBlockedPageClient
        caseId={caseId}
        monthYear={monthYear}
        employees={employees}
        currentEmployees={currentEmployees}
        templates={templates}
    />;
}
