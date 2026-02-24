import type {ICreateTemplateUseCase} from '@/src/application/use-cases/templates/create-template.use-case';
import type {TemplateSummary, TemplateType} from '@/src/entities/models/template.model';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface ICreateTemplateController {
    (input: {
        templateType: TemplateType;
        caseId: number;
        content: unknown;
        description: string;
    }): Promise<{ data: TemplateSummary } | { error: string }>;
}

export function makeCreateTemplateController(
    createTemplateUseCase: ICreateTemplateUseCase
): ICreateTemplateController {
    return async ({templateType, caseId, content, description}) => {
        try {
            const summary = await createTemplateUseCase({templateType, caseId, content, description});
            return {data: summary};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
