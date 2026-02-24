import { SolverJob } from '@/src/entities/models/solver.model';
import { ResourceNotFoundError } from '@/src/entities/errors/base.errors';
import { IJobRepository } from '@/src/application/ports/job.repository';

export async function getJobUseCase(
  caseId: number,
  jobId: string,
  jobRepository: IJobRepository
): Promise<SolverJob> {
  const job = await jobRepository.getById(caseId, jobId);
  if (!job) throw new ResourceNotFoundError(`Job with id "${jobId}" not found`);
  return job;
}
