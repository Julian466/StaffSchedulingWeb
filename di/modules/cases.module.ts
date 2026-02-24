import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { LowdbCaseRepository } from '@/src/infrastructure/repositories/lowdb-case.repository';
import { makeListCasesUseCase } from '@/src/application/use-cases/cases/list-cases.use-case';
import { makeCreateCaseUseCase } from '@/src/application/use-cases/cases/create-case.use-case';
import { makeListCasesController } from '@/src/controllers/cases/list-cases.controller';
import { makeCreateCaseController } from '@/src/controllers/cases/create-case.controller';

export function createCasesModule() {
  const m = createModule();

  m.bind(DI_SYMBOLS.ICaseRepository).toClass(LowdbCaseRepository, [], 'singleton');

  m.bind(DI_SYMBOLS.IListCasesUseCase).toHigherOrderFunction(makeListCasesUseCase, [DI_SYMBOLS.ICaseRepository]);
  m.bind(DI_SYMBOLS.ICreateCaseUseCase).toHigherOrderFunction(makeCreateCaseUseCase, [DI_SYMBOLS.ICaseRepository]);

  m.bind(DI_SYMBOLS.IListCasesController).toHigherOrderFunction(makeListCasesController, [DI_SYMBOLS.IListCasesUseCase]);
  m.bind(DI_SYMBOLS.ICreateCaseController).toHigherOrderFunction(makeCreateCaseController, [DI_SYMBOLS.ICreateCaseUseCase]);

  return m;
}
