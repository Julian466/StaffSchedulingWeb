import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseContextFromHeaders } from '@/lib/http/case-helper';

/**
 * GET /api/schedule/[scheduleId]
 * Retrieves a specific schedule solution with metadata.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const { scheduleId } = await params;
    
    const schedule = await ScheduleRepository.getSchedule(caseId, monthYear, scheduleId);
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    // Get metadata to include description
    const metadata = await ScheduleRepository.getSchedulesMetadata(caseId, monthYear);
    const scheduleMetadata = metadata.schedules.find(s => s.scheduleId === scheduleId);
    
    return NextResponse.json({ 
      solution: schedule,
      description: scheduleMetadata?.description,
      generatedAt: scheduleMetadata?.generatedAt,
    });
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
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const { scheduleId } = await params;
    
    await ScheduleRepository.deleteSchedule(caseId, monthYear, scheduleId);
    
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
 * Updates schedule metadata (description, comment, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { caseId, monthYear } = await getCaseContextFromHeaders();
    if (!monthYear) {
      return NextResponse.json({ error: 'Missing x-month-year header' }, { status: 400 });
    }
    const { scheduleId } = await params;
    const body = await request.json();
    
    if (body.description !== undefined) {
      await ScheduleRepository.updateScheduleDescription(caseId, monthYear, scheduleId, body.description);
    }
    
    if (body.comment !== undefined) {
      await ScheduleRepository.updateScheduleComment(caseId, monthYear, scheduleId, body.comment);
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
