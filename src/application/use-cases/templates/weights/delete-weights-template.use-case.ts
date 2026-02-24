import {IWeightsTemplateRepository} from '@/src/application/ports/weights-template.repository';
import {TemplateNotFoundError} from '@/src/entities/errors/template.errors';

export interface IDeleteWeightsTemplateUseCase {
    (input: { caseId: number; templateId: string }): Promise<void>;
}

export function makeDeleteWeightsTemplateUseCase(
    repository: IWeightsTemplateRepository
): IDeleteWeightsTemplateUseCase {
    return async ({caseId, templateId}) => {
        try {
            await repository.delete(caseId, templateId);
        } catch {
            throw new TemplateNotFoundError(templateId);
        }
    };
}
