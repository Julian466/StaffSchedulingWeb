'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import type {Template, TemplateSummary, TemplateType} from '@/src/entities/models/template.model';

export async function listTemplatesAction(templateType: TemplateType, caseId: number): Promise<TemplateSummary[]> {
    const controller = getInjection('IListTemplatesController');
    const result = await controller({templateType, caseId});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function getTemplateAction<T>(templateType: TemplateType, caseId: number, templateId: string): Promise<Template<T>> {
    const controller = getInjection('IGetTemplateController');
    const result = await controller({templateType, caseId, templateId});
    if ('error' in result) throw new Error(result.error);
    return result.data as Template<T>;
}

export async function createTemplateAction(templateType: TemplateType, caseId: number, content: unknown, description: string): Promise<TemplateSummary> {
    const controller = getInjection('ICreateTemplateController');
    const result = await controller({templateType, caseId, content, description});
    if ('error' in result) throw new Error(result.error);

    if (templateType === 'global-wishes') {
        revalidatePath('/templates/global-wishes');
        revalidatePath('/global-wishes-and-blocked');
    } else {
        revalidatePath(`/templates/${templateType}`);
    }

    return result.data;
}

export async function updateTemplateAction(
    templateType: TemplateType,
    caseId: number,
    templateId: string,
    data: { content?: unknown; description?: string }
): Promise<Template<unknown>> {
    const controller = getInjection('IUpdateTemplateController');
    const result = await controller({templateType, caseId, templateId, data});
    if ('error' in result) throw new Error(result.error);

    if (templateType === 'global-wishes') {
        revalidatePath('/templates/global-wishes');
    } else {
        revalidatePath(`/templates/${templateType}`);
    }

    return result.data;
}

export async function deleteTemplateAction(templateType: TemplateType, caseId: number, templateId: string): Promise<{ success: boolean }> {
    const controller = getInjection('IDeleteTemplateController');
    const result = await controller({templateType, caseId, templateId});
    if ('error' in result) throw new Error(result.error);

    if (templateType === 'global-wishes') {
        revalidatePath('/templates/global-wishes');
    } else {
        revalidatePath(`/templates/${templateType}`);
    }

    return result.data;
}

