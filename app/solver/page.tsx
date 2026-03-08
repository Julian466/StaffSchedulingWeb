import {SolverPageClient} from './solver-page-client';
import {getJobs, checkSolverHealth, getLastInsertedSolution} from '@/features/solver/solver.actions';
import {getWorkflowSession} from '@/src/infrastructure/services/workflow-session.service';
import {getSelectedScheduleAction} from '@/features/schedule/schedule.actions';

export default async function SolverPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<{ caseId?: string; monthYear?: string }>;
}) {
    const [{caseId: caseIdStr, monthYear}, workflowState] = await Promise.all([
        searchParams,
        getWorkflowSession(),
    ]);

    if (!caseIdStr || !monthYear) {
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case
            aus</div>;
    }

    const caseId = Number(caseIdStr);
    if (isNaN(caseId) || caseId <= 0 || !/^(0?[1-9]|1[0-2])_\d{4}$/.test(monthYear)) {
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Bitte wähle einen Case
            aus</div>;
    }

    const [configResult, jobsData, lastInsertedResult, selectedScheduleData] = await Promise.all([
        checkSolverHealth(),
        getJobs(caseId, monthYear).catch(() => ({jobs: []})),
        getLastInsertedSolution(caseId, monthYear).catch(() => ({success: true, data: null})),
        getSelectedScheduleAction(caseId, monthYear).catch(() => ({solution: null})),
    ]);
    const configValidation = configResult.success ? configResult.data : null;
    const initialLastInsertedSolution = lastInsertedResult.success ? lastInsertedResult.data : null;
    const initialPendingInsertSolution = selectedScheduleData.solution ?? null;

    return <SolverPageClient
        caseId={caseId}
        monthYear={monthYear}
        initialConfigValidation={configValidation}
        initialJobs={jobsData.jobs}
        initialLastInsertedSolution={initialLastInsertedSolution}
        initialPendingInsertSolution={initialPendingInsertSolution}
        isLocked={workflowState.isWorkflowMode}
    />;
}
