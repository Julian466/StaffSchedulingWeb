'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import type {Template, TemplateSummary} from '@/src/entities/models/template.model';
import type {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';

export async function listMinimalStaffTemplatesAction(caseId: number): Promise<TemplateSummary[]> {
    const controller = getInjection('IListMinimalStaffTemplatesController');
    const result = await controller({caseId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function getMinimalStaffTemplateAction(caseId: number, templateId: string): Promise<Template<MinimalStaffRequirements>> {
    const controller = getInjection('IGetMinimalStaffTemplateController');
    const result = await controller({caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function createMinimalStaffTemplateAction(caseId: number, content: MinimalStaffRequirements, description: string): Promise<TemplateSummary> {
    const controller = getInjection('ICreateMinimalStaffTemplateController');
    const result = await controller({caseId, content, description});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/minimal-staff');
    return result.data;
}

export async function updateMinimalStaffTemplateAction(
    caseId: number,
    templateId: string,
    data: { content?: MinimalStaffRequirements; description?: string }
): Promise<Template<MinimalStaffRequirements>> {
    const controller = getInjection('IUpdateMinimalStaffTemplateController');
    const result = await controller({caseId, templateId, data});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/minimal-staff');
    return result.data;
}

export async function deleteMinimalStaffTemplateAction(caseId: number, templateId: string): Promise<{ success: boolean }> {
    const controller = getInjection('IDeleteMinimalStaffTemplateController');
    const result = await controller({caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/minimal-staff');
    return result.data;
}
