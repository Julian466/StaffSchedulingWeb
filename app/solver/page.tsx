import {SolverPageClient} from './solver-page-client';
import {validateConfig, getJobs} from '@/features/solver/solver.actions';
import {getWorkflowSession} from '@/src/infrastructure/services/workflow-session.service';

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

    const [configResult, jobsData] = await Promise.all([
        validateConfig(),
        getJobs(caseId, monthYear).catch(() => ({jobs: []})),
    ]);
    const configValidation = configResult.success ? configResult.data : null;

    return <SolverPageClient
        caseId={caseId}
        monthYear={monthYear}
        initialConfigValidation={configValidation}
        initialJobs={jobsData.jobs}
        isLocked={workflowState.isWorkflowMode}
    />;
}
