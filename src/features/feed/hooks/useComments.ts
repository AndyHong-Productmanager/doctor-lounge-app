import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedRepository } from '../../../data/repositories/FeedRepository';

export function useComments(feedId: number) {
  return useInfiniteQuery({
    queryKey: ['comments', feedId],
    queryFn: async ({ pageParam }) => {
      return FeedRepository.getComments(feedId, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length >= 15 ? allPages.length + 1 : undefined;
    },
    enabled: feedId > 0,
  });
}
