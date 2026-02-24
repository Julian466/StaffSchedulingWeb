import {ICaseRepository} from '@/src/application/ports/case.repository';

export interface ICreateCaseUseCase {
    (input: { caseId: number; month: number; year: number }): Promise<void>;
}

export function makeCreateCaseUseCase(
    caseRepository: ICaseRepository
): ICreateCaseUseCase {
    return async ({caseId, month, year}) => {
        return caseRepository.create(caseId, month, year);
    };
}
