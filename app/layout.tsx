import { Providers } from '@/components/providers';
import { AppNavigation } from '@/components/app-navigation';
import { Toaster } from '@/components/ui/sonner';
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
          <AppNavigation />
          <main className="container mx-auto p-4">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
