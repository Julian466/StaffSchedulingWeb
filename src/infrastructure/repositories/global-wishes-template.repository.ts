import {IGlobalWishesTemplateRepository} from '@/src/application/ports/global-wishes-template.repository';
import {GlobalWishesTemplateContent, Template} from '@/src/entities/models/template.model';
import {globalWishesTemplateRepository} from '@/lib/services/template-repository';

/**
 * Infrastructure adapter that wraps the file-based global wishes template repository.
 * Registered in the DI container as IGlobalWishesTemplateRepository.
 */
export class GlobalWishesTemplateRepositoryAdapter implements IGlobalWishesTemplateRepository {
    async get(caseId: number, templateId: string): Promise<Template<GlobalWishesTemplateContent>> {
        return globalWishesTemplateRepository.get(caseId, templateId) as Promise<Template<GlobalWishesTemplateContent>>;
    }
}
