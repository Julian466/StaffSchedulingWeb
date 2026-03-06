import {Template, TemplateSummary} from '@/src/entities/models/template.model';
import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';

export interface IMinimalStaffTemplateRepository {
    list(caseId: number): Promise<TemplateSummary[]>;

    get(caseId: number, templateId: string): Promise<Template<MinimalStaffRequirements>>;

    create(caseId: number, content: MinimalStaffRequirements, description: string): Promise<TemplateSummary>;

    update(
        caseId: number,
        templateId: string,
        data: { content?: MinimalStaffRequirements; description?: string }
    ): Promise<Template<MinimalStaffRequirements>>;

    delete(caseId: number, templateId: string): Promise<void>;
}
