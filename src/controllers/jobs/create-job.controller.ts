import { createJobUseCase } from '@/src/application/use-cases/jobs/create-job.use-case';
import { IJobRepository } from '@/src/application/ports/job.repository';
import { SolverJob } from '@/src/entities/models/solver.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class CreateJobController {
  constructor(private readonly jobRepository: IJobRepository) {}

  async execute(caseId: number, monthYear: string, job: SolverJob): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await createJobUseCase(caseId, monthYear, job, this.jobRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
