import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Principal } from '@dfinity/principal';

interface DeleteTestResultParams {
  student: Principal;
  examName: string;
}

export function useDeleteTestResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ student, examName }: DeleteTestResultParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTestResultForStudent(student, examName);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['testResults'] });
      queryClient.invalidateQueries({ queryKey: ['testResultsFor', variables.student.toString()] });
    },
  });
}
