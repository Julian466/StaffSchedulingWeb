import { getJobUseCase } from '@/src/application/use-cases/jobs/get-job.use-case';
import { IJobRepository } from '@/src/application/ports/job.repository';
import { SolverJob } from '@/src/entities/models/solver.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class GetJobController {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(caseId: number, monthYear: string, jobId: string): Promise<{ data: SolverJob } | { error: string }> {
    try {
      const job = await getJobUseCase(caseId, monthYear, jobId, this.jobRepository);
      return { data: job };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
