import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query';
import {getNotes, getNoteById, createNote, updateNote, deleteNote} from '../services/storage';

//on définit les options UNE FOIS et on les réutilise partout sans se répéter

export const notesQueryOptions = queryOptions({
  queryKey: ['notes'],
  queryFn: getNotes,
});

export const noteByIdQueryOptions = (id) =>
  queryOptions({
    queryKey: ['notes', id],
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });

//Hooks 
export const useNotes = () => useQuery(notesQueryOptions);

export const useNote = (id) => useQuery(noteByIdQueryOptions(id));

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => updateNote(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', variables.id] });
    }
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};