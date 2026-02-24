import {GlobalWishesTemplateContent, Template} from '@/src/entities/models/template.model';

export interface IGlobalWishesTemplateRepository {
    get(caseId: number, templateId: string): Promise<Template<GlobalWishesTemplateContent>>;
}
