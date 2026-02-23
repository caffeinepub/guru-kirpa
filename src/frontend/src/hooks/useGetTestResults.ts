import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TestResult } from '../backend';

export function useGetTestResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TestResult[]>({
    queryKey: ['testResults'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestResults();
    },
    enabled: !!actor && !actorFetching,
  });
}
