// Repository interfaces
import type {IEmployeeRepository} from '@/src/application/ports/employee.repository';
import type {IWeightsRepository} from '@/src/application/ports/weights.repository';
import type {IMinimalStaffRepository} from '@/src/application/ports/minimal-staff.repository';
import type {IWishesAndBlockedRepository} from '@/src/application/ports/wishes-and-blocked.repository';
import type {IGlobalWishesAndBlockedRepository} from '@/src/application/ports/global-wishes-and-blocked.repository';
import type {IGlobalWishesTemplateRepository} from '@/src/application/ports/global-wishes-template.repository';
import type {IScheduleRepository} from '@/src/application/ports/schedule.repository';
import type {IJobRepository} from '@/src/application/ports/job.repository';
import type {ICaseRepository} from '@/src/application/ports/case.repository';
import type {IWeightsTemplateRepository} from '@/src/application/ports/weights-template.repository';
import type {IMinimalStaffTemplateRepository} from '@/src/application/ports/minimal-staff-template.repository';

// Service interfaces
import type {ISolverService} from '@/src/application/ports/solver.service';
import type {IScheduleParserService} from '@/src/application/ports/schedule-parser.service';

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
import type {
    IImportGlobalWishesTemplateUseCase
} from '@/src/application/use-cases/global-wishes/import-global-wishes-template.use-case';
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
import type {IGetSelectedScheduleUseCase} from '@/src/application/use-cases/schedule/get-selected-schedule.use-case';
// Use Case interfaces — Weights Templates
import type {
    IListWeightsTemplatesUseCase
} from '@/src/application/use-cases/templates/weights/list-weights-templates.use-case';
import type {
    IGetWeightsTemplateUseCase
} from '@/src/application/use-cases/templates/weights/get-weights-template.use-case';
import type {
    ICreateWeightsTemplateUseCase
} from '@/src/application/use-cases/templates/weights/create-weights-template.use-case';
import type {
    IUpdateWeightsTemplateUseCase
} from '@/src/application/use-cases/templates/weights/update-weights-template.use-case';
import type {
    IDeleteWeightsTemplateUseCase
} from '@/src/application/use-cases/templates/weights/delete-weights-template.use-case';
// Use Case interfaces — Minimal Staff Templates
import type {
    IListMinimalStaffTemplatesUseCase
} from '@/src/application/use-cases/templates/minimal-staff/list-minimal-staff-templates.use-case';
import type {
    IGetMinimalStaffTemplateUseCase
} from '@/src/application/use-cases/templates/minimal-staff/get-minimal-staff-template.use-case';
import type {
    ICreateMinimalStaffTemplateUseCase
} from '@/src/application/use-cases/templates/minimal-staff/create-minimal-staff-template.use-case';
import type {
    IUpdateMinimalStaffTemplateUseCase
} from '@/src/application/use-cases/templates/minimal-staff/update-minimal-staff-template.use-case';
import type {
    IDeleteMinimalStaffTemplateUseCase
} from '@/src/application/use-cases/templates/minimal-staff/delete-minimal-staff-template.use-case';
// Use Case interfaces — Global Wishes Templates
import type {
    IListGlobalWishesTemplatesUseCase
} from '@/src/application/use-cases/templates/global-wishes/list-global-wishes-templates.use-case';
import type {
    IGetGlobalWishesTemplateUseCase
} from '@/src/application/use-cases/templates/global-wishes/get-global-wishes-template.use-case';
import type {
    ICreateGlobalWishesTemplateUseCase
} from '@/src/application/use-cases/templates/global-wishes/create-global-wishes-template.use-case';
import type {
    IUpdateGlobalWishesTemplateUseCase
} from '@/src/application/use-cases/templates/global-wishes/update-global-wishes-template.use-case';
import type {
    IDeleteGlobalWishesTemplateUseCase
} from '@/src/application/use-cases/templates/global-wishes/delete-global-wishes-template.use-case';

