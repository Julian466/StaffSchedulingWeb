import {ITemplateRepository} from '@/src/application/ports/template.repository';
import {
    GlobalWishesTemplateContent,
    Template,
    TemplateSummary,
    TemplateType,
} from '@/src/entities/models/template.model';
import {
    createTemplateRepository,
    globalWishesTemplateRepository,
} from '@/lib/services/template-repository';

/**
 * Infrastructure adapter that unifies all template types (weights, minimal-staff, global-wishes)
 * behind the ITemplateRepository interface using the file-based storage from lib/services.
 */
export class FileTemplateRepository implements ITemplateRepository {
    private readonly weightsRepo = createTemplateRepository<unknown>('weights');
    private readonly minimalStaffRepo = createTemplateRepository<unknown>('minimal-staff');

    private getRepo(templateType: TemplateType) {
        switch (templateType) {
            case 'weights':
                return this.weightsRepo;
            case 'minimal-staff':
                return this.minimalStaffRepo;
            case 'global-wishes':
                return globalWishesTemplateRepository;
        }
    }

    async list(templateType: TemplateType, caseId: number): Promise<TemplateSummary[]> {
        return this.getRepo(templateType).list(caseId);
    }

    async get(templateType: TemplateType, caseId: number, templateId: string): Promise<Template<unknown>> {
        return this.getRepo(templateType).get(caseId, templateId);
    }

    async create(
        templateType: TemplateType,
        caseId: number,
        content: unknown,
        description: string
    ): Promise<TemplateSummary> {
        if (templateType === 'global-wishes') {
            const result = await globalWishesTemplateRepository.create(
                caseId,
                content as GlobalWishesTemplateContent,
                description
            );
            return {
                id: result._metadata.id,
                description: result._metadata.description,
                last_modified: result._metadata.last_modified,
                type: templateType,
                fileName: `global-wishes_${result._metadata.id}.json`,
            };
        }

        const result = await this.getRepo(templateType).create(caseId, content, description);
        return {
            id: result._metadata.id,
            description: result._metadata.description,
            last_modified: result._metadata.last_modified,
            type: templateType,
            fileName: `${templateType}_${result._metadata.id}.json`,
        };
    }

    async update(
        templateType: TemplateType,
        caseId: number,
        templateId: string,
        data: { content?: unknown; description?: string }
    ): Promise<Template<unknown>> {
        if (templateType === 'global-wishes') {
            return globalWishesTemplateRepository.update(
                caseId,
                templateId,
                data as { content?: GlobalWishesTemplateContent; description?: string }
            );
        }
        return this.getRepo(templateType).update(caseId, templateId, data);
    }

    async delete(templateType: TemplateType, caseId: number, templateId: string): Promise<void> {
        return this.getRepo(templateType).delete(caseId, templateId);
    }
}
