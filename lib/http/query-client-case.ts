'use client';

import { QueryClient as TanStackQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

/**
 * Creates a new React Query client instance for case-specific queries.
 * This factory function allows creating clients that are aware of the current case context.
 * 
 * @param getCurrentCaseId - Function that returns the current case ID
 * @returns A new QueryClient instance configured with default options
 * 
 * @example
 * const client = createQueryClient(() => currentCaseId);
 */
export function createQueryClient(getCurrentCaseId: () => number) {
  return new TanStackQueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60 seconds
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Custom hook that provides a fetch function with automatic case ID and monthYear injection.
 * This hook ensures all API requests include the current case ID and monthYear in the headers.
 * 
 * The case ID is automatically added to the 'x-case-id' header and monthYear to 'x-month-year' header
 * for every request, allowing API routes to determine which case data to access.
 * 
 * @returns A fetch function that automatically includes the case ID and monthYear headers
 * 
 * @example
 * function MyComponent() {
 *   const caseFetch = useCaseFetch();
 *   
 *   const fetchData = async () => {
 *     const response = await caseFetch('/api/employees');
 *     // The request will include 'x-case-id' and 'x-month-year' headers automatically
 *   };
 * }
 */
export function useCaseFetch() {
  const searchParams = useSearchParams();
  const caseIdStr = searchParams.get('caseId');
  const monthYearStr = searchParams.get('monthYear');

  return async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    // Inject the current case ID and monthYear into the request headers
    if (caseIdStr && monthYearStr) {
      headers.set('x-case-id', caseIdStr);
      headers.set('x-month-year', monthYearStr);
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };
}