// Use Case interfaces — Solver
import type {ICheckSolverHealthUseCase} from '@/src/application/use-cases/solver/check-solver-health.use-case';
import type {IExecuteSolverFetchUseCase} from '@/src/application/use-cases/solver/execute-solver-fetch.use-case';
import type {IExecuteSolverSolveUseCase} from '@/src/application/use-cases/solver/execute-solver-solve.use-case';
import type {
    IExecuteSolverSolveMultipleUseCase
} from '@/src/application/use-cases/solver/execute-solver-solve-multiple.use-case';
import type {IExecuteSolverInsertUseCase} from '@/src/application/use-cases/solver/execute-solver-insert.use-case';
import type {IExecuteSolverDeleteUseCase} from '@/src/application/use-cases/solver/execute-solver-delete.use-case';
import type {IImportSolutionUseCase} from '@/src/application/use-cases/solver/import-solution.use-case';

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
import type {
    IImportGlobalWishesTemplateController
} from '@/src/controllers/global-wishes/import-global-wishes-template.controller';
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
import type {IGetSelectedScheduleController} from '@/src/controllers/schedule/get-selected-schedule.controller';
// Controller interfaces — Weights Templates
import type {
    IListWeightsTemplatesController
} from '@/src/controllers/templates/weights/list-weights-templates.controller';
import type {IGetWeightsTemplateController} from '@/src/controllers/templates/weights/get-weights-template.controller';
import type {
    ICreateWeightsTemplateController
} from '@/src/controllers/templates/weights/create-weights-template.controller';
import type {
    IUpdateWeightsTemplateController
} from '@/src/controllers/templates/weights/update-weights-template.controller';
import type {
    IDeleteWeightsTemplateController
} from '@/src/controllers/templates/weights/delete-weights-template.controller';
// Controller interfaces — Minimal Staff Templates
import type {
    IListMinimalStaffTemplatesController
} from '@/src/controllers/templates/minimal-staff/list-minimal-staff-templates.controller';
import type {
    IGetMinimalStaffTemplateController
} from '@/src/controllers/templates/minimal-staff/get-minimal-staff-template.controller';
import type {
    ICreateMinimalStaffTemplateController
} from '@/src/controllers/templates/minimal-staff/create-minimal-staff-template.controller';
import type {
    IUpdateMinimalStaffTemplateController
} from '@/src/controllers/templates/minimal-staff/update-minimal-staff-template.controller';
import type {
    IDeleteMinimalStaffTemplateController
} from '@/src/controllers/templates/minimal-staff/delete-minimal-staff-template.controller';
// Controller interfaces — Global Wishes Templates
import type {
    IListGlobalWishesTemplatesController
} from '@/src/controllers/templates/global-wishes/list-global-wishes-templates.controller';
import type {
    IGetGlobalWishesTemplateController
} from '@/src/controllers/templates/global-wishes/get-global-wishes-template.controller';
import type {
    ICreateGlobalWishesTemplateController
} from '@/src/controllers/templates/global-wishes/create-global-wishes-template.controller';
import type {
    IUpdateGlobalWishesTemplateController
} from '@/src/controllers/templates/global-wishes/update-global-wishes-template.controller';
import type {
    IDeleteGlobalWishesTemplateController
} from '@/src/controllers/templates/global-wishes/delete-global-wishes-template.controller';

// Controller interfaces — Solver
import type {ICheckSolverHealthController} from '@/src/controllers/solver/check-solver-health.controller';
import type {IExecuteSolverFetchController} from '@/src/controllers/solver/execute-solver-fetch.controller';
import type {IExecuteSolverSolveController} from '@/src/controllers/solver/execute-solver-solve.controller';
import type {
    IExecuteSolverSolveMultipleController
} from '@/src/controllers/solver/execute-solver-solve-multiple.controller';
import type {IExecuteSolverInsertController} from '@/src/controllers/solver/execute-solver-insert.controller';
import type {IExecuteSolverDeleteController} from '@/src/controllers/solver/execute-solver-delete.controller';
import type {IImportSolutionController} from '@/src/controllers/solver/import-solution.controller';

