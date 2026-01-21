import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';

/**
 * POST /api/schedule/[scheduleId]/select
 * Selects a schedule as the active one.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const { scheduleId } = await params;
    
    await ScheduleRepository.selectSchedule(caseId, monthYear, scheduleId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error selecting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to select schedule' },
      { status: 500 }
    );
  }
}
