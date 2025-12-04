import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';

/**
 * POST /api/schedule/[scheduleId]/select
 * Selects a schedule as the active one.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const { scheduleId } = await params;
    
    await ScheduleRepository.selectSchedule(caseId, scheduleId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error selecting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to select schedule' },
      { status: 500 }
    );
  }
}
