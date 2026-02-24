'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import type {Template, TemplateSummary} from '@/src/entities/models/template.model';
import type {Weights} from '@/src/entities/models/weights.model';

export async function listWeightsTemplatesAction(caseId: number): Promise<TemplateSummary[]> {
    const controller = getInjection('IListWeightsTemplatesController');
    const result = await controller({caseId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function getWeightsTemplateAction(caseId: number, templateId: string): Promise<Template<Weights>> {
    const controller = getInjection('IGetWeightsTemplateController');
    const result = await controller({caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function createWeightsTemplateAction(caseId: number, content: Weights, description: string): Promise<TemplateSummary> {
    const controller = getInjection('ICreateWeightsTemplateController');
    const result = await controller({caseId, content, description});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/weights');
    return result.data;
}

export async function updateWeightsTemplateAction(
    caseId: number,
    templateId: string,
    data: { content?: Weights; description?: string }
): Promise<Template<Weights>> {
    const controller = getInjection('IUpdateWeightsTemplateController');
    const result = await controller({caseId, templateId, data});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/weights');
    return result.data;
}

export async function deleteWeightsTemplateAction(caseId: number, templateId: string): Promise<{ success: boolean }> {
    const controller = getInjection('IDeleteWeightsTemplateController');
    const result = await controller({caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/weights');
    return result.data;
}
