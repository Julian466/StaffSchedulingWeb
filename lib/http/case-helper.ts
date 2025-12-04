import { headers } from 'next/headers';

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
 *   const db = await getEmployeeDb(caseId);
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
