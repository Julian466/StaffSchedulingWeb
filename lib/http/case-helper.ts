import {headers} from 'next/headers';

/**
 * Extracts the case ID from the request headers.
 * Used in API routes to determine which case data to access.
 *
 * The case ID is expected to be provided in the 'x-case-id' header.
 * If no header is provided or the value is invalid, defaults to case 1.
 *
 * @returns Promise resolving to the case ID
 *
 * @example
 * // In an API route:
 * export async function GET() {
 *   const caseId = await getCaseIdFromHeaders();
 *   const monthYear = await getMonthYearFromHeaders();
 *   const db = await getEmployeeDb(caseId, monthYear);
 *   // ...
 * }
 */
export async function getCaseIdFromHeaders(): Promise<number> {
    const headersList = await headers();
    const caseIdHeader = headersList.get('x-case-id');

    if (caseIdHeader) {
        const caseId = parseInt(caseIdHeader);
        if (!isNaN(caseId)) {
            return caseId;
        }
    }

    // Default to case 1 if no valid header is provided
    return 1;
}

/**
 * Extracts the monthYear from the request headers.
 * Used in API routes to determine which month/year folder to access.
 *
 * The monthYear is expected to be provided in the 'x-month-year' header
 * in MM_YYYY format (e.g., "11_2024").
 * If no header is provided, returns undefined.
 *
 * @returns Promise resolving to the monthYear string or undefined
 *
 * @example
 * // In an API route:
 * export async function GET() {
 *   const caseId = await getCaseIdFromHeaders();
 *   const monthYear = await getMonthYearFromHeaders();
 *   if (!monthYear) {
 *     return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
 *   }
 *   const db = await getEmployeeDb(caseId, monthYear);
 *   // ...
 * }
 */
export async function getMonthYearFromHeaders(): Promise<string | undefined> {
    const headersList = await headers();
    const monthYearHeader = headersList.get('x-month-year');

    if (monthYearHeader && /^\d{1,2}_\d{4}$/.test(monthYearHeader)) {
        return monthYearHeader;
    }

    return undefined;
}

/**
 * Extracts both case ID and monthYear from request headers.
 * This is a convenience function that combines getCaseIdFromHeaders and getMonthYearFromHeaders.
 *
 * @returns Promise resolving to an object with caseId and monthYear (or undefined)
 *
 * @example
 * // In an API route:
 * export async function GET() {
 *   const { caseId, monthYear } = await getCaseContextFromHeaders();
 *   if (!monthYear) {
 *     return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
 *   }
 *   const db = await getEmployeeDb(caseId, monthYear);
 *   // ...
 * }
 */
export async function getCaseContextFromHeaders(): Promise<{ caseId: number; monthYear: string | undefined }> {
    const caseId = await getCaseIdFromHeaders();
    const monthYear = await getMonthYearFromHeaders();
    return {caseId, monthYear};
}
