import { SolverJob } from '@/src/entities/models/solver.model';
import { IJobRepository } from '@/src/application/ports/job.repository';

export async function getAllJobsUseCase(
  caseId: number,
  jobRepository: IJobRepository
): Promise<SolverJob[]> {
  return jobRepository.getAll(caseId);
}
