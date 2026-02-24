import type {IGetTemplateUseCase} from '@/src/application/use-cases/templates/get-template.use-case';
import type {Template, TemplateType} from '@/src/entities/models/template.model';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface IGetTemplateController {
    (input: { templateType: TemplateType; caseId: number; templateId: string }): Promise<
        { data: Template<unknown> } | { error: string }
    >;
}

export function makeGetTemplateController(
    getTemplateUseCase: IGetTemplateUseCase
): IGetTemplateController {
    return async ({templateType, caseId, templateId}) => {
        try {
            const template = await getTemplateUseCase({templateType, caseId, templateId});
            return {data: template};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
