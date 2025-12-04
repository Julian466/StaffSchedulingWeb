import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';
import { getCaseIdFromHeaders } from '@/lib/http/case-helper';
import { ScheduleSolutionRaw } from '@/types/schedule';

/**
 * GET /api/schedule
 * Retrieves all schedules metadata for the current case.
 */
export async function GET(request: NextRequest) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const metadata = await ScheduleRepository.getSchedulesMetadata(caseId);
    
    return NextResponse.json(metadata);
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
 * Body: { scheduleId: string, seed: number, solution: ScheduleSolutionRaw, autoSelect?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const caseId = await getCaseIdFromHeaders();
    const body = await request.json();
    const { scheduleId, seed, solution, autoSelect = false } = body;
    
    if (!scheduleId || seed === undefined || !solution) {
      return NextResponse.json(
        { error: 'Missing required fields: scheduleId, seed, solution' },
        { status: 400 }
      );
    }
    
    await ScheduleRepository.saveSchedule(caseId, scheduleId, seed, solution, autoSelect);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving schedule:', error);
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    );
  }
}
