import {ICaseRepository} from '@/src/application/ports/case.repository';
import {CaseUnit} from '@/src/entities/models/case.model';
import {listCases} from '@/src/infrastructure/persistence/lowdb/case.db';

export class LowdbCaseRepository implements ICaseRepository {
    async list(): Promise<CaseUnit[]> {
        return listCases();
    }


}
