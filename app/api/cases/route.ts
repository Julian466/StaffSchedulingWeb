import { NextResponse } from 'next/server';
import { listCases, createCase } from '@/lib/data/case/db-case';
import { createApiLogger } from '@/lib/logging/logger';

const apiLogger = createApiLogger('/api/cases');

/**
 * GET /api/cases
 * Retrieves a list of all available planning units with their month folders.
 * 
 * Cases are scanned from the file system (cases/ directory).
 * Structure: cases/[unitId]/[monthYear]/ where monthYear is MM_YYYY format.
 * 
 * @returns JSON object with an array of case units and their available months
 * @returns 500 error if the operation fails
 */
export async function GET() {
  const method = 'GET';
  try {
    apiLogger.info('Listing cases', { method });
    const units = await listCases();
    apiLogger.info('Listed cases', { method, unitCount: units.length });
    return NextResponse.json({ units });
  } catch (error) {
    apiLogger.error('Failed to list cases', { method, error });
    return NextResponse.json({ error: 'Failed to list cases' }, { status: 500 });
  }
}

/**
 * POST /api/cases
 * Creates a new case with specified unit ID, month, and year.
 * 
 * Request body should contain:
 * - unitId: The planning unit ID (e.g., 77)
 * - month: Month number (1-12)
 * - year: Year (e.g., 2024)
 * 
 * Creates directory structure: cases/[unitId]/[MM_YYYY]/
 * 
 * @returns JSON object with the created monthYear string
 * @returns 400 error if request body is invalid
 * @returns 500 error if the operation fails
 */
export async function POST(request: Request) {
  const method = 'POST';
  try {
    const body = await request.json();
    const { unitId, month, year } = body;
    
    if (!unitId || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields: unitId, month, year' },
        { status: 400 }
      );
    }
    
    apiLogger.info('Creating case', { method, unitId, month, year });
    const monthYear = await createCase(unitId, month, year);
    apiLogger.info('Created case', { method, unitId, monthYear });
    return NextResponse.json({ unitId, monthYear });
  } catch (error) {
    apiLogger.error('Failed to create case', { method, error });
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
