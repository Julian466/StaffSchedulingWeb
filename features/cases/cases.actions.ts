'use server';

import {getInjection} from '@/di/container';
import {CaseUnit} from '@/src/entities/models/case.model';

export async function listCasesAction(): Promise<{ units: CaseUnit[] }> {
    const controller = getInjection('IListCasesController');
    const result = await controller();
    if ('error' in result) throw new Error(result.error);
    return {units: result.data};
}
