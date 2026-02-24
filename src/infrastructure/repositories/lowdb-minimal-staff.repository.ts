import { IMinimalStaffRepository } from '@/src/application/ports/minimal-staff.repository';
import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';
import { getMinimalStaffDb } from '@/src/infrastructure/persistence/lowdb/minimal-staff.db';

export class LowdbMinimalStaffRepository implements IMinimalStaffRepository {
  async get(caseId: number, monthYear: string): Promise<MinimalStaffRequirements> {
    const db = await getMinimalStaffDb(caseId, monthYear);
    return db.data;
  }

  async update(caseId: number, monthYear: string, data: MinimalStaffRequirements): Promise<void> {
    const db = await getMinimalStaffDb(caseId, monthYear);
    db.data = data;
    await db.write();
  }
}
