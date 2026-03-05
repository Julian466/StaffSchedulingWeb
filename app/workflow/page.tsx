import {redirect} from 'next/navigation';
import {getJobs, validateConfig} from '@/features/solver/solver.actions';
import {WorkflowPageClient} from './workflow-page-client';
import {getWorkflowSession} from '@/src/infrastructure/services/workflow-session.service';

/** Converts DD.MM.YYYY -> YYYY-MM-DD */
function convertToISODate(ddmmyyyy: string): string {
    const parts = ddmmyyyy.split('.');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return ddmmyyyy;
}

export default async function WorkflowPage() {
    const state = await getWorkflowSession();

    if (!state.isWorkflowMode || state.caseId === null || !state.startDate || !state.endDate || !state.monthYear) {
        redirect('/');
    }

    const caseId = state.caseId;
    const startDate = state.startDate;
    const endDate = state.endDate;
    const monthYear = state.monthYear;
    const isoStart = convertToISODate(startDate);
    const isoEnd = convertToISODate(endDate);

    const [configResult, jobsData] = await Promise.all([
        validateConfig(),
        getJobs(caseId, monthYear).catch(() => ({jobs: []})),
    ]);
    const initialConfig = configResult.success ? configResult.data : null;

    return (
        <WorkflowPageClient
            caseId={caseId}
            monthYear={monthYear}
            startDate={startDate}
            endDate={endDate}
            isoStart={isoStart}
            isoEnd={isoEnd}
            initialConfig={initialConfig}
            initialJobs={jobsData.jobs}
        />
    );
}
