import { SolverJob } from '@/src/entities/models/solver.model';
import { IJobRepository } from '@/src/application/ports/job.repository';

export interface ICreateJobUseCase {
  (input: { caseId: number; monthYear: string; job: SolverJob }): Promise<void>;
}

export function makeCreateJobUseCase(
  jobRepository: IJobRepository
): ICreateJobUseCase {
  return async ({ caseId, monthYear, job }) => {
    await jobRepository.create(caseId, monthYear, job);
    await jobRepository.cleanup(caseId, monthYear);
  };
}
