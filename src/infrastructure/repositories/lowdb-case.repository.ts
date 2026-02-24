import { ICaseRepository } from '@/src/application/ports/case.repository';
import { CaseUnit } from '@/src/entities/models/case.model';
import { listCases, createCase } from '@/src/infrastructure/persistence/lowdb/case.db';

export class LowdbCaseRepository implements ICaseRepository {
  async list(): Promise<CaseUnit[]> {
    return listCases();
  }

  async create(caseId: number, month: number, year: number): Promise<void> {
    await createCase(caseId, month, year);
  }
}
