import {ITemplateRepository} from '@/src/application/ports/template.repository';
import {TemplateType} from '@/src/entities/models/template.model';
import {TemplateNotFoundError} from '@/src/entities/errors/template.errors';

export interface IDeleteTemplateUseCase {
    (input: { templateType: TemplateType; caseId: number; templateId: string }): Promise<void>;
}

export function makeDeleteTemplateUseCase(
    templateRepository: ITemplateRepository
): IDeleteTemplateUseCase {
    return async ({templateType, caseId, templateId}) => {
        try {
            await templateRepository.delete(templateType, caseId, templateId);
        } catch {
            throw new TemplateNotFoundError(templateId);
        }
    };
}
