import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Principal } from '@dfinity/principal';
import type { TestResult } from '../backend';

interface CreateTestResultParams {
  student: Principal;
  testResult: TestResult;
}

export function useCreateTestResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ student, testResult }: CreateTestResultParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTestResultForStudent(student, testResult);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['testResults'] });
      queryClient.invalidateQueries({ queryKey: ['testResultsFor', variables.student.toString()] });
    },
  });
}
