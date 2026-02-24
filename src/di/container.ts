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

// Controllers
import { GetAllEmployeesController } from '@/src/controllers/employees/get-all-employees.controller';
import { GetEmployeeController } from '@/src/controllers/employees/get-employee.controller';
import { CreateEmployeeController } from '@/src/controllers/employees/create-employee.controller';

import { GetWeightsController } from '@/src/controllers/weights/get-weights.controller';
import { UpdateWeightsController } from '@/src/controllers/weights/update-weights.controller';

import { GetMinimalStaffController } from '@/src/controllers/minimal-staff/get-minimal-staff.controller';
import { UpdateMinimalStaffController } from '@/src/controllers/minimal-staff/update-minimal-staff.controller';

import { GetAllWishesController } from '@/src/controllers/wishes-and-blocked/get-all-wishes.controller';
import { GetWishesByKeyController } from '@/src/controllers/wishes-and-blocked/get-wishes-by-key.controller';
import { CreateWishesController } from '@/src/controllers/wishes-and-blocked/create-wishes.controller';
import { UpdateWishesController } from '@/src/controllers/wishes-and-blocked/update-wishes.controller';
import { DeleteWishesController } from '@/src/controllers/wishes-and-blocked/delete-wishes.controller';

import { GetAllGlobalWishesController } from '@/src/controllers/global-wishes/get-all-global-wishes.controller';
import { GetGlobalWishesByKeyController } from '@/src/controllers/global-wishes/get-global-wishes-by-key.controller';
import { CreateGlobalWishesController } from '@/src/controllers/global-wishes/create-global-wishes.controller';
import { UpdateGlobalWishesController } from '@/src/controllers/global-wishes/update-global-wishes.controller';
import { DeleteGlobalWishesController } from '@/src/controllers/global-wishes/delete-global-wishes.controller';

import { GetSchedulesMetadataController } from '@/src/controllers/schedule/get-schedules-metadata.controller';
import { GetScheduleController } from '@/src/controllers/schedule/get-schedule.controller';
import { SaveScheduleController } from '@/src/controllers/schedule/save-schedule.controller';
import { DeleteScheduleController } from '@/src/controllers/schedule/delete-schedule.controller';
import { SelectScheduleController } from '@/src/controllers/schedule/select-schedule.controller';
import { UpdateScheduleMetadataController } from '@/src/controllers/schedule/update-schedule-metadata.controller';

import { GetAllJobsController } from '@/src/controllers/jobs/get-all-jobs.controller';
import { GetJobController } from '@/src/controllers/jobs/get-job.controller';
import { CreateJobController } from '@/src/controllers/jobs/create-job.controller';

