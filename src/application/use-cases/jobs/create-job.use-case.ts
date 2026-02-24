import { SolverJob } from '@/src/entities/models/solver.model';
import { IJobRepository } from '@/src/application/ports/job.repository';

export async function createJobUseCase(
  caseId: number,
  job: SolverJob,
  jobRepository: IJobRepository
): Promise<void> {
  await jobRepository.create(caseId, job);
  await jobRepository.cleanup(caseId);
}
