import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedRepository, type FeedListParams } from '../../../data/repositories/FeedRepository';

export function useFeeds(params: Omit<FeedListParams, 'page'> = {}, options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    queryKey: ['feeds', params],
    queryFn: async ({ pageParam }) => {
      return FeedRepository.getFeeds({ ...params, page: pageParam, per_page: 15 });
    },
    initialPageParam: 1,
    enabled: options?.enabled,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.feeds.total ?? 0;
      const currentPage = allPages.length;
      const perPage = lastPage.feeds.per_page ?? 15;
      const hasMore = lastPage.feeds.data.length >= perPage || currentPage * perPage < total;
      return hasMore ? currentPage + 1 : undefined;
    },
  });
}
