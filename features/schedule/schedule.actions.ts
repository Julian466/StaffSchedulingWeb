'use server';

import { getInjection } from '@/di/container';
import type { SchedulesMetadata, ScheduleSolutionRaw } from '@/types/schedule';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';

export async function getSchedulesMetadataAction(caseId: number, monthYear: string): Promise<SchedulesMetadata> {
  const controller = getInjection('IGetSchedulesMetadataController');
  const result = await controller({ caseId, monthYear });
  if ('error' in result) throw new Error(result.error);
  return result.data;
}

export async function getSelectedScheduleAction(caseId: number, monthYear: string): Promise<{ solution: ScheduleSolutionRaw | null }> {
  const schedule = await ScheduleRepository.getSelectedSchedule(caseId, monthYear);
  return { solution: schedule ?? null };
}

export async function getScheduleByIdAction(caseId: number, monthYear: string, scheduleId: string): Promise<{
  solution: ScheduleSolutionRaw | null;
  description?: string;
  generatedAt?: string;
}> {
  const scheduleController = getInjection('IGetScheduleController');
  const scheduleResult = await scheduleController({ caseId, monthYear, scheduleId });

  if ('error' in scheduleResult) {
    throw new Error('Schedule not found');
  }

  const metadataController = getInjection('IGetSchedulesMetadataController');
  const metadataResult = await metadataController({ caseId, monthYear });
  const scheduleMetadata = 'data' in metadataResult
    ? metadataResult.data.schedules.find(s => s.scheduleId === scheduleId)
    : undefined;

  return {
    solution: scheduleResult.data,
    description: scheduleMetadata?.description,
    generatedAt: scheduleMetadata?.generatedAt,
  };
}

export async function saveScheduleAction(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  solution: ScheduleSolutionRaw,
  description?: string,
  autoSelect: boolean = false
): Promise<{ success: boolean }> {
  const saveController = getInjection('ISaveScheduleController');
  const result = await saveController({ caseId, monthYear, scheduleId, solution, description });
  if ('error' in result) throw new Error(result.error);

  if (autoSelect) {
    const selectController = getInjection('ISelectScheduleController');
    await selectController({ caseId, monthYear, scheduleId });
  }

  return { success: true };
}

export async function selectScheduleAction(caseId: number, monthYear: string, scheduleId: string): Promise<{ success: boolean }> {
  const controller = getInjection('ISelectScheduleController');
  const result = await controller({ caseId, monthYear, scheduleId });
  if ('error' in result) throw new Error(result.error);
  return { success: true };
}

export async function deleteScheduleAction(caseId: number, monthYear: string, scheduleId: string): Promise<{ success: boolean }> {
  const controller = getInjection('IDeleteScheduleController');
  const result = await controller({ caseId, monthYear, scheduleId });
  if ('error' in result) throw new Error(result.error);
  return { success: true };
}

export async function updateScheduleMetadataAction(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  updates: { description?: string; comment?: string }
): Promise<{ success: boolean }> {
  const controller = getInjection('IUpdateScheduleMetadataController');
  const result = await controller({ caseId, monthYear, scheduleId, updates });
  if ('error' in result) throw new Error(result.error);
  return { success: true };
}
