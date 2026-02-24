'use server';

import { createTemplateRepository, globalWishesTemplateRepository } from '@/lib/services/template-repository';
import { Weights } from '@/src/entities/models/weights.model';
import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { GlobalWishesTemplateContent } from '@/src/entities/models/template.model';
import { TemplateSummary, Template } from '@/src/entities/models/template.model';

const weightsTemplateRepo = createTemplateRepository<Weights>('weights');
const minimalStaffTemplateRepo = createTemplateRepository<MinimalStaffRequirements>('minimal-staff');

export async function listTemplatesAction(templateType: string, caseId: number): Promise<TemplateSummary[]> {
  if (templateType === 'global-wishes') {
    return globalWishesTemplateRepository.list(caseId);
  }
  const repo = getTemplateRepo(templateType);
  return repo.list(caseId);
}

export async function getTemplateAction<T>(templateType: string, caseId: number, templateId: string): Promise<Template<T>> {
  if (templateType === 'global-wishes') {
    return globalWishesTemplateRepository.get(caseId, templateId) as Promise<Template<T>>;
  }
  const repo = getTemplateRepo(templateType);
  return repo.get(caseId, templateId) as Promise<Template<T>>;
}

export async function createTemplateAction(templateType: string, caseId: number, content: unknown, description: string) {
  if (templateType === 'global-wishes') {
    return globalWishesTemplateRepository.create(caseId, content as GlobalWishesTemplateContent, description);
  }
  const repo = getTemplateRepo(templateType);
  return repo.create(caseId, content as Weights & MinimalStaffRequirements, description);
}

export async function updateTemplateAction(templateType: string, caseId: number, templateId: string, data: { content?: unknown; description?: string }) {
  if (templateType === 'global-wishes') {
    return globalWishesTemplateRepository.update(caseId, templateId, data as { content?: GlobalWishesTemplateContent; description?: string });
  }
  const repo = getTemplateRepo(templateType);
  return repo.update(caseId, templateId, data as { content?: Weights & MinimalStaffRequirements; description?: string });
}

export async function deleteTemplateAction(templateType: string, caseId: number, templateId: string): Promise<{ success: boolean }> {
  if (templateType === 'global-wishes') {
    await globalWishesTemplateRepository.delete(caseId, templateId);
    return { success: true };
  }
  const repo = getTemplateRepo(templateType);
  await repo.delete(caseId, templateId);
  return { success: true };
}

function getTemplateRepo(templateType: string) {
  switch (templateType) {
    case 'weights': return weightsTemplateRepo;
    case 'minimal-staff': return minimalStaffTemplateRepo;
    default: throw new Error(`Unknown template type: ${templateType}`);
  }
}
