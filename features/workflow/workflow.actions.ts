'use server';

export async function getWorkflowEnvAction() {
    const workflowMode = process.env.WORKFLOW_MODE === 'true';

    if (!workflowMode) {
        return {isWorkflowMode: false};
    }

    return {
        isWorkflowMode: true,
        caseId: process.env.WORKFLOW_CASE || null,
        startDate: process.env.WORKFLOW_START || null,
        endDate: process.env.WORKFLOW_END || null,
    };
}
