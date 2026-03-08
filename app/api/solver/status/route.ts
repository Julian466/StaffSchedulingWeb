import { NextResponse } from 'next/server';
import { getSolverApiConfig } from '@/lib/config/app-config';

/**
 * GET /api/solver/status
 *
 * Proxies GET /status from the Python solver API.
 * Must be a Route Handler (not a Server Action) so it can be called concurrently
 * from the browser while a Server Action (solve / solve-multiple) is in-flight.
 * Server Actions hold a per-session lock; Route Handlers do not.
 */
export async function GET() {
    try {
        const { baseUrl } = getSolverApiConfig();
        const response = await fetch(`${baseUrl}/status`, { cache: 'no-store' });

        if (!response.ok) {
            return NextResponse.json({ error: `Solver API returned ${response.status}` }, { status: 502 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 502 });
    }
}
