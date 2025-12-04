import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';

/**
 * GET /api/schedule/[scheduleId]
 * Retrieves a specific schedule solution.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const { scheduleId } = await params;
    
    const schedule = await ScheduleRepository.getSchedule(caseId, scheduleId);
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ solution: schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/schedule/[scheduleId]
 * Deletes a specific schedule.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const { scheduleId } = await params;
    
    await ScheduleRepository.deleteSchedule(caseId, scheduleId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/schedule/[scheduleId]
 * Updates schedule metadata (comment, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const { scheduleId } = await params;
    const body = await request.json();
    
    if (body.comment !== undefined) {
      await ScheduleRepository.updateScheduleComment(caseId, scheduleId, body.comment);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}
