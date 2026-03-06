import {CaseUnit} from '@/src/entities/models/case.model';

export interface ICaseRepository {
    list(): Promise<CaseUnit[]>;
}
