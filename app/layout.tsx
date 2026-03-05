import {NavigationWrapper} from '@/components/app-navigation';
import {WorkflowBanner} from '@/components/workflow-banner';
import {Toaster} from '@/components/ui/sonner';
import {getWorkflowSession} from '@/src/infrastructure/services/workflow-session.service';
import './globals.css';

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const workflowState = await getWorkflowSession();

    return (
        <html lang="de">
        <body>
        <NavigationWrapper isLocked={workflowState.isWorkflowMode}/>
        <main className="container mx-auto p-4">
            <WorkflowBanner state={workflowState}/>
            {children}
        </main>
        <Toaster/>
        </body>
        </html>
    );
}
