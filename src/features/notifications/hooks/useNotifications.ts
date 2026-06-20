import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationRepository } from '../../../data/repositories/NotificationRepository';

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam }) => {
      return NotificationRepository.getNotifications(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.notifications.length >= 15
        ? allPages.length + 1
        : undefined;
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationRepository.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