import { ListCasesController } from '@/src/controllers/cases/list-cases.controller';
import { CreateCaseController } from '@/src/controllers/cases/create-case.controller';

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
  GetAllEmployeesController: GetAllEmployeesController;
  GetEmployeeController: GetEmployeeController;
  CreateEmployeeController: CreateEmployeeController;
  GetWeightsController: GetWeightsController;
  UpdateWeightsController: UpdateWeightsController;
  GetMinimalStaffController: GetMinimalStaffController;
  UpdateMinimalStaffController: UpdateMinimalStaffController;
  GetAllWishesController: GetAllWishesController;
  GetWishesByKeyController: GetWishesByKeyController;
  CreateWishesController: CreateWishesController;
  UpdateWishesController: UpdateWishesController;
  DeleteWishesController: DeleteWishesController;
  GetAllGlobalWishesController: GetAllGlobalWishesController;
  GetGlobalWishesByKeyController: GetGlobalWishesByKeyController;
  CreateGlobalWishesController: CreateGlobalWishesController;
  UpdateGlobalWishesController: UpdateGlobalWishesController;
  DeleteGlobalWishesController: DeleteGlobalWishesController;
  GetSchedulesMetadataController: GetSchedulesMetadataController;
  GetScheduleController: GetScheduleController;
  SaveScheduleController: SaveScheduleController;
  DeleteScheduleController: DeleteScheduleController;
  SelectScheduleController: SelectScheduleController;
  UpdateScheduleMetadataController: UpdateScheduleMetadataController;
  GetAllJobsController: GetAllJobsController;
  GetJobController: GetJobController;
  CreateJobController: CreateJobController;
  ListCasesController: ListCasesController;
  CreateCaseController: CreateCaseController;
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

  // Controllers (depend on repositories)
  GetAllEmployeesController: () =>
    new GetAllEmployeesController(getInjection('IEmployeeRepository')),
  GetEmployeeController: () =>
    new GetEmployeeController(getInjection('IEmployeeRepository')),
  CreateEmployeeController: () =>
    new CreateEmployeeController(getInjection('IEmployeeRepository')),
  GetWeightsController: () =>
    new GetWeightsController(getInjection('IWeightsRepository')),
  UpdateWeightsController: () =>
    new UpdateWeightsController(getInjection('IWeightsRepository')),
  GetMinimalStaffController: () =>
    new GetMinimalStaffController(getInjection('IMinimalStaffRepository')),
  UpdateMinimalStaffController: () =>
    new UpdateMinimalStaffController(getInjection('IMinimalStaffRepository')),
  GetAllWishesController: () =>
    new GetAllWishesController(getInjection('IWishesAndBlockedRepository')),
  GetWishesByKeyController: () =>
    new GetWishesByKeyController(getInjection('IWishesAndBlockedRepository')),
  CreateWishesController: () =>
    new CreateWishesController(getInjection('IWishesAndBlockedRepository')),
  UpdateWishesController: () =>
    new UpdateWishesController(getInjection('IWishesAndBlockedRepository')),
  DeleteWishesController: () =>
    new DeleteWishesController(getInjection('IWishesAndBlockedRepository')),
  GetAllGlobalWishesController: () =>
    new GetAllGlobalWishesController(getInjection('IGlobalWishesAndBlockedRepository')),
  GetGlobalWishesByKeyController: () =>
    new GetGlobalWishesByKeyController(getInjection('IGlobalWishesAndBlockedRepository')),
  CreateGlobalWishesController: () =>
    new CreateGlobalWishesController(getInjection('IGlobalWishesAndBlockedRepository')),
  UpdateGlobalWishesController: () =>
    new UpdateGlobalWishesController(getInjection('IGlobalWishesAndBlockedRepository')),
  DeleteGlobalWishesController: () =>
    new DeleteGlobalWishesController(getInjection('IGlobalWishesAndBlockedRepository')),
  GetSchedulesMetadataController: () =>
    new GetSchedulesMetadataController(getInjection('IScheduleRepository')),
  GetScheduleController: () =>
    new GetScheduleController(getInjection('IScheduleRepository')),
  SaveScheduleController: () =>
    new SaveScheduleController(getInjection('IScheduleRepository')),
  DeleteScheduleController: () =>
    new DeleteScheduleController(getInjection('IScheduleRepository')),
  SelectScheduleController: () =>
    new SelectScheduleController(getInjection('IScheduleRepository')),
  UpdateScheduleMetadataController: () =>
    new UpdateScheduleMetadataController(getInjection('IScheduleRepository')),
  GetAllJobsController: () =>
    new GetAllJobsController(getInjection('IJobRepository')),
  GetJobController: () =>
    new GetJobController(getInjection('IJobRepository')),
  CreateJobController: () =>
    new CreateJobController(getInjection('IJobRepository')),
  ListCasesController: () =>
    new ListCasesController(getInjection('ICaseRepository')),
  CreateCaseController: () =>
    new CreateCaseController(getInjection('ICaseRepository')),
};

export function getInjection<K extends keyof Registry>(key: K): Registry[K] {
  return getOrCreate(key, factories[key]);
}
