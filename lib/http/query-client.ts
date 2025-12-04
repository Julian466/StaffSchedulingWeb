import { QueryClient } from '@tanstack/react-query';

/**
 * Global query client instance for React Query.
 * Configured with default options for caching and refetching behavior.
 * 
 * Default configuration:
 * - staleTime: 60 seconds (data is considered fresh for 1 minute)
 * - refetchOnWindowFocus: false (don't automatically refetch when window regains focus)
 * 
 * This client is used on the server side for prefetching and initial data loading.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds
      refetchOnWindowFocus: false,
    },
  },
});
