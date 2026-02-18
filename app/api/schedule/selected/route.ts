import {NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';

/**
 * GET /api/schedule/selected
 * Retrieves the currently selected schedule solution.
 */
export async function GET() {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const schedule = await ScheduleRepository.getSelectedSchedule(caseId, monthYear);
    
    if (!schedule) {
      return NextResponse.json(
        { solution: null },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ solution: schedule });
  } catch (error) {
    console.error('Error fetching selected schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch selected schedule' },
      { status: 500 }
    );
  }
}
