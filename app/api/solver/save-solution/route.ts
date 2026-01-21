import { NextRequest, NextResponse } from 'next/server';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';
import { createApiLogger } from '@/lib/logging/logger';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { validatePythonConfig, getPythonConfig } from '@/lib/config/app-config';
import { promises as fs } from 'fs';
import path from 'path';

const apiLogger = createApiLogger('/api/solver/save-solution');

/**
 * POST /api/solver/save-solution
 * Saves the currently selected schedule to .StaffScheduling/found_solutions/
 * in the format solution_{caseId}_{startDate}-{endDate}.json
 * 
 * @body { start: string (ISO 8601), end: string (ISO 8601) }
 * @returns Success status
 */
export async function POST(request: NextRequest) {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const body = await request.json();

    const { start, end } = body;

    if (!start || !end) {
      return NextResponse.json(
        { error: 'start and end dates are required' },
        { status: 400 }
      );
    }

    apiLogger.info('Saving selected solution', { caseId, monthYear, start, end });

    // Validate Python configuration to get StaffScheduling path
    const configValidation = validatePythonConfig();
    if (!configValidation.isValid || !configValidation.isEnabled) {
      apiLogger.error('Invalid Python configuration', {
        errors: configValidation.errors,
      });
      return NextResponse.json(
        {
          error: 'Python solver configuration is invalid or StaffScheduling path not configured',
          details: configValidation.errors.join('; '),
        },
        { status: 400 }
      );
    }

    // Get the StaffScheduling path
    const pythonConfig = getPythonConfig();
    const staffSchedulingPath = pythonConfig.path;

    if (!staffSchedulingPath) {
      apiLogger.error('StaffScheduling path not configured');
      return NextResponse.json(
        {
          error: 'StaffScheduling path is not configured',
        },
        { status: 400 }
      );
    }

    // Get the currently selected schedule
    const selectedSchedule = await ScheduleRepository.getSelectedSchedule(caseId, monthYear);

    if (!selectedSchedule) {
      apiLogger.warn('No schedule selected', { caseId, monthYear });
      return NextResponse.json(
        { error: 'No schedule is currently selected' },
        { status: 404 }
      );
    }

    // Format dates for filename (YYYY-MM-DD)
    const formatDateForFilename = (isoDate: string): string => {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formattedStart = formatDateForFilename(start);
    const formattedEnd = formatDateForFilename(end);
    
    // Create filename: solution_{caseId}_{startDate}-{endDate}.json
    const filename = `solution_${caseId}_${formattedStart}-${formattedEnd}.json`;
    
    // Get StaffScheduling path and create target directory
    const targetDir = path.join(staffSchedulingPath, 'found_solutions');
    const targetPath = path.join(targetDir, filename);

    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Write the solution file
    await fs.writeFile(
      targetPath,
      JSON.stringify(selectedSchedule, null, 2),
      'utf8'
    );

    apiLogger.info('Solution saved successfully', {
      caseId,
      filename,
      targetPath,
    });

    return NextResponse.json({
      success: true,
      filename,
      path: targetPath,
    });
  } catch (error) {
    apiLogger.error('Error saving solution', { error });
    return NextResponse.json(
      {
        error: 'Failed to save solution',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
