import {IWeightsTemplateRepository} from '@/src/application/ports/weights-template.repository';
import {Template} from '@/src/entities/models/template.model';
import {Weights} from '@/src/entities/models/weights.model';
import {TemplateNotFoundError} from '@/src/entities/errors/template.errors';

export interface IGetWeightsTemplateUseCase {
    (input: { caseId: number; templateId: string }): Promise<Template<Weights>>;
}

export function makeGetWeightsTemplateUseCase(
    repository: IWeightsTemplateRepository
): IGetWeightsTemplateUseCase {
    return async ({caseId, templateId}) => {
        try {
            return await repository.get(caseId, templateId);
        } catch {
            throw new TemplateNotFoundError(templateId);
        }
    };
}
