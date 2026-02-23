import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Principal } from '@dfinity/principal';
import type { TestResult } from '../backend';

export function useGetTestResultsFor(student: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TestResult[]>({
    queryKey: ['testResultsFor', student?.toString()],
    queryFn: async () => {
      if (!actor || !student) return [];
      return actor.getTestResultsFor(student);
    },
    enabled: !!actor && !actorFetching && !!student,
  });
}
