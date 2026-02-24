import {Providers} from '@/components/providers';
import {NavigationWrapper} from '@/components/app-navigation';
import {WorkflowBanner} from '@/components/workflow-banner';
import {Toaster} from '@/components/ui/sonner';
import './globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
        <body>
        <Providers>
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
