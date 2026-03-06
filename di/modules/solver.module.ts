import {createModule} from '@evyweb/ioctopus';
import {DI_SYMBOLS} from '@/di/types';
import {PythonCliService} from '@/lib/services/python-cli-service';
import {ScheduleParserService} from '@/lib/services/schedule-parser';
import {makeValidateConfigUseCase} from '@/src/application/use-cases/solver/validate-config.use-case';
import {makeExecuteSolverFetchUseCase} from '@/src/application/use-cases/solver/execute-solver-fetch.use-case';
import {makeExecuteSolverSolveUseCase} from '@/src/application/use-cases/solver/execute-solver-solve.use-case';
import {
    makeExecuteSolverSolveMultipleUseCase
} from '@/src/application/use-cases/solver/execute-solver-solve-multiple.use-case';
import {makeExecuteSolverInsertUseCase} from '@/src/application/use-cases/solver/execute-solver-insert.use-case';
import {makeExecuteSolverDeleteUseCase} from '@/src/application/use-cases/solver/execute-solver-delete.use-case';
import {makeFindSolutionFileUseCase} from '@/src/application/use-cases/solver/find-solution-file.use-case';
import {makeSaveSolutionUseCase} from '@/src/application/use-cases/solver/save-solution.use-case';
import {makeImportSolutionUseCase} from '@/src/application/use-cases/solver/import-solution.use-case';
import {makeValidateConfigController} from '@/src/controllers/solver/validate-config.controller';
import {makeExecuteSolverFetchController} from '@/src/controllers/solver/execute-solver-fetch.controller';
import {makeExecuteSolverSolveController} from '@/src/controllers/solver/execute-solver-solve.controller';
import {
    makeExecuteSolverSolveMultipleController
} from '@/src/controllers/solver/execute-solver-solve-multiple.controller';
import {makeExecuteSolverInsertController} from '@/src/controllers/solver/execute-solver-insert.controller';
import {makeExecuteSolverDeleteController} from '@/src/controllers/solver/execute-solver-delete.controller';
import {makeFindSolutionFileController} from '@/src/controllers/solver/find-solution-file.controller';
import {makeSaveSolutionController} from '@/src/controllers/solver/save-solution.controller';
import {makeImportSolutionController} from '@/src/controllers/solver/import-solution.controller';

export function createSolverModule() {
    const m = createModule();

    // Infrastructure services
    m.bind(DI_SYMBOLS.ISolverService).toClass(PythonCliService, [], 'singleton');
    m.bind(DI_SYMBOLS.IScheduleParserService).toClass(ScheduleParserService, [], 'singleton');

    // Use Cases
    m.bind(DI_SYMBOLS.IValidateConfigUseCase).toHigherOrderFunction(
        makeValidateConfigUseCase,
        [DI_SYMBOLS.ISolverService]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverFetchUseCase).toHigherOrderFunction(
        makeExecuteSolverFetchUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IJobRepository]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverSolveUseCase).toHigherOrderFunction(
        makeExecuteSolverSolveUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IJobRepository]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverSolveMultipleUseCase).toHigherOrderFunction(
        makeExecuteSolverSolveMultipleUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IJobRepository]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverInsertUseCase).toHigherOrderFunction(
        makeExecuteSolverInsertUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IJobRepository]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverDeleteUseCase).toHigherOrderFunction(
        makeExecuteSolverDeleteUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IJobRepository]
    );
    m.bind(DI_SYMBOLS.IFindSolutionFileUseCase).toHigherOrderFunction(
        makeFindSolutionFileUseCase,
        [DI_SYMBOLS.ISolverService]
    );
    m.bind(DI_SYMBOLS.ISaveSolutionUseCase).toHigherOrderFunction(
        makeSaveSolutionUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IScheduleRepository]
    );
    m.bind(DI_SYMBOLS.IImportSolutionUseCase).toHigherOrderFunction(
        makeImportSolutionUseCase,
        [DI_SYMBOLS.ISolverService, DI_SYMBOLS.IScheduleRepository]
    );

    // Controllers
    m.bind(DI_SYMBOLS.IValidateConfigController).toHigherOrderFunction(
        makeValidateConfigController,
        [DI_SYMBOLS.IValidateConfigUseCase]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverFetchController).toHigherOrderFunction(
        makeExecuteSolverFetchController,
        [DI_SYMBOLS.IExecuteSolverFetchUseCase]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverSolveController).toHigherOrderFunction(
        makeExecuteSolverSolveController,
        [DI_SYMBOLS.IExecuteSolverSolveUseCase]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverSolveMultipleController).toHigherOrderFunction(
        makeExecuteSolverSolveMultipleController,
        [DI_SYMBOLS.IExecuteSolverSolveMultipleUseCase]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverInsertController).toHigherOrderFunction(
        makeExecuteSolverInsertController,
        [DI_SYMBOLS.IExecuteSolverInsertUseCase]
    );
    m.bind(DI_SYMBOLS.IExecuteSolverDeleteController).toHigherOrderFunction(
        makeExecuteSolverDeleteController,
        [DI_SYMBOLS.IExecuteSolverDeleteUseCase]
    );
    m.bind(DI_SYMBOLS.IFindSolutionFileController).toHigherOrderFunction(
        makeFindSolutionFileController,
        [DI_SYMBOLS.IFindSolutionFileUseCase]
    );
    m.bind(DI_SYMBOLS.ISaveSolutionController).toHigherOrderFunction(
        makeSaveSolutionController,
        [DI_SYMBOLS.ISaveSolutionUseCase]
    );
    m.bind(DI_SYMBOLS.IImportSolutionController).toHigherOrderFunction(
        makeImportSolutionController,
        [DI_SYMBOLS.IImportSolutionUseCase]
    );

    return m;
}
