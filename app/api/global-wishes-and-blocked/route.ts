import { NextResponse } from 'next/server';
import { globalWishesAndBlockedRepository} from "@/features/global_wishes_and_blocked/api/global-wishes-and-blocked-repository";
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/global-wishes-and-blocked');

/**
 * GET /api/global-wishes-and-blocked
 * Retrieves all employees with their wishes and blocked data for the current case.
 *
 * This includes information about:
 * - Wish days
 * - Wish shifts
 * - Blocked days
 * - Blocked shifts
 *
 * @returns JSON array of all employees with their wishes and blocked data
 * @returns 500 error if the operation fails
 */
export async function GET() {
    const method = 'GET';
    let caseId: number | undefined;
    let monthYear: string | undefined;
    try {
        const context = await getCaseContextFromHeaders();
        caseId = context.caseId;
        monthYear = context.monthYear;
        if (!monthYear) {
            return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
        }
        apiLogger.info('Fetching wishes-and-blocked employees', { method, caseId, monthYear });
        const employees = await globalWishesAndBlockedRepository.getAll(caseId, monthYear);
        apiLogger.info('Fetched wishes-and-blocked employees', { method, caseId, monthYear, count: employees.length });
        return NextResponse.json(employees);
    } catch (error) {
        apiLogger.error('Failed to fetch wishes and blocked employees', { method, caseId, monthYear, error });
        return NextResponse.json(
            { error: 'Failed to fetch wishes and blocked employees' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/global-wishes-and-blocked
 * Creates a new wishes and blocked employee entry for the current case.
 *
 * Note: This is typically called automatically when creating a new employee.
 *
 * @param request - The request containing the wishes and blocked employee data
 * @returns JSON of the created employee with 201 status
 * @returns 500 error if the operation fails
 */
export async function POST(request: Request) {
    const method = 'POST';
    let caseId: number | undefined;
    let monthYear: string | undefined;
    try {
        const context = await getCaseContextFromHeaders();
        caseId = context.caseId;
        monthYear = context.monthYear;
        if (!monthYear) {
            return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
        }
        const body = await request.json();
        const skipHeader = request.headers.get('x-skip-sync-to-monthly');
        const skipSyncToMonthly = skipHeader === '1' || skipHeader === 'true';
        apiLogger.info('Creating wishes-and-blocked employee', { method, caseId, monthYear, skipSyncToMonthly });
        const employee = await globalWishesAndBlockedRepository.create(body, caseId, monthYear, { skipSyncToMonthly });
        apiLogger.info('Created wishes-and-blocked employee', { method, caseId, monthYear, employeeKey: employee?.key, skipSyncToMonthly });
        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        apiLogger.error('Failed to create wishes and blocked employee', { method, caseId, monthYear, error });
        return NextResponse.json(
            { error: 'Failed to create wishes and blocked employee' },
            { status: 500 }
        );
    }
}
