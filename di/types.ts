// Repository interfaces
import type {IEmployeeRepository} from '@/src/application/ports/employee.repository';
import type {IWeightsRepository} from '@/src/application/ports/weights.repository';
import type {IMinimalStaffRepository} from '@/src/application/ports/minimal-staff.repository';
import type {IWishesAndBlockedRepository} from '@/src/application/ports/wishes-and-blocked.repository';
import type {IGlobalWishesAndBlockedRepository} from '@/src/application/ports/global-wishes-and-blocked.repository';
import type {IScheduleRepository} from '@/src/application/ports/schedule.repository';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {ICaseRepository} from '@/src/application/ports/case.repository';

// Use Case interfaces
import type {IGetAllEmployeesUseCase} from '@/src/application/use-cases/employees/get-all-employees.use-case';
import type {IGetEmployeeUseCase} from '@/src/application/use-cases/employees/get-employee.use-case';
import type {ICreateEmployeeUseCase} from '@/src/application/use-cases/employees/create-employee.use-case';
import type {IGetWeightsUseCase} from '@/src/application/use-cases/weights/get-weights.use-case';
import type {IUpdateWeightsUseCase} from '@/src/application/use-cases/weights/update-weights.use-case';
import type {IGetMinimalStaffUseCase} from '@/src/application/use-cases/minimal-staff/get-minimal-staff.use-case';
import type {IUpdateMinimalStaffUseCase} from '@/src/application/use-cases/minimal-staff/update-minimal-staff.use-case';
import type {IGetAllWishesUseCase} from '@/src/application/use-cases/wishes-and-blocked/get-all-wishes.use-case';
import type {IGetWishesByKeyUseCase} from '@/src/application/use-cases/wishes-and-blocked/get-wishes-by-key.use-case';
import type {ICreateWishesUseCase} from '@/src/application/use-cases/wishes-and-blocked/create-wishes.use-case';
import type {IUpdateWishesUseCase} from '@/src/application/use-cases/wishes-and-blocked/update-wishes.use-case';
import type {IDeleteWishesUseCase} from '@/src/application/use-cases/wishes-and-blocked/delete-wishes.use-case';
import type {
    IGetAllGlobalWishesUseCase
} from '@/src/application/use-cases/global-wishes/get-all-global-wishes.use-case';
import type {
    IGetGlobalWishesByKeyUseCase
} from '@/src/application/use-cases/global-wishes/get-global-wishes-by-key.use-case';
import type {ICreateGlobalWishesUseCase} from '@/src/application/use-cases/global-wishes/create-global-wishes.use-case';
import type {IUpdateGlobalWishesUseCase} from '@/src/application/use-cases/global-wishes/update-global-wishes.use-case';
import type {IDeleteGlobalWishesUseCase} from '@/src/application/use-cases/global-wishes/delete-global-wishes.use-case';
import type {IGetSchedulesMetadataUseCase} from '@/src/application/use-cases/schedule/get-schedules-metadata.use-case';
import type {IGetScheduleUseCase} from '@/src/application/use-cases/schedule/get-schedule.use-case';
import type {ISaveScheduleUseCase} from '@/src/application/use-cases/schedule/save-schedule.use-case';
import type {IDeleteScheduleUseCase} from '@/src/application/use-cases/schedule/delete-schedule.use-case';
import type {ISelectScheduleUseCase} from '@/src/application/use-cases/schedule/select-schedule.use-case';
import type {
    IUpdateScheduleMetadataUseCase
} from '@/src/application/use-cases/schedule/update-schedule-metadata.use-case';
import type {IGetAllJobsUseCase} from '@/src/application/use-cases/jobs/get-all-jobs.use-case';
import type {IGetJobUseCase} from '@/src/application/use-cases/jobs/get-job.use-case';
import type {ICreateJobUseCase} from '@/src/application/use-cases/jobs/create-job.use-case';
import type {IListCasesUseCase} from '@/src/application/use-cases/cases/list-cases.use-case';

