import 'server-only';

// Repository implementations
import { LowdbEmployeeRepository } from '@/src/infrastructure/repositories/lowdb-employee.repository';
import { LowdbWeightsRepository } from '@/src/infrastructure/repositories/lowdb-weights.repository';
import { LowdbMinimalStaffRepository } from '@/src/infrastructure/repositories/lowdb-minimal-staff.repository';
import { LowdbWishesAndBlockedRepository } from '@/src/infrastructure/repositories/lowdb-wishes-and-blocked.repository';
import { LowdbGlobalWishesAndBlockedRepository } from '@/src/infrastructure/repositories/lowdb-global-wishes-and-blocked.repository';
import { LowdbScheduleRepository } from '@/src/infrastructure/repositories/lowdb-schedule.repository';
import { LowdbJobRepository } from '@/src/infrastructure/repositories/lowdb-job.repository';
import { LowdbCaseRepository } from '@/src/infrastructure/repositories/lowdb-case.repository';

// Use case factories
import { makeGetAllEmployeesUseCase } from '@/src/application/use-cases/employees/get-all-employees.use-case';
import { makeGetEmployeeUseCase } from '@/src/application/use-cases/employees/get-employee.use-case';
import { makeCreateEmployeeUseCase } from '@/src/application/use-cases/employees/create-employee.use-case';
import { makeGetWeightsUseCase } from '@/src/application/use-cases/weights/get-weights.use-case';
import { makeUpdateWeightsUseCase } from '@/src/application/use-cases/weights/update-weights.use-case';
import { makeGetMinimalStaffUseCase } from '@/src/application/use-cases/minimal-staff/get-minimal-staff.use-case';
import { makeUpdateMinimalStaffUseCase } from '@/src/application/use-cases/minimal-staff/update-minimal-staff.use-case';
import { makeGetAllWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-all-wishes.use-case';
import { makeGetWishesByKeyUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-wishes-by-key.use-case';
import { makeCreateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/create-wishes.use-case';
import { makeUpdateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/update-wishes.use-case';
import { makeDeleteWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/delete-wishes.use-case';
import { makeGetAllGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/get-all-global-wishes.use-case';
import { makeGetGlobalWishesByKeyUseCase } from '@/src/application/use-cases/global-wishes/get-global-wishes-by-key.use-case';
import { makeCreateGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/create-global-wishes.use-case';
import { makeUpdateGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/update-global-wishes.use-case';
import { makeDeleteGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/delete-global-wishes.use-case';
import { makeGetSchedulesMetadataUseCase } from '@/src/application/use-cases/schedule/get-schedules-metadata.use-case';
import { makeGetScheduleUseCase } from '@/src/application/use-cases/schedule/get-schedule.use-case';
import { makeSaveScheduleUseCase } from '@/src/application/use-cases/schedule/save-schedule.use-case';
import { makeDeleteScheduleUseCase } from '@/src/application/use-cases/schedule/delete-schedule.use-case';
import { makeSelectScheduleUseCase } from '@/src/application/use-cases/schedule/select-schedule.use-case';
import { makeUpdateScheduleMetadataUseCase } from '@/src/application/use-cases/schedule/update-schedule-metadata.use-case';
import { makeGetAllJobsUseCase } from '@/src/application/use-cases/jobs/get-all-jobs.use-case';
import { makeGetJobUseCase } from '@/src/application/use-cases/jobs/get-job.use-case';
import { makeCreateJobUseCase } from '@/src/application/use-cases/jobs/create-job.use-case';
import { makeListCasesUseCase } from '@/src/application/use-cases/cases/list-cases.use-case';
import { makeCreateCaseUseCase } from '@/src/application/use-cases/cases/create-case.use-case';

// Controller factories
import { makeGetAllEmployeesController } from '@/src/controllers/employees/get-all-employees.controller';
import { makeGetEmployeeController } from '@/src/controllers/employees/get-employee.controller';
import { makeCreateEmployeeController } from '@/src/controllers/employees/create-employee.controller';

import { makeGetWeightsController } from '@/src/controllers/weights/get-weights.controller';
import { makeUpdateWeightsController } from '@/src/controllers/weights/update-weights.controller';

import { makeGetMinimalStaffController } from '@/src/controllers/minimal-staff/get-minimal-staff.controller';
import { makeUpdateMinimalStaffController } from '@/src/controllers/minimal-staff/update-minimal-staff.controller';

import { makeGetAllWishesController } from '@/src/controllers/wishes-and-blocked/get-all-wishes.controller';
import { makeGetWishesByKeyController } from '@/src/controllers/wishes-and-blocked/get-wishes-by-key.controller';
import { makeCreateWishesController } from '@/src/controllers/wishes-and-blocked/create-wishes.controller';
import { makeUpdateWishesController } from '@/src/controllers/wishes-and-blocked/update-wishes.controller';
import { makeDeleteWishesController } from '@/src/controllers/wishes-and-blocked/delete-wishes.controller';

import { makeGetAllGlobalWishesController } from '@/src/controllers/global-wishes/get-all-global-wishes.controller';
import { makeGetGlobalWishesByKeyController } from '@/src/controllers/global-wishes/get-global-wishes-by-key.controller';
import { makeCreateGlobalWishesController } from '@/src/controllers/global-wishes/create-global-wishes.controller';
import { makeUpdateGlobalWishesController } from '@/src/controllers/global-wishes/update-global-wishes.controller';
import { makeDeleteGlobalWishesController } from '@/src/controllers/global-wishes/delete-global-wishes.controller';

import { makeGetSchedulesMetadataController } from '@/src/controllers/schedule/get-schedules-metadata.controller';
import { makeGetScheduleController } from '@/src/controllers/schedule/get-schedule.controller';
import { makeSaveScheduleController } from '@/src/controllers/schedule/save-schedule.controller';
import { makeDeleteScheduleController } from '@/src/controllers/schedule/delete-schedule.controller';
import { makeSelectScheduleController } from '@/src/controllers/schedule/select-schedule.controller';
import { makeUpdateScheduleMetadataController } from '@/src/controllers/schedule/update-schedule-metadata.controller';

import { makeGetAllJobsController } from '@/src/controllers/jobs/get-all-jobs.controller';
import { makeGetJobController } from '@/src/controllers/jobs/get-job.controller';
import { makeCreateJobController } from '@/src/controllers/jobs/create-job.controller';

import { makeListCasesController } from '@/src/controllers/cases/list-cases.controller';
import { makeCreateCaseController } from '@/src/controllers/cases/create-case.controller';

// Controller interface types
import type { IGetAllEmployeesController } from '@/src/controllers/employees/get-all-employees.controller';
import type { IGetEmployeeController } from '@/src/controllers/employees/get-employee.controller';
import type { ICreateEmployeeController } from '@/src/controllers/employees/create-employee.controller';
import type { IGetWeightsController } from '@/src/controllers/weights/get-weights.controller';
import type { IUpdateWeightsController } from '@/src/controllers/weights/update-weights.controller';
import type { IGetMinimalStaffController } from '@/src/controllers/minimal-staff/get-minimal-staff.controller';
import type { IUpdateMinimalStaffController } from '@/src/controllers/minimal-staff/update-minimal-staff.controller';
import type { IGetAllWishesController } from '@/src/controllers/wishes-and-blocked/get-all-wishes.controller';
import type { IGetWishesByKeyController } from '@/src/controllers/wishes-and-blocked/get-wishes-by-key.controller';
import type { ICreateWishesController } from '@/src/controllers/wishes-and-blocked/create-wishes.controller';
import type { IUpdateWishesController } from '@/src/controllers/wishes-and-blocked/update-wishes.controller';
import type { IDeleteWishesController } from '@/src/controllers/wishes-and-blocked/delete-wishes.controller';
import type { IGetAllGlobalWishesController } from '@/src/controllers/global-wishes/get-all-global-wishes.controller';
import type { IGetGlobalWishesByKeyController } from '@/src/controllers/global-wishes/get-global-wishes-by-key.controller';
import type { ICreateGlobalWishesController } from '@/src/controllers/global-wishes/create-global-wishes.controller';
import type { IUpdateGlobalWishesController } from '@/src/controllers/global-wishes/update-global-wishes.controller';
import type { IDeleteGlobalWishesController } from '@/src/controllers/global-wishes/delete-global-wishes.controller';
import type { IGetSchedulesMetadataController } from '@/src/controllers/schedule/get-schedules-metadata.controller';
import type { IGetScheduleController } from '@/src/controllers/schedule/get-schedule.controller';
import type { ISaveScheduleController } from '@/src/controllers/schedule/save-schedule.controller';
import type { IDeleteScheduleController } from '@/src/controllers/schedule/delete-schedule.controller';
import type { ISelectScheduleController } from '@/src/controllers/schedule/select-schedule.controller';
import type { IUpdateScheduleMetadataController } from '@/src/controllers/schedule/update-schedule-metadata.controller';
import type { IGetAllJobsController } from '@/src/controllers/jobs/get-all-jobs.controller';
import type { IGetJobController } from '@/src/controllers/jobs/get-job.controller';
import type { ICreateJobController } from '@/src/controllers/jobs/create-job.controller';
import type { IListCasesController } from '@/src/controllers/cases/list-cases.controller';
import type { ICreateCaseController } from '@/src/controllers/cases/create-case.controller';

// Registry type mapping interface names to implementations
type Registry = {
  // Repositories
  IEmployeeRepository: LowdbEmployeeRepository;
  IWeightsRepository: LowdbWeightsRepository;
  IMinimalStaffRepository: LowdbMinimalStaffRepository;
  IWishesAndBlockedRepository: LowdbWishesAndBlockedRepository;
  IGlobalWishesAndBlockedRepository: LowdbGlobalWishesAndBlockedRepository;
  IScheduleRepository: LowdbScheduleRepository;
  IJobRepository: LowdbJobRepository;
  ICaseRepository: LowdbCaseRepository;

  // Controllers
  GetAllEmployeesController: IGetAllEmployeesController;
  GetEmployeeController: IGetEmployeeController;
  CreateEmployeeController: ICreateEmployeeController;
  GetWeightsController: IGetWeightsController;
  UpdateWeightsController: IUpdateWeightsController;
  GetMinimalStaffController: IGetMinimalStaffController;
  UpdateMinimalStaffController: IUpdateMinimalStaffController;
  GetAllWishesController: IGetAllWishesController;
  GetWishesByKeyController: IGetWishesByKeyController;
  CreateWishesController: ICreateWishesController;
  UpdateWishesController: IUpdateWishesController;
  DeleteWishesController: IDeleteWishesController;
  GetAllGlobalWishesController: IGetAllGlobalWishesController;
  GetGlobalWishesByKeyController: IGetGlobalWishesByKeyController;
  CreateGlobalWishesController: ICreateGlobalWishesController;
  UpdateGlobalWishesController: IUpdateGlobalWishesController;
  DeleteGlobalWishesController: IDeleteGlobalWishesController;
  GetSchedulesMetadataController: IGetSchedulesMetadataController;
  GetScheduleController: IGetScheduleController;
  SaveScheduleController: ISaveScheduleController;
  DeleteScheduleController: IDeleteScheduleController;
  SelectScheduleController: ISelectScheduleController;
  UpdateScheduleMetadataController: IUpdateScheduleMetadataController;
  GetAllJobsController: IGetAllJobsController;
  GetJobController: IGetJobController;
  CreateJobController: ICreateJobController;
  ListCasesController: IListCasesController;
  CreateCaseController: ICreateCaseController;
};

const singletonInstances = new Map<string, unknown>();

function getOrCreate<K extends keyof Registry>(key: K, factory: () => Registry[K]): Registry[K] {
  if (!singletonInstances.has(key)) {
    singletonInstances.set(key, factory());
  }
  return singletonInstances.get(key) as Registry[K];
}

// Factory functions for each registry entry
const factories: { [K in keyof Registry]: () => Registry[K] } = {
  // Repositories
  IEmployeeRepository: () => new LowdbEmployeeRepository(),
  IWeightsRepository: () => new LowdbWeightsRepository(),
  IMinimalStaffRepository: () => new LowdbMinimalStaffRepository(),
  IWishesAndBlockedRepository: () => new LowdbWishesAndBlockedRepository(),
  IGlobalWishesAndBlockedRepository: () => new LowdbGlobalWishesAndBlockedRepository(),
  IScheduleRepository: () => new LowdbScheduleRepository(),
  IJobRepository: () => new LowdbJobRepository(),
  ICaseRepository: () => new LowdbCaseRepository(),

  // Controllers (depend on use cases, which depend on repositories)
  GetAllEmployeesController: () =>
    makeGetAllEmployeesController(makeGetAllEmployeesUseCase(getInjection('IEmployeeRepository'))),
  GetEmployeeController: () =>
    makeGetEmployeeController(makeGetEmployeeUseCase(getInjection('IEmployeeRepository'))),
  CreateEmployeeController: () =>
    makeCreateEmployeeController(makeCreateEmployeeUseCase(getInjection('IEmployeeRepository'))),
  GetWeightsController: () =>
    makeGetWeightsController(makeGetWeightsUseCase(getInjection('IWeightsRepository'))),
  UpdateWeightsController: () =>
    makeUpdateWeightsController(makeUpdateWeightsUseCase(getInjection('IWeightsRepository'))),
  GetMinimalStaffController: () =>
    makeGetMinimalStaffController(makeGetMinimalStaffUseCase(getInjection('IMinimalStaffRepository'))),
  UpdateMinimalStaffController: () =>
    makeUpdateMinimalStaffController(makeUpdateMinimalStaffUseCase(getInjection('IMinimalStaffRepository'))),
  GetAllWishesController: () =>
    makeGetAllWishesController(makeGetAllWishesUseCase(getInjection('IWishesAndBlockedRepository'))),
  GetWishesByKeyController: () =>
    makeGetWishesByKeyController(makeGetWishesByKeyUseCase(getInjection('IWishesAndBlockedRepository'))),
  CreateWishesController: () =>
    makeCreateWishesController(makeCreateWishesUseCase(getInjection('IWishesAndBlockedRepository'))),
  UpdateWishesController: () =>
    makeUpdateWishesController(makeUpdateWishesUseCase(getInjection('IWishesAndBlockedRepository'))),
  DeleteWishesController: () =>
    makeDeleteWishesController(makeDeleteWishesUseCase(getInjection('IWishesAndBlockedRepository'))),
  GetAllGlobalWishesController: () =>
    makeGetAllGlobalWishesController(makeGetAllGlobalWishesUseCase(getInjection('IGlobalWishesAndBlockedRepository'))),
  GetGlobalWishesByKeyController: () =>
    makeGetGlobalWishesByKeyController(makeGetGlobalWishesByKeyUseCase(getInjection('IGlobalWishesAndBlockedRepository'))),
  CreateGlobalWishesController: () =>
    makeCreateGlobalWishesController(makeCreateGlobalWishesUseCase(getInjection('IGlobalWishesAndBlockedRepository'))),
  UpdateGlobalWishesController: () =>
    makeUpdateGlobalWishesController(makeUpdateGlobalWishesUseCase(getInjection('IGlobalWishesAndBlockedRepository'))),
  DeleteGlobalWishesController: () =>
    makeDeleteGlobalWishesController(makeDeleteGlobalWishesUseCase(getInjection('IGlobalWishesAndBlockedRepository'))),
  GetSchedulesMetadataController: () =>
    makeGetSchedulesMetadataController(makeGetSchedulesMetadataUseCase(getInjection('IScheduleRepository'))),
  GetScheduleController: () =>
    makeGetScheduleController(makeGetScheduleUseCase(getInjection('IScheduleRepository'))),
  SaveScheduleController: () =>
    makeSaveScheduleController(makeSaveScheduleUseCase(getInjection('IScheduleRepository'))),
  DeleteScheduleController: () =>
    makeDeleteScheduleController(makeDeleteScheduleUseCase(getInjection('IScheduleRepository'))),
  SelectScheduleController: () =>
    makeSelectScheduleController(makeSelectScheduleUseCase(getInjection('IScheduleRepository'))),
  UpdateScheduleMetadataController: () =>
    makeUpdateScheduleMetadataController(makeUpdateScheduleMetadataUseCase(getInjection('IScheduleRepository'))),
  GetAllJobsController: () =>
    makeGetAllJobsController(makeGetAllJobsUseCase(getInjection('IJobRepository'))),
  GetJobController: () =>
    makeGetJobController(makeGetJobUseCase(getInjection('IJobRepository'))),
  CreateJobController: () =>
    makeCreateJobController(makeCreateJobUseCase(getInjection('IJobRepository'))),
  ListCasesController: () =>
    makeListCasesController(makeListCasesUseCase(getInjection('ICaseRepository'))),
  CreateCaseController: () =>
    makeCreateCaseController(makeCreateCaseUseCase(getInjection('ICaseRepository'))),
};

export function getInjection<K extends keyof Registry>(key: K): Registry[K] {
  return getOrCreate(key, factories[key]);
}
