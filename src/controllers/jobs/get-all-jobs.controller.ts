import { getAllJobsUseCase } from '@/src/application/use-cases/jobs/get-all-jobs.use-case';
import { IJobRepository } from '@/src/application/ports/job.repository';
import { SolverJob } from '@/src/entities/models/solver.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class GetAllJobsController {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(caseId: number, monthYear: string): Promise<{ data: SolverJob[] } | { error: string }> {
    try {
      const jobs = await getAllJobsUseCase(caseId, monthYear, this.jobRepository);
      return { data: jobs };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
