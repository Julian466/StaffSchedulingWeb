import { NextRequest, NextResponse } from 'next/server';
import { getInjection } from '@/src/di/container';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';

/**
 * GET /api/schedule
 * Retrieves all schedules metadata for the current case.
 */
export async function GET() {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const controller = getInjection('GetSchedulesMetadataController');
    const result = await controller.execute(caseId, monthYear);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching schedules metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules metadata' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/schedule
 * Saves a new schedule solution for the current case.
 * Body: { scheduleId: string, description?: string, solution: ScheduleSolutionRaw, autoSelect?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const body = await request.json();
    const { scheduleId, description, solution, autoSelect = false } = body;
    
    if (!scheduleId || !solution) {
      return NextResponse.json(
        { error: 'Missing required fields: scheduleId, solution' },
        { status: 400 }
      );
    }
    
    const saveController = getInjection('SaveScheduleController');
    const result = await saveController.execute(caseId, monthYear, scheduleId, solution, description);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (autoSelect) {
      const selectController = getInjection('SelectScheduleController');
      await selectController.execute(caseId, monthYear, scheduleId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving schedule:', error);
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    );
  }
}
