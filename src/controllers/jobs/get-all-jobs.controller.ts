import { makeGetAllJobsUseCase, IGetAllJobsUseCase } from '@/src/application/use-cases/jobs/get-all-jobs.use-case';
import { IJobRepository } from '@/src/application/ports/job.repository';
import { SolverJob } from '@/src/entities/models/solver.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetAllJobsController {
  private readonly getAllJobs: IGetAllJobsUseCase;

  constructor(jobRepository: IJobRepository) {
    this.getAllJobs = makeGetAllJobsUseCase(jobRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: SolverJob[] } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const jobs = await this.getAllJobs({ caseId, monthYear });
      return { data: jobs };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
