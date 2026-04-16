import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import { getCategories, createCategory } from '../services/storage';

// Query Options
export const categoriesQueryOptions = queryOptions({
  queryKey: ['categories'],
  queryFn: getCategories,
});

// Hooks
export const useCategories = () => useQuery(categoriesQueryOptions);

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};