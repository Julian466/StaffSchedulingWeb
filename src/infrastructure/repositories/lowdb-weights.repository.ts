import { IWeightsRepository } from '@/src/application/ports/weights.repository';
import { Weights } from '@/src/entities/models/weights.model';
import { getWeightsDb } from '@/lib/data/weights/db-weights';

export class LowdbWeightsRepository implements IWeightsRepository {
  async get(caseId: number, monthYear: string): Promise<Weights> {
    const db = await getWeightsDb(caseId, monthYear);
    return db.data;
  }

  async update(caseId: number, monthYear: string, weights: Weights): Promise<void> {
    const db = await getWeightsDb(caseId, monthYear);
    db.data = weights;
    await db.write();
  }
}
