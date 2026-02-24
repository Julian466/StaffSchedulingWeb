import { NextRequest, NextResponse } from 'next/server';
import { getInjection } from '@/src/di/container';
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
    
    const scheduleController = getInjection('GetScheduleController');
    const scheduleResult = await scheduleController.execute(caseId, monthYear, scheduleId);
    
    if ('error' in scheduleResult) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    // Get metadata to include description and generatedAt
    const metadataController = getInjection('GetSchedulesMetadataController');
    const metadataResult = await metadataController.execute(caseId, monthYear);
    const scheduleMetadata = 'data' in metadataResult
      ? metadataResult.data.schedules.find(s => s.scheduleId === scheduleId)
      : undefined;
    
    return NextResponse.json({ 
      solution: scheduleResult.data,
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
    
    const controller = getInjection('DeleteScheduleController');
    const result = await controller.execute(caseId, monthYear, scheduleId);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
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
    
    const updates: { description?: string; comment?: string } = {};
    if (body.description !== undefined) {
      updates.description = body.description;
    }
    if (body.comment !== undefined) {
      updates.comment = body.comment;
    }
    
    const controller = getInjection('UpdateScheduleMetadataController');
    const result = await controller.execute(caseId, monthYear, scheduleId, updates);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
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