export const DI_SYMBOLS = {
    // Repositories
    IEmployeeRepository: Symbol.for('IEmployeeRepository'),
    IWeightsRepository: Symbol.for('IWeightsRepository'),
    IMinimalStaffRepository: Symbol.for('IMinimalStaffRepository'),
    IWishesAndBlockedRepository: Symbol.for('IWishesAndBlockedRepository'),
    IGlobalWishesAndBlockedRepository: Symbol.for('IGlobalWishesAndBlockedRepository'),
    IGlobalWishesTemplateRepository: Symbol.for('IGlobalWishesTemplateRepository'),
    IWeightsTemplateRepository: Symbol.for('IWeightsTemplateRepository'),
    IMinimalStaffTemplateRepository: Symbol.for('IMinimalStaffTemplateRepository'),
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
    IImportGlobalWishesTemplateUseCase: Symbol.for('IImportGlobalWishesTemplateUseCase'),

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

    // Use Cases — Schedule (extended)
    IGetSelectedScheduleUseCase: Symbol.for('IGetSelectedScheduleUseCase'),

    // Use Cases — Weights Templates
    IListWeightsTemplatesUseCase: Symbol.for('IListWeightsTemplatesUseCase'),
    IGetWeightsTemplateUseCase: Symbol.for('IGetWeightsTemplateUseCase'),
    ICreateWeightsTemplateUseCase: Symbol.for('ICreateWeightsTemplateUseCase'),
    IUpdateWeightsTemplateUseCase: Symbol.for('IUpdateWeightsTemplateUseCase'),
    IDeleteWeightsTemplateUseCase: Symbol.for('IDeleteWeightsTemplateUseCase'),

    // Use Cases — Minimal Staff Templates
    IListMinimalStaffTemplatesUseCase: Symbol.for('IListMinimalStaffTemplatesUseCase'),
    IGetMinimalStaffTemplateUseCase: Symbol.for('IGetMinimalStaffTemplateUseCase'),
    ICreateMinimalStaffTemplateUseCase: Symbol.for('ICreateMinimalStaffTemplateUseCase'),
    IUpdateMinimalStaffTemplateUseCase: Symbol.for('IUpdateMinimalStaffTemplateUseCase'),
    IDeleteMinimalStaffTemplateUseCase: Symbol.for('IDeleteMinimalStaffTemplateUseCase'),

    // Use Cases — Global Wishes Templates
    IListGlobalWishesTemplatesUseCase: Symbol.for('IListGlobalWishesTemplatesUseCase'),
    IGetGlobalWishesTemplateUseCase: Symbol.for('IGetGlobalWishesTemplateUseCase'),
    ICreateGlobalWishesTemplateUseCase: Symbol.for('ICreateGlobalWishesTemplateUseCase'),
    IUpdateGlobalWishesTemplateUseCase: Symbol.for('IUpdateGlobalWishesTemplateUseCase'),
    IDeleteGlobalWishesTemplateUseCase: Symbol.for('IDeleteGlobalWishesTemplateUseCase'),

    // Services — Solver
    ISolverService: Symbol.for('ISolverService'),
    IScheduleParserService: Symbol.for('IScheduleParserService'),

    // Use Cases — Solver
    ICheckSolverHealthUseCase: Symbol.for('ICheckSolverHealthUseCase'),
    IExecuteSolverFetchUseCase: Symbol.for('IExecuteSolverFetchUseCase'),
    IExecuteSolverSolveUseCase: Symbol.for('IExecuteSolverSolveUseCase'),
    IExecuteSolverSolveMultipleUseCase: Symbol.for('IExecuteSolverSolveMultipleUseCase'),
    IExecuteSolverInsertUseCase: Symbol.for('IExecuteSolverInsertUseCase'),
    IExecuteSolverDeleteUseCase: Symbol.for('IExecuteSolverDeleteUseCase'),
    IImportSolutionUseCase: Symbol.for('IImportSolutionUseCase'),

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
    IImportGlobalWishesTemplateController: Symbol.for('IImportGlobalWishesTemplateController'),

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

    // Controllers — Schedule (extended)
    IGetSelectedScheduleController: Symbol.for('IGetSelectedScheduleController'),

    // Controllers — Weights Templates
    IListWeightsTemplatesController: Symbol.for('IListWeightsTemplatesController'),
    IGetWeightsTemplateController: Symbol.for('IGetWeightsTemplateController'),
    ICreateWeightsTemplateController: Symbol.for('ICreateWeightsTemplateController'),
    IUpdateWeightsTemplateController: Symbol.for('IUpdateWeightsTemplateController'),
    IDeleteWeightsTemplateController: Symbol.for('IDeleteWeightsTemplateController'),

    // Controllers — Minimal Staff Templates
    IListMinimalStaffTemplatesController: Symbol.for('IListMinimalStaffTemplatesController'),
    IGetMinimalStaffTemplateController: Symbol.for('IGetMinimalStaffTemplateController'),
    ICreateMinimalStaffTemplateController: Symbol.for('ICreateMinimalStaffTemplateController'),
    IUpdateMinimalStaffTemplateController: Symbol.for('IUpdateMinimalStaffTemplateController'),
    IDeleteMinimalStaffTemplateController: Symbol.for('IDeleteMinimalStaffTemplateController'),

    // Controllers — Global Wishes Templates
    IListGlobalWishesTemplatesController: Symbol.for('IListGlobalWishesTemplatesController'),
    IGetGlobalWishesTemplateController: Symbol.for('IGetGlobalWishesTemplateController'),
    ICreateGlobalWishesTemplateController: Symbol.for('ICreateGlobalWishesTemplateController'),
    IUpdateGlobalWishesTemplateController: Symbol.for('IUpdateGlobalWishesTemplateController'),
    IDeleteGlobalWishesTemplateController: Symbol.for('IDeleteGlobalWishesTemplateController'),

    // Controllers — Solver
    ICheckSolverHealthController: Symbol.for('ICheckSolverHealthController'),
    IExecuteSolverFetchController: Symbol.for('IExecuteSolverFetchController'),
    IExecuteSolverSolveController: Symbol.for('IExecuteSolverSolveController'),
    IExecuteSolverSolveMultipleController: Symbol.for('IExecuteSolverSolveMultipleController'),
    IExecuteSolverInsertController: Symbol.for('IExecuteSolverInsertController'),
    IExecuteSolverDeleteController: Symbol.for('IExecuteSolverDeleteController'),
    IImportSolutionController: Symbol.for('IImportSolutionController'),
} as const;

