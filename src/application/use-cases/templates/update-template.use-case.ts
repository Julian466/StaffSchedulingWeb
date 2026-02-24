import {ITemplateRepository} from '@/src/application/ports/template.repository';
import {Template, TemplateType} from '@/src/entities/models/template.model';
import {TemplateNotFoundError} from '@/src/entities/errors/template.errors';

export interface IUpdateTemplateUseCase {
    (input: {
        templateType: TemplateType;
        caseId: number;
        templateId: string;
        data: { content?: unknown; description?: string };
    }): Promise<Template<unknown>>;
}

export function makeUpdateTemplateUseCase(
    templateRepository: ITemplateRepository
): IUpdateTemplateUseCase {
    return async ({templateType, caseId, templateId, data}) => {
        try {
            return await templateRepository.update(templateType, caseId, templateId, data);
        } catch {
            throw new TemplateNotFoundError(templateId);
        }
    };
}
