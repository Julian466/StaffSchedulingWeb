import { makeGetJobUseCase, IGetJobUseCase } from '@/src/application/use-cases/jobs/get-job.use-case';
import { IJobRepository } from '@/src/application/ports/job.repository';
import { SolverJob } from '@/src/entities/models/solver.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetJobController {
  private readonly getJob: IGetJobUseCase;

  constructor(jobRepository: IJobRepository) {
    this.getJob = makeGetJobUseCase(jobRepository);
  }

  async execute(caseId: number, monthYear: string, jobId: string): Promise<{ data: SolverJob } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const job = await this.getJob({ caseId, monthYear, jobId });
      return { data: job };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
