import {ITemplateRepository} from '@/src/application/ports/template.repository';
import {Template, TemplateType} from '@/src/entities/models/template.model';
import {TemplateNotFoundError} from '@/src/entities/errors/template.errors';

export interface IGetTemplateUseCase {
    (input: { templateType: TemplateType; caseId: number; templateId: string }): Promise<Template<unknown>>;
}

export function makeGetTemplateUseCase(
    templateRepository: ITemplateRepository
): IGetTemplateUseCase {
    return async ({templateType, caseId, templateId}) => {
        try {
            return await templateRepository.get(templateType, caseId, templateId);
        } catch {
            throw new TemplateNotFoundError(templateId);
        }
    };
}
