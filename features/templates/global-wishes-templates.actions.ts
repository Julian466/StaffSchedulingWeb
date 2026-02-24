'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import type {GlobalWishesTemplateContent, Template, TemplateSummary} from '@/src/entities/models/template.model';

export async function listGlobalWishesTemplatesAction(caseId: number): Promise<TemplateSummary[]> {
    const controller = getInjection('IListGlobalWishesTemplatesController');
    const result = await controller({caseId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function getGlobalWishesTemplateAction(caseId: number, templateId: string): Promise<Template<GlobalWishesTemplateContent>> {
    const controller = getInjection('IGetGlobalWishesTemplateController');
    const result = await controller({caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function createGlobalWishesTemplateAction(caseId: number, content: GlobalWishesTemplateContent, description: string): Promise<TemplateSummary> {
    const controller = getInjection('ICreateGlobalWishesTemplateController');
    const result = await controller({caseId, content, description});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/global-wishes');
    revalidatePath('/global-wishes-and-blocked');
    return result.data;
}

export async function updateGlobalWishesTemplateAction(
    caseId: number,
    templateId: string,
    data: { content?: GlobalWishesTemplateContent; description?: string }
): Promise<Template<GlobalWishesTemplateContent>> {
    const controller = getInjection('IUpdateGlobalWishesTemplateController');
    const result = await controller({caseId, templateId, data});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/global-wishes');
    return result.data;
}

export async function deleteGlobalWishesTemplateAction(caseId: number, templateId: string): Promise<{ success: boolean }> {
    const controller = getInjection('IDeleteGlobalWishesTemplateController');
    const result = await controller({caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/templates/global-wishes');
    return result.data;
}
