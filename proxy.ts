import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = [
    '/employees',
    '/solver',
    '/wishes-and-blocked',
    '/schedule',
    '/weights',
    '/minimal-staff',
];

export function proxy(request: NextRequest) {
    // 1. Ist der Modus überhaupt aktiv?
    const workflowMode = request.cookies.get('workflow_mode')?.value;
    if (workflowMode !== 'true') {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // 2. Sind wir auf einer geschützten Route?
    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (!isProtected) {
        return NextResponse.next();
    }

    // 3. Cookie-Werte sicher auslesen
    const cookieCaseId = request.cookies.get('workflow_case')?.value;
    const cookieStart = request.cookies.get('workflow_start')?.value;

    // Sicherheits-Check: Wenn der Modus "true" ist, aber die Daten fehlen,
    // ist der State korrupt. Um Endlosschleifen/Leerstings zu vermeiden, brechen wir hier ab.
    if (!cookieCaseId || !cookieStart) {
        return NextResponse.next();
    }

    // Derive MM_YYYY from DD.MM.YYYY — pure JS, Edge-compatible
    const parts = cookieStart.split('.');
    const cookieMonthYear = parts.length === 3
        ? `${parts[1].padStart(2, '0')}_${parts[2]}`
        : '';

    if (!cookieMonthYear) {
        return NextResponse.next();
    }

    // 4. URL abgleichen und korrigieren
    const url = request.nextUrl.clone();
    const urlCaseId = url.searchParams.get('caseId');
    const urlMonthYear = url.searchParams.get('monthYear');

    if (urlCaseId !== cookieCaseId || urlMonthYear !== cookieMonthYear) {
        url.searchParams.set('caseId', cookieCaseId);
        url.searchParams.set('monthYear', cookieMonthYear);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
};
