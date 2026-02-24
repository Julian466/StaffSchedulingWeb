// Server component: compute search parameters and render a thin client wrapper
import {HomePageClient} from '@/components/home-page-client';

// The actual UI and hooks live in a client component below

export default async function HomePage({
                                           searchParams,
                                       }: {
    searchParams: Promise<{ caseId?: string; monthYear?: string }>;
}) {
    const {caseId, monthYear} = await searchParams;
    const caseSearch = caseId && monthYear ? `?caseId=${caseId}&monthYear=${monthYear}` : '';

    return <HomePageClient caseSearch={caseSearch}/>;
}

