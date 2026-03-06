import {IMinimalStaffTemplateRepository} from '@/src/application/ports/minimal-staff-template.repository';
import {TemplateSummary} from '@/src/entities/models/template.model';
import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';

export interface ICreateMinimalStaffTemplateUseCase {
    (input: { caseId: number; content: MinimalStaffRequirements; description: string }): Promise<TemplateSummary>;
}

export function makeCreateMinimalStaffTemplateUseCase(
    repository: IMinimalStaffTemplateRepository
): ICreateMinimalStaffTemplateUseCase {
    return async ({caseId, content, description}) => {
        return repository.create(caseId, content, description);
    };
}
