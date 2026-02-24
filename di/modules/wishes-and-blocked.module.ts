import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { LowdbWishesAndBlockedRepository } from '@/src/infrastructure/repositories/lowdb-wishes-and-blocked.repository';
import { makeGetAllWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-all-wishes.use-case';
import { makeGetWishesByKeyUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-wishes-by-key.use-case';
import { makeCreateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/create-wishes.use-case';
import { makeUpdateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/update-wishes.use-case';
import { makeDeleteWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/delete-wishes.use-case';
import { makeGetAllWishesController } from '@/src/controllers/wishes-and-blocked/get-all-wishes.controller';
import { makeGetWishesByKeyController } from '@/src/controllers/wishes-and-blocked/get-wishes-by-key.controller';
import { makeCreateWishesController } from '@/src/controllers/wishes-and-blocked/create-wishes.controller';
import { makeUpdateWishesController } from '@/src/controllers/wishes-and-blocked/update-wishes.controller';
import { makeDeleteWishesController } from '@/src/controllers/wishes-and-blocked/delete-wishes.controller';

export function createWishesAndBlockedModule() {
  const m = createModule();

  m.bind(DI_SYMBOLS.IWishesAndBlockedRepository).toClass(LowdbWishesAndBlockedRepository, [], 'singleton');

  m.bind(DI_SYMBOLS.IGetAllWishesUseCase).toHigherOrderFunction(makeGetAllWishesUseCase, [DI_SYMBOLS.IWishesAndBlockedRepository]);
  m.bind(DI_SYMBOLS.IGetWishesByKeyUseCase).toHigherOrderFunction(makeGetWishesByKeyUseCase, [DI_SYMBOLS.IWishesAndBlockedRepository]);
  m.bind(DI_SYMBOLS.ICreateWishesUseCase).toHigherOrderFunction(makeCreateWishesUseCase, [DI_SYMBOLS.IWishesAndBlockedRepository]);
  m.bind(DI_SYMBOLS.IUpdateWishesUseCase).toHigherOrderFunction(makeUpdateWishesUseCase, [DI_SYMBOLS.IWishesAndBlockedRepository]);
  m.bind(DI_SYMBOLS.IDeleteWishesUseCase).toHigherOrderFunction(makeDeleteWishesUseCase, [DI_SYMBOLS.IWishesAndBlockedRepository]);

  m.bind(DI_SYMBOLS.IGetAllWishesController).toHigherOrderFunction(makeGetAllWishesController, [DI_SYMBOLS.IGetAllWishesUseCase]);
  m.bind(DI_SYMBOLS.IGetWishesByKeyController).toHigherOrderFunction(makeGetWishesByKeyController, [DI_SYMBOLS.IGetWishesByKeyUseCase]);
  m.bind(DI_SYMBOLS.ICreateWishesController).toHigherOrderFunction(makeCreateWishesController, [DI_SYMBOLS.ICreateWishesUseCase]);
  m.bind(DI_SYMBOLS.IUpdateWishesController).toHigherOrderFunction(makeUpdateWishesController, [DI_SYMBOLS.IUpdateWishesUseCase]);
  m.bind(DI_SYMBOLS.IDeleteWishesController).toHigherOrderFunction(makeDeleteWishesController, [DI_SYMBOLS.IDeleteWishesUseCase]);

  return m;
}
