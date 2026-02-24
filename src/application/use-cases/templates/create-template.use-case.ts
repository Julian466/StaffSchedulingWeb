import {ITemplateRepository} from '@/src/application/ports/template.repository';
import {TemplateSummary, TemplateType} from '@/src/entities/models/template.model';

export interface ICreateTemplateUseCase {
    (input: {
        templateType: TemplateType;
        caseId: number;
        content: unknown;
        description: string;
    }): Promise<TemplateSummary>;
}

export function makeCreateTemplateUseCase(
    templateRepository: ITemplateRepository
): ICreateTemplateUseCase {
    return async ({templateType, caseId, content, description}) => {
        return templateRepository.create(templateType, caseId, content, description);
    };
}
