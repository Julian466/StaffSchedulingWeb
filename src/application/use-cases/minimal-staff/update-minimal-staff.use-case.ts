import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';
import {IMinimalStaffRepository} from '@/src/application/ports/minimal-staff.repository';

export interface IUpdateMinimalStaffUseCase {
    (input: { caseId: number; monthYear: string; data: MinimalStaffRequirements }): Promise<void>;
}

export function makeUpdateMinimalStaffUseCase(
    minimalStaffRepository: IMinimalStaffRepository
): IUpdateMinimalStaffUseCase {
    return async ({caseId, monthYear, data}) => {
        return minimalStaffRepository.update(caseId, monthYear, data);
    };
}