export interface DI_RETURN_TYPES {
    // Repositories
    IEmployeeRepository: IEmployeeRepository;
    IWeightsRepository: IWeightsRepository;
    IMinimalStaffRepository: IMinimalStaffRepository;
    IWishesAndBlockedRepository: IWishesAndBlockedRepository;
    IGlobalWishesAndBlockedRepository: IGlobalWishesAndBlockedRepository;
    IGlobalWishesTemplateRepository: IGlobalWishesTemplateRepository;
    IWeightsTemplateRepository: IWeightsTemplateRepository;
    IMinimalStaffTemplateRepository: IMinimalStaffTemplateRepository;
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
    IImportGlobalWishesTemplateUseCase: IImportGlobalWishesTemplateUseCase;

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

    // Use Cases — Schedule (extended)
    IGetSelectedScheduleUseCase: IGetSelectedScheduleUseCase;

    // Use Cases — Weights Templates
    IListWeightsTemplatesUseCase: IListWeightsTemplatesUseCase;
    IGetWeightsTemplateUseCase: IGetWeightsTemplateUseCase;
    ICreateWeightsTemplateUseCase: ICreateWeightsTemplateUseCase;
    IUpdateWeightsTemplateUseCase: IUpdateWeightsTemplateUseCase;
    IDeleteWeightsTemplateUseCase: IDeleteWeightsTemplateUseCase;

