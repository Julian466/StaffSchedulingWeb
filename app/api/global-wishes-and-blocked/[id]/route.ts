import { NextResponse } from 'next/server';
import { globalWishesAndBlockedRepository} from "@/features/global_wishes_and_blocked/api/global-wishes-and-blocked-repository";
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/global-wishes-and-blocked/[id]');

/**
 * GET /api/global-wishes-and-blocked/[id]
 * Retrieves a specific employee's wishes and blocked data.
 *
 * @param request - The request object
 * @param params - Route parameters containing the employee key
 * @returns JSON of the employee's wishes and blocked data
 * @returns 404 error if the employee is not found
 * @returns 500 error if the operation fails
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const method = 'GET';
    let caseId: number | undefined;
    try {
        caseId = await getCaseIdFromHeaders();
        const { id } = await params;
        const key = parseInt(id, 10);
        apiLogger.info('Fetching wishes-and-blocked employee by key', { method, caseId, key });

        const employee = await globalWishesAndBlockedRepository.getByKey(key, caseId);
        if (!employee) {
            apiLogger.warn('Wishes-and-blocked employee not found', { method, caseId, key });
            return NextResponse.json(
                { error: 'Employee not found' },
                { status: 404 }
            );
        }

        apiLogger.info('Fetched wishes-and-blocked employee', { method, caseId, key });
        return NextResponse.json(employee);
    } catch (error) {
        apiLogger.error('Failed to fetch wishes-and-blocked employee', { method, caseId, error });
        return NextResponse.json(
            { error: 'Failed to fetch employee' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/global-wishes-and-blocked/[id]
 * Updates a specific employee's wishes and blocked data.
 *
 * @param request - The request containing the updated data
 * @param params - Route parameters containing the employee key
 * @returns JSON of the updated employee
 * @returns 404 error if the employee is not found
 * @returns 500 error if the operation fails
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const method = 'PUT';
    let caseId: number | undefined;
    try {
        caseId = await getCaseIdFromHeaders();
        const { id } = await params;
        const key = parseInt(id, 10);
        const body = await request.json();

        apiLogger.info('Updating wishes-and-blocked employee', { method, caseId, key });
        const employee = await globalWishesAndBlockedRepository.update(key, body, caseId);

        if (!employee) {
            apiLogger.warn('Wishes-and-blocked employee not found for update', { method, caseId, key });
            return NextResponse.json(
                { error: 'Employee not found' },
                { status: 404 }
            );
        }

        apiLogger.info('Updated wishes-and-blocked employee', { method, caseId, key });
        return NextResponse.json(employee);
    } catch (error) {
        apiLogger.error('Failed to update wishes-and-blocked employee', { method, caseId, error });
        return NextResponse.json(
            { error: 'Failed to update employee' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/global-wishes-and-blocked/[id]
 * Deletes a specific employee's wishes and blocked data.
 *
 * Note: This is typically called automatically when deleting an employee.
 *
 * @param request - The request object
 * @param params - Route parameters containing the employee key
 * @returns 204 No Content on success
 * @returns 404 error if the employee is not found
 * @returns 500 error if the operation fails
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const method = 'DELETE';
    let caseId: number | undefined;
    try {
        caseId = await getCaseIdFromHeaders();
        const { id } = await params;
        const key = parseInt(id, 10);

        apiLogger.info('Deleting wishes-and-blocked employee', { method, caseId, key });
        const deleted = await globalWishesAndBlockedRepository.delete(key, caseId);

        if (!deleted) {
            apiLogger.warn('Wishes-and-blocked employee not found for deletion', { method, caseId, key });
            return NextResponse.json(
                { error: 'Employee not found' },
                { status: 404 }
            );
        }

        apiLogger.info('Deleted wishes-and-blocked employee', { method, caseId, key });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        apiLogger.error('Failed to delete wishes-and-blocked employee', { method, caseId, error });
        return NextResponse.json(
            { error: 'Failed to delete employee' },
            { status: 500 }
        );
    }
}
