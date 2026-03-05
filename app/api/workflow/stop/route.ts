import { NextRequest, NextResponse } from 'next/server';
import { clearWorkflowSession } from '@/src/infrastructure/services/workflow-session.service';

export async function GET(request: NextRequest) {
    await clearWorkflowSession();
    return NextResponse.redirect(new URL('/', request.url));
}
