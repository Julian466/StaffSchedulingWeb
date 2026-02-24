import { SolverJob } from '@/src/entities/models/solver.model';

export interface IJobRepository {
  getAll(caseId: number): Promise<SolverJob[]>;
  getById(caseId: number, jobId: string): Promise<SolverJob | null>;
  create(caseId: number, job: SolverJob): Promise<void>;
  cleanup(caseId: number, maxJobs?: number): Promise<void>;
}
