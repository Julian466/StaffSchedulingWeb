import {Template, TemplateSummary, TemplateType} from '@/src/entities/models/template.model';

export interface ITemplateRepository {
    list(templateType: TemplateType, caseId: number): Promise<TemplateSummary[]>;

    get(templateType: TemplateType, caseId: number, templateId: string): Promise<Template<unknown>>;

    create(
        templateType: TemplateType,
        caseId: number,
        content: unknown,
        description: string
    ): Promise<TemplateSummary>;

    update(
        templateType: TemplateType,
        caseId: number,
        templateId: string,
        data: { content?: unknown; description?: string }
    ): Promise<Template<unknown>>;

    delete(templateType: TemplateType, caseId: number, templateId: string): Promise<void>;
}
