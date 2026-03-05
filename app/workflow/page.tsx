import {redirect} from 'next/navigation';
import {validateConfig, getJobs} from '@/features/solver/solver.actions';
import {WorkflowPageClient} from './workflow-page-client';

/** Converts DD.MM.YYYY -> YYYY-MM-DD */
function convertToISODate(ddmmyyyy: string): string {
    const parts = ddmmyyyy.split('.');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return ddmmyyyy;
}

/** Converts DD.MM.YYYY -> MM_YYYY */
function deriveMonthYear(ddmmyyyy: string): string {
    const parts = ddmmyyyy.split('.');
    if (parts.length === 3) {
        return `${parts[1].padStart(2, '0')}_${parts[2]}`;
    }
    return ddmmyyyy;
}

export default async function WorkflowPage() {
    const isWorkflowMode = process.env.WORKFLOW_MODE === 'true';
    const caseIdStr = process.env.WORKFLOW_CASE ?? '';
    const startDate = process.env.WORKFLOW_START ?? '';
    const endDate = process.env.WORKFLOW_END ?? '';

    if (!isWorkflowMode || !caseIdStr || !startDate || !endDate) {
        redirect('/');
    }

    const caseId = parseInt(caseIdStr, 10);
    const monthYear = deriveMonthYear(startDate);
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