// Controller interfaces
import type {IGetAllEmployeesController} from '@/src/controllers/employees/get-all-employees.controller';
import type {IGetEmployeeController} from '@/src/controllers/employees/get-employee.controller';
import type {ICreateEmployeeController} from '@/src/controllers/employees/create-employee.controller';
import type {IGetWeightsController} from '@/src/controllers/weights/get-weights.controller';
import type {IUpdateWeightsController} from '@/src/controllers/weights/update-weights.controller';
import type {IGetMinimalStaffController} from '@/src/controllers/minimal-staff/get-minimal-staff.controller';
import type {IUpdateMinimalStaffController} from '@/src/controllers/minimal-staff/update-minimal-staff.controller';
import type {IGetAllWishesController} from '@/src/controllers/wishes-and-blocked/get-all-wishes.controller';
import type {IGetWishesByKeyController} from '@/src/controllers/wishes-and-blocked/get-wishes-by-key.controller';
import type {ICreateWishesController} from '@/src/controllers/wishes-and-blocked/create-wishes.controller';
import type {IUpdateWishesController} from '@/src/controllers/wishes-and-blocked/update-wishes.controller';
import type {IDeleteWishesController} from '@/src/controllers/wishes-and-blocked/delete-wishes.controller';
import type {IGetAllGlobalWishesController} from '@/src/controllers/global-wishes/get-all-global-wishes.controller';
import type {
    IGetGlobalWishesByKeyController
} from '@/src/controllers/global-wishes/get-global-wishes-by-key.controller';
import type {ICreateGlobalWishesController} from '@/src/controllers/global-wishes/create-global-wishes.controller';
import type {IUpdateGlobalWishesController} from '@/src/controllers/global-wishes/update-global-wishes.controller';
import type {IDeleteGlobalWishesController} from '@/src/controllers/global-wishes/delete-global-wishes.controller';
import type {IGetSchedulesMetadataController} from '@/src/controllers/schedule/get-schedules-metadata.controller';
import type {IGetScheduleController} from '@/src/controllers/schedule/get-schedule.controller';
import type {ISaveScheduleController} from '@/src/controllers/schedule/save-schedule.controller';
import type {IDeleteScheduleController} from '@/src/controllers/schedule/delete-schedule.controller';
import type {ISelectScheduleController} from '@/src/controllers/schedule/select-schedule.controller';
import type {IUpdateScheduleMetadataController} from '@/src/controllers/schedule/update-schedule-metadata.controller';
import type {IGetAllJobsController} from '@/src/controllers/jobs/get-all-jobs.controller';
import type {IGetJobController} from '@/src/controllers/jobs/get-job.controller';
import type {ICreateJobController} from '@/src/controllers/jobs/create-job.controller';
import type {IListCasesController} from '@/src/controllers/cases/list-cases.controller';

