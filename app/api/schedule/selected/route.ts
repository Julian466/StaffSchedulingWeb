import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';

/**
 * GET /api/schedule/selected
 * Retrieves the currently selected schedule solution.
 */
export async function GET(request: NextRequest) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const schedule = await ScheduleRepository.getSelectedSchedule(caseId);
    
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