    // Use Cases — Minimal Staff Templates
    IListMinimalStaffTemplatesUseCase: IListMinimalStaffTemplatesUseCase;
    IGetMinimalStaffTemplateUseCase: IGetMinimalStaffTemplateUseCase;
    ICreateMinimalStaffTemplateUseCase: ICreateMinimalStaffTemplateUseCase;
    IUpdateMinimalStaffTemplateUseCase: IUpdateMinimalStaffTemplateUseCase;
    IDeleteMinimalStaffTemplateUseCase: IDeleteMinimalStaffTemplateUseCase;

    // Use Cases — Global Wishes Templates
    IListGlobalWishesTemplatesUseCase: IListGlobalWishesTemplatesUseCase;
    IGetGlobalWishesTemplateUseCase: IGetGlobalWishesTemplateUseCase;
    ICreateGlobalWishesTemplateUseCase: ICreateGlobalWishesTemplateUseCase;
    IUpdateGlobalWishesTemplateUseCase: IUpdateGlobalWishesTemplateUseCase;
    IDeleteGlobalWishesTemplateUseCase: IDeleteGlobalWishesTemplateUseCase;

    // Services — Solver
    ISolverService: ISolverService;
    IScheduleParserService: IScheduleParserService;

    // Use Cases — Solver
    ICheckSolverHealthUseCase: ICheckSolverHealthUseCase;
    IExecuteSolverFetchUseCase: IExecuteSolverFetchUseCase;
    IExecuteSolverSolveUseCase: IExecuteSolverSolveUseCase;
    IExecuteSolverSolveMultipleUseCase: IExecuteSolverSolveMultipleUseCase;
    IExecuteSolverInsertUseCase: IExecuteSolverInsertUseCase;
    IExecuteSolverDeleteUseCase: IExecuteSolverDeleteUseCase;
    IImportSolutionUseCase: IImportSolutionUseCase;

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
    IImportGlobalWishesTemplateController: IImportGlobalWishesTemplateController;

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

    // Controllers — Schedule (extended)
    IGetSelectedScheduleController: IGetSelectedScheduleController;

    // Controllers — Weights Templates
    IListWeightsTemplatesController: IListWeightsTemplatesController;
    IGetWeightsTemplateController: IGetWeightsTemplateController;
    ICreateWeightsTemplateController: ICreateWeightsTemplateController;
    IUpdateWeightsTemplateController: IUpdateWeightsTemplateController;
    IDeleteWeightsTemplateController: IDeleteWeightsTemplateController;

    // Controllers — Minimal Staff Templates
    IListMinimalStaffTemplatesController: IListMinimalStaffTemplatesController;
    IGetMinimalStaffTemplateController: IGetMinimalStaffTemplateController;
    ICreateMinimalStaffTemplateController: ICreateMinimalStaffTemplateController;
    IUpdateMinimalStaffTemplateController: IUpdateMinimalStaffTemplateController;
    IDeleteMinimalStaffTemplateController: IDeleteMinimalStaffTemplateController;

    // Controllers — Global Wishes Templates
    IListGlobalWishesTemplatesController: IListGlobalWishesTemplatesController;
    IGetGlobalWishesTemplateController: IGetGlobalWishesTemplateController;
    ICreateGlobalWishesTemplateController: ICreateGlobalWishesTemplateController;
    IUpdateGlobalWishesTemplateController: IUpdateGlobalWishesTemplateController;
    IDeleteGlobalWishesTemplateController: IDeleteGlobalWishesTemplateController;

    // Controllers — Solver
    ICheckSolverHealthController: ICheckSolverHealthController;
    IExecuteSolverFetchController: IExecuteSolverFetchController;
    IExecuteSolverSolveController: IExecuteSolverSolveController;
    IExecuteSolverSolveMultipleController: IExecuteSolverSolveMultipleController;
    IExecuteSolverInsertController: IExecuteSolverInsertController;
    IExecuteSolverDeleteController: IExecuteSolverDeleteController;
    IImportSolutionController: IImportSolutionController;
}
