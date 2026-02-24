import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { LowdbScheduleRepository } from '@/src/infrastructure/repositories/lowdb-schedule.repository';
import { makeGetSchedulesMetadataUseCase } from '@/src/application/use-cases/schedule/get-schedules-metadata.use-case';
import { makeGetScheduleUseCase } from '@/src/application/use-cases/schedule/get-schedule.use-case';
import { makeSaveScheduleUseCase } from '@/src/application/use-cases/schedule/save-schedule.use-case';
import { makeDeleteScheduleUseCase } from '@/src/application/use-cases/schedule/delete-schedule.use-case';
import { makeSelectScheduleUseCase } from '@/src/application/use-cases/schedule/select-schedule.use-case';
import { makeUpdateScheduleMetadataUseCase } from '@/src/application/use-cases/schedule/update-schedule-metadata.use-case';
import { makeGetSchedulesMetadataController } from '@/src/controllers/schedule/get-schedules-metadata.controller';
import { makeGetScheduleController } from '@/src/controllers/schedule/get-schedule.controller';
import { makeSaveScheduleController } from '@/src/controllers/schedule/save-schedule.controller';
import { makeDeleteScheduleController } from '@/src/controllers/schedule/delete-schedule.controller';
import { makeSelectScheduleController } from '@/src/controllers/schedule/select-schedule.controller';
import { makeUpdateScheduleMetadataController } from '@/src/controllers/schedule/update-schedule-metadata.controller';

export function createSchedulesModule() {
  const m = createModule();

  m.bind(DI_SYMBOLS.IScheduleRepository).toClass(LowdbScheduleRepository, [], 'singleton');

  m.bind(DI_SYMBOLS.IGetSchedulesMetadataUseCase).toHigherOrderFunction(makeGetSchedulesMetadataUseCase, [DI_SYMBOLS.IScheduleRepository]);
  m.bind(DI_SYMBOLS.IGetScheduleUseCase).toHigherOrderFunction(makeGetScheduleUseCase, [DI_SYMBOLS.IScheduleRepository]);
  m.bind(DI_SYMBOLS.ISaveScheduleUseCase).toHigherOrderFunction(makeSaveScheduleUseCase, [DI_SYMBOLS.IScheduleRepository]);
  m.bind(DI_SYMBOLS.IDeleteScheduleUseCase).toHigherOrderFunction(makeDeleteScheduleUseCase, [DI_SYMBOLS.IScheduleRepository]);
  m.bind(DI_SYMBOLS.ISelectScheduleUseCase).toHigherOrderFunction(makeSelectScheduleUseCase, [DI_SYMBOLS.IScheduleRepository]);
  m.bind(DI_SYMBOLS.IUpdateScheduleMetadataUseCase).toHigherOrderFunction(makeUpdateScheduleMetadataUseCase, [DI_SYMBOLS.IScheduleRepository]);

  m.bind(DI_SYMBOLS.IGetSchedulesMetadataController).toHigherOrderFunction(makeGetSchedulesMetadataController, [DI_SYMBOLS.IGetSchedulesMetadataUseCase]);
  m.bind(DI_SYMBOLS.IGetScheduleController).toHigherOrderFunction(makeGetScheduleController, [DI_SYMBOLS.IGetScheduleUseCase]);
  m.bind(DI_SYMBOLS.ISaveScheduleController).toHigherOrderFunction(makeSaveScheduleController, [DI_SYMBOLS.ISaveScheduleUseCase]);
  m.bind(DI_SYMBOLS.IDeleteScheduleController).toHigherOrderFunction(makeDeleteScheduleController, [DI_SYMBOLS.IDeleteScheduleUseCase]);
  m.bind(DI_SYMBOLS.ISelectScheduleController).toHigherOrderFunction(makeSelectScheduleController, [DI_SYMBOLS.ISelectScheduleUseCase]);
  m.bind(DI_SYMBOLS.IUpdateScheduleMetadataController).toHigherOrderFunction(makeUpdateScheduleMetadataController, [DI_SYMBOLS.IUpdateScheduleMetadataUseCase]);

  return m;
}
