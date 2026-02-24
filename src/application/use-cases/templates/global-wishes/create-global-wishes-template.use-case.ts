import {IGlobalWishesTemplateRepository} from '@/src/application/ports/global-wishes-template.repository';
import {GlobalWishesTemplateContent, TemplateSummary} from '@/src/entities/models/template.model';

export interface ICreateGlobalWishesTemplateUseCase {
    (input: { caseId: number; content: GlobalWishesTemplateContent; description: string }): Promise<TemplateSummary>;
}

export function makeCreateGlobalWishesTemplateUseCase(
    repository: IGlobalWishesTemplateRepository
): ICreateGlobalWishesTemplateUseCase {
    return async ({caseId, content, description}) => {
        return repository.create(caseId, content, description);
    };
}