export const DI_SYMBOLS = {
    // Repositories
    IEmployeeRepository: Symbol.for('IEmployeeRepository'),
    IWeightsRepository: Symbol.for('IWeightsRepository'),
    IMinimalStaffRepository: Symbol.for('IMinimalStaffRepository'),
    IWishesAndBlockedRepository: Symbol.for('IWishesAndBlockedRepository'),
    IGlobalWishesAndBlockedRepository: Symbol.for('IGlobalWishesAndBlockedRepository'),
    IScheduleRepository: Symbol.for('IScheduleRepository'),
    IJobRepository: Symbol.for('IJobRepository'),
    ICaseRepository: Symbol.for('ICaseRepository'),

    // Use Cases — Employees
    IGetAllEmployeesUseCase: Symbol.for('IGetAllEmployeesUseCase'),
    IGetEmployeeUseCase: Symbol.for('IGetEmployeeUseCase'),
    ICreateEmployeeUseCase: Symbol.for('ICreateEmployeeUseCase'),

    // Use Cases — Weights
    IGetWeightsUseCase: Symbol.for('IGetWeightsUseCase'),
    IUpdateWeightsUseCase: Symbol.for('IUpdateWeightsUseCase'),

    // Use Cases — Minimal Staff
    IGetMinimalStaffUseCase: Symbol.for('IGetMinimalStaffUseCase'),
    IUpdateMinimalStaffUseCase: Symbol.for('IUpdateMinimalStaffUseCase'),

    // Use Cases — Wishes and Blocked
    IGetAllWishesUseCase: Symbol.for('IGetAllWishesUseCase'),
    IGetWishesByKeyUseCase: Symbol.for('IGetWishesByKeyUseCase'),
    ICreateWishesUseCase: Symbol.for('ICreateWishesUseCase'),
    IUpdateWishesUseCase: Symbol.for('IUpdateWishesUseCase'),
    IDeleteWishesUseCase: Symbol.for('IDeleteWishesUseCase'),

    // Use Cases — Global Wishes
    IGetAllGlobalWishesUseCase: Symbol.for('IGetAllGlobalWishesUseCase'),
    IGetGlobalWishesByKeyUseCase: Symbol.for('IGetGlobalWishesByKeyUseCase'),
    ICreateGlobalWishesUseCase: Symbol.for('ICreateGlobalWishesUseCase'),
    IUpdateGlobalWishesUseCase: Symbol.for('IUpdateGlobalWishesUseCase'),
    IDeleteGlobalWishesUseCase: Symbol.for('IDeleteGlobalWishesUseCase'),

    // Use Cases — Schedule
    IGetSchedulesMetadataUseCase: Symbol.for('IGetSchedulesMetadataUseCase'),
    IGetScheduleUseCase: Symbol.for('IGetScheduleUseCase'),
    ISaveScheduleUseCase: Symbol.for('ISaveScheduleUseCase'),
    IDeleteScheduleUseCase: Symbol.for('IDeleteScheduleUseCase'),
    ISelectScheduleUseCase: Symbol.for('ISelectScheduleUseCase'),
    IUpdateScheduleMetadataUseCase: Symbol.for('IUpdateScheduleMetadataUseCase'),

    // Use Cases — Jobs
    IGetAllJobsUseCase: Symbol.for('IGetAllJobsUseCase'),
    IGetJobUseCase: Symbol.for('IGetJobUseCase'),
    ICreateJobUseCase: Symbol.for('ICreateJobUseCase'),

    // Use Cases — Cases
    IListCasesUseCase: Symbol.for('IListCasesUseCase'),

    // Controllers — Employees
    IGetAllEmployeesController: Symbol.for('IGetAllEmployeesController'),
    IGetEmployeeController: Symbol.for('IGetEmployeeController'),
    ICreateEmployeeController: Symbol.for('ICreateEmployeeController'),

    // Controllers — Weights
    IGetWeightsController: Symbol.for('IGetWeightsController'),
    IUpdateWeightsController: Symbol.for('IUpdateWeightsController'),

    // Controllers — Minimal Staff
    IGetMinimalStaffController: Symbol.for('IGetMinimalStaffController'),
    IUpdateMinimalStaffController: Symbol.for('IUpdateMinimalStaffController'),

    // Controllers — Wishes and Blocked
    IGetAllWishesController: Symbol.for('IGetAllWishesController'),
    IGetWishesByKeyController: Symbol.for('IGetWishesByKeyController'),
    ICreateWishesController: Symbol.for('ICreateWishesController'),
    IUpdateWishesController: Symbol.for('IUpdateWishesController'),
    IDeleteWishesController: Symbol.for('IDeleteWishesController'),

    // Controllers — Global Wishes
    IGetAllGlobalWishesController: Symbol.for('IGetAllGlobalWishesController'),
    IGetGlobalWishesByKeyController: Symbol.for('IGetGlobalWishesByKeyController'),
    ICreateGlobalWishesController: Symbol.for('ICreateGlobalWishesController'),
    IUpdateGlobalWishesController: Symbol.for('IUpdateGlobalWishesController'),
    IDeleteGlobalWishesController: Symbol.for('IDeleteGlobalWishesController'),

    // Controllers — Schedule
    IGetSchedulesMetadataController: Symbol.for('IGetSchedulesMetadataController'),
    IGetScheduleController: Symbol.for('IGetScheduleController'),
    ISaveScheduleController: Symbol.for('ISaveScheduleController'),
    IDeleteScheduleController: Symbol.for('IDeleteScheduleController'),
    ISelectScheduleController: Symbol.for('ISelectScheduleController'),
    IUpdateScheduleMetadataController: Symbol.for('IUpdateScheduleMetadataController'),

    // Controllers — Jobs
    IGetAllJobsController: Symbol.for('IGetAllJobsController'),
    IGetJobController: Symbol.for('IGetJobController'),
    ICreateJobController: Symbol.for('ICreateJobController'),

    // Controllers — Cases
    IListCasesController: Symbol.for('IListCasesController'),
} as const;

export interface DI_RETURN_TYPES {
    // Repositories
    IEmployeeRepository: IEmployeeRepository;
    IWeightsRepository: IWeightsRepository;
    IMinimalStaffRepository: IMinimalStaffRepository;
    IWishesAndBlockedRepository: IWishesAndBlockedRepository;
    IGlobalWishesAndBlockedRepository: IGlobalWishesAndBlockedRepository;
    IScheduleRepository: IScheduleRepository;
    IJobRepository: IJobRepository;
    ICaseRepository: ICaseRepository;

