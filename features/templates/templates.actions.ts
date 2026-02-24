'use server';

import {revalidatePath} from 'next/cache';
import {createTemplateRepository, globalWishesTemplateRepository} from '@/lib/services/template-repository';
import {Weights} from '@/src/entities/models/weights.model';
import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';
import {GlobalWishesTemplateContent, Template, TemplateSummary} from '@/src/entities/models/template.model';

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
        const result = await globalWishesTemplateRepository.create(caseId, content as GlobalWishesTemplateContent, description);
        revalidatePath('/templates/global-wishes');
        revalidatePath('/global-wishes-and-blocked');
        return result;
    }
    const repo = getTemplateRepo(templateType);
    const result = await repo.create(caseId, content as Weights & MinimalStaffRequirements, description);
    revalidatePath(`/templates/${templateType}`);
    return result;
}

export async function updateTemplateAction(templateType: string, caseId: number, templateId: string, data: {
    content?: unknown;
    description?: string
}) {
    if (templateType === 'global-wishes') {
        const result = await globalWishesTemplateRepository.update(caseId, templateId, data as {
            content?: GlobalWishesTemplateContent;
            description?: string
        });
        revalidatePath('/templates/global-wishes');
        return result;
    }
    const repo = getTemplateRepo(templateType);
    const result = await repo.update(caseId, templateId, data as {
        content?: Weights & MinimalStaffRequirements;
        description?: string
    });
    revalidatePath(`/templates/${templateType}`);
    return result;
}

export async function deleteTemplateAction(templateType: string, caseId: number, templateId: string): Promise<{
    success: boolean
}> {
    if (templateType === 'global-wishes') {
        await globalWishesTemplateRepository.delete(caseId, templateId);
        revalidatePath('/templates/global-wishes');
        return {success: true};
    }
    const repo = getTemplateRepo(templateType);
    await repo.delete(caseId, templateId);
    revalidatePath(`/templates/${templateType}`);
    return {success: true};
}

function getTemplateRepo(templateType: string) {
    switch (templateType) {
        case 'weights':
            return weightsTemplateRepo;
        case 'minimal-staff':
            return minimalStaffTemplateRepo;
        default:
            throw new Error(`Unknown template type: ${templateType}`);
    }
}
