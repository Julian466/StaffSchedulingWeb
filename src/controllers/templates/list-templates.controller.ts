import type {IListTemplatesUseCase} from '@/src/application/use-cases/templates/list-templates.use-case';
import type {TemplateSummary, TemplateType} from '@/src/entities/models/template.model';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface IListTemplatesController {
    (input: { templateType: TemplateType; caseId: number }): Promise<
        { data: TemplateSummary[] } | { error: string }
    >;
}

export function makeListTemplatesController(
    listTemplatesUseCase: IListTemplatesUseCase
): IListTemplatesController {
    return async ({templateType, caseId}) => {
        try {
            const templates = await listTemplatesUseCase({templateType, caseId});
            return {data: templates};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