    // Use Cases — Employees
    IGetAllEmployeesUseCase: IGetAllEmployeesUseCase;
    IGetEmployeeUseCase: IGetEmployeeUseCase;
    ICreateEmployeeUseCase: ICreateEmployeeUseCase;

    // Use Cases — Weights
    IGetWeightsUseCase: IGetWeightsUseCase;
    IUpdateWeightsUseCase: IUpdateWeightsUseCase;

    // Use Cases — Minimal Staff
    IGetMinimalStaffUseCase: IGetMinimalStaffUseCase;
    IUpdateMinimalStaffUseCase: IUpdateMinimalStaffUseCase;

    // Use Cases — Wishes and Blocked
    IGetAllWishesUseCase: IGetAllWishesUseCase;
    IGetWishesByKeyUseCase: IGetWishesByKeyUseCase;
    ICreateWishesUseCase: ICreateWishesUseCase;
    IUpdateWishesUseCase: IUpdateWishesUseCase;
    IDeleteWishesUseCase: IDeleteWishesUseCase;

    // Use Cases — Global Wishes
    IGetAllGlobalWishesUseCase: IGetAllGlobalWishesUseCase;
    IGetGlobalWishesByKeyUseCase: IGetGlobalWishesByKeyUseCase;
    ICreateGlobalWishesUseCase: ICreateGlobalWishesUseCase;
    IUpdateGlobalWishesUseCase: IUpdateGlobalWishesUseCase;
    IDeleteGlobalWishesUseCase: IDeleteGlobalWishesUseCase;

    // Use Cases — Schedule
    IGetSchedulesMetadataUseCase: IGetSchedulesMetadataUseCase;
    IGetScheduleUseCase: IGetScheduleUseCase;
    ISaveScheduleUseCase: ISaveScheduleUseCase;
    IDeleteScheduleUseCase: IDeleteScheduleUseCase;
    ISelectScheduleUseCase: ISelectScheduleUseCase;
    IUpdateScheduleMetadataUseCase: IUpdateScheduleMetadataUseCase;

    // Use Cases — Jobs
    IGetAllJobsUseCase: IGetAllJobsUseCase;
    IGetJobUseCase: IGetJobUseCase;
    ICreateJobUseCase: ICreateJobUseCase;

    // Use Cases — Cases
    IListCasesUseCase: IListCasesUseCase;

    // Controllers — Employees
    IGetAllEmployeesController: IGetAllEmployeesController;
    IGetEmployeeController: IGetEmployeeController;
    ICreateEmployeeController: ICreateEmployeeController;

    // Controllers — Weights
    IGetWeightsController: IGetWeightsController;
    IUpdateWeightsController: IUpdateWeightsController;

    // Controllers — Minimal Staff
    IGetMinimalStaffController: IGetMinimalStaffController;
    IUpdateMinimalStaffController: IUpdateMinimalStaffController;

    // Controllers — Wishes and Blocked
    IGetAllWishesController: IGetAllWishesController;
    IGetWishesByKeyController: IGetWishesByKeyController;
    ICreateWishesController: ICreateWishesController;
    IUpdateWishesController: IUpdateWishesController;
    IDeleteWishesController: IDeleteWishesController;

    // Controllers — Global Wishes
    IGetAllGlobalWishesController: IGetAllGlobalWishesController;
    IGetGlobalWishesByKeyController: IGetGlobalWishesByKeyController;
    ICreateGlobalWishesController: ICreateGlobalWishesController;
    IUpdateGlobalWishesController: IUpdateGlobalWishesController;
    IDeleteGlobalWishesController: IDeleteGlobalWishesController;

    // Controllers — Schedule
    IGetSchedulesMetadataController: IGetSchedulesMetadataController;
    IGetScheduleController: IGetScheduleController;
    ISaveScheduleController: ISaveScheduleController;
    IDeleteScheduleController: IDeleteScheduleController;
    ISelectScheduleController: ISelectScheduleController;
    IUpdateScheduleMetadataController: IUpdateScheduleMetadataController;

    // Controllers — Jobs
    IGetAllJobsController: IGetAllJobsController;
    IGetJobController: IGetJobController;
    ICreateJobController: ICreateJobController;

    // Controllers — Cases
    IListCasesController: IListCasesController;
}
