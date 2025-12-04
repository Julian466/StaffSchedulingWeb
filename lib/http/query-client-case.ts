'use client';

import { QueryClient as TanStackQueryClient } from '@tanstack/react-query';
import { useCase } from '@/components/case-provider';

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
 * Custom hook that provides a fetch function with automatic case ID injection.
 * This hook ensures all API requests include the current case ID in the headers.
 * 
 * The case ID is automatically added to the 'x-case-id' header for every request,
 * allowing API routes to determine which case data to access.
 * 
 * @returns A fetch function that automatically includes the case ID header
 * 
 * @example
 * function MyComponent() {
 *   const caseFetch = useCaseFetch();
 *   
 *   const fetchData = async () => {
 *     const response = await caseFetch('/api/employees');
 *     // The request will include 'x-case-id' header automatically
 *   };
 * }
 */
export function useCaseFetch() {
  const { currentCaseId } = useCase();

  return async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    // Inject the current case ID into the request headers
    headers.set('x-case-id', currentCaseId.toString());

    return fetch(url, {
      ...options,
      headers,
    });
  };
}
