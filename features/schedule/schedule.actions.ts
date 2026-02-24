'use server';

import { getInjection } from '@/src/di/container';
import type { SchedulesMetadata, ScheduleSolutionRaw } from '@/types/schedule';
import { ScheduleRepository } from '@/features/schedule/api/schedule-repository';

export async function getSchedulesMetadataAction(caseId: number, monthYear: string): Promise<SchedulesMetadata> {
  const controller = getInjection('GetSchedulesMetadataController');
  const result = await controller.execute(caseId, monthYear);
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
  const scheduleController = getInjection('GetScheduleController');
  const scheduleResult = await scheduleController.execute(caseId, monthYear, scheduleId);

  if ('error' in scheduleResult) {
    throw new Error('Schedule not found');
  }

  const metadataController = getInjection('GetSchedulesMetadataController');
  const metadataResult = await metadataController.execute(caseId, monthYear);
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
  const saveController = getInjection('SaveScheduleController');
  const result = await saveController.execute(caseId, monthYear, scheduleId, solution, description);
  if ('error' in result) throw new Error(result.error);

  if (autoSelect) {
    const selectController = getInjection('SelectScheduleController');
    await selectController.execute(caseId, monthYear, scheduleId);
  }

  return { success: true };
}

export async function selectScheduleAction(caseId: number, monthYear: string, scheduleId: string): Promise<{ success: boolean }> {
  const controller = getInjection('SelectScheduleController');
  const result = await controller.execute(caseId, monthYear, scheduleId);
  if ('error' in result) throw new Error(result.error);
  return { success: true };
}

export async function deleteScheduleAction(caseId: number, monthYear: string, scheduleId: string): Promise<{ success: boolean }> {
  const controller = getInjection('DeleteScheduleController');
  const result = await controller.execute(caseId, monthYear, scheduleId);
  if ('error' in result) throw new Error(result.error);
  return { success: true };
}

export async function updateScheduleMetadataAction(
  caseId: number,
  monthYear: string,
  scheduleId: string,
  updates: { description?: string; comment?: string }
): Promise<{ success: boolean }> {
  const controller = getInjection('UpdateScheduleMetadataController');
  const result = await controller.execute(caseId, monthYear, scheduleId, updates);
  if ('error' in result) throw new Error(result.error);
  return { success: true };
}
