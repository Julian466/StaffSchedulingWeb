import {ITemplateRepository} from '@/src/application/ports/template.repository';
import {TemplateSummary, TemplateType} from '@/src/entities/models/template.model';

export interface IListTemplatesUseCase {
    (input: { templateType: TemplateType; caseId: number }): Promise<TemplateSummary[]>;
}

export function makeListTemplatesUseCase(
    templateRepository: ITemplateRepository
): IListTemplatesUseCase {
    return async ({templateType, caseId}) => {
        return templateRepository.list(templateType, caseId);
    };
}
