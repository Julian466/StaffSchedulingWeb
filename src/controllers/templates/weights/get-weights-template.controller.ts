import type {
    IGetWeightsTemplateUseCase
} from '@/src/application/use-cases/templates/weights/get-weights-template.use-case';
import type {Template} from '@/src/entities/models/template.model';
import type {Weights} from '@/src/entities/models/weights.model';
import {isDomainError} from '@/src/entities/errors/base.errors';

export interface IGetWeightsTemplateController {
    (input: { caseId: number; templateId: string }): Promise<{ data: Template<Weights> } | { error: string }>;
}

export function makeGetWeightsTemplateController(
    getWeightsTemplateUseCase: IGetWeightsTemplateUseCase
): IGetWeightsTemplateController {
    return async ({caseId, templateId}) => {
        try {
            const template = await getWeightsTemplateUseCase({caseId, templateId});
            return {data: template};
        } catch (error) {
            if (isDomainError(error)) return {error: error.message};
            throw error;
        }
    };
}
