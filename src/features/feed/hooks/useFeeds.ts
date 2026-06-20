import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedRepository, type FeedListParams } from '../../../data/repositories/FeedRepository';

export function useFeeds(params: Omit<FeedListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['feeds', params],
    queryFn: async ({ pageParam }) => {
      return FeedRepository.getFeeds({ ...params, page: pageParam, per_page: 15 });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.pagination?.total ?? 0;
      const currentPage = allPages.length;
      const hasMore = lastPage.posts.length >= 15 || currentPage * 15 < total;
      return hasMore ? currentPage + 1 : undefined;
    },
  });
}
