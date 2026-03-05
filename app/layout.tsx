import {Providers} from '@/components/providers';
import {NavigationWrapper} from '@/components/app-navigation';
import {WorkflowBanner} from '@/components/workflow-banner';
import {Toaster} from '@/components/ui/sonner';
import type {WorkflowData} from '@/contexts/workflow-context';
import './globals.css';

/** Converts a DD.MM.YYYY date string to MM_YYYY folder format. */
function deriveMonthYear(ddmmyyyy: string): string {
    const parts = ddmmyyyy.split('.');
    if (parts.length === 3) {
        const month = parts[1].padStart(2, '0');
        return `${month}_${parts[2]}`;
    }
    return '';
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const isWorkflowMode = process.env.WORKFLOW_MODE === 'true';
    const caseId = process.env.WORKFLOW_CASE ?? null;
    const startDate = process.env.WORKFLOW_START ?? null;
    const endDate = process.env.WORKFLOW_END ?? null;

    const workflowData: WorkflowData | null =
        isWorkflowMode && caseId && startDate && endDate
            ? {
                caseId,
                monthYear: deriveMonthYear(startDate),
                startDate,
                endDate,
                isWorkflowMode: true,
            }
            : null;

    return (
        <html lang="de">
        <body>
        <Providers workflowData={workflowData}>
            <NavigationWrapper/>
            <main className="container mx-auto p-4">
                <WorkflowBanner/>
                {children}
            </main>
            <Toaster/>
        </Providers>
        </body>
        </html>
    );
}
