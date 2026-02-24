import type {IUpdateTemplateUseCase} from '@/src/application/use-cases/templates/update-template.use-case';
import type {Template, TemplateType} from '@/src/entities/models/template.model';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface IUpdateTemplateController {
    (input: {
        templateType: TemplateType;
        caseId: number;
        templateId: string;
        data: { content?: unknown; description?: string };
    }): Promise<{ data: Template<unknown> } | { error: string }>;
}

export function makeUpdateTemplateController(
    updateTemplateUseCase: IUpdateTemplateUseCase
): IUpdateTemplateController {
    return async ({templateType, caseId, templateId, data}) => {
        try {
            const template = await updateTemplateUseCase({templateType, caseId, templateId, data});
            return {data: template};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
