import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedRepository } from '../../../data/repositories/FeedRepository';

export function useCreateFeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { message: string; space_id?: number }) =>
      FeedRepository.createFeed(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });
}

export function useDeleteFeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => FeedRepository.deleteFeed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });
}

export function useToggleReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: number) => FeedRepository.toggleReaction(feedId),
    onSuccess: (_data, feedId) => {
      queryClient.invalidateQueries({ queryKey: ['feed', feedId] });
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ feedId, message }: { feedId: number; message: string }) =>
      FeedRepository.addComment(feedId, message),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.feedId],
      });
      queryClient.invalidateQueries({ queryKey: ['feed', variables.feedId] });
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });
}
