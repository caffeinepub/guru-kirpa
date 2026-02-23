import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Principal } from '@dfinity/principal';
import type { TestResult } from '../backend';

interface UpdateTestResultParams {
  student: Principal;
  examName: string;
  updatedResult: TestResult;
}

export function useUpdateTestResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ student, examName, updatedResult }: UpdateTestResultParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestResultForStudent(student, examName, updatedResult);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['testResults'] });
      queryClient.invalidateQueries({ queryKey: ['testResultsFor', variables.student.toString()] });
    },
  });
}
