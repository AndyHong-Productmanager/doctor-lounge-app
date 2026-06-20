import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChatRepository } from '../../../data/repositories/ChatRepository';

const PER_PAGE = 20;

export function useMessages(threadId: number) {
  return useInfiniteQuery({
    queryKey: ['chatMessages', threadId],
    queryFn: async ({ pageParam }) => {
      return ChatRepository.getMessages(threadId, pageParam, PER_PAGE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.pagination?.total ?? 0;
      const currentPage = allPages.length;
      const fetched = allPages.reduce(
        (sum, p) => sum + p.messages.length,
        0,
      );
      const hasMore =
        lastPage.messages.length >= PER_PAGE || fetched < total;
      return hasMore ? currentPage + 1 : undefined;
    },
    enabled: threadId > 0,
  });
}

export function useNewMessages(
  threadId: number,
  afterId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ['chatNewMessages', threadId, afterId],
    queryFn: () => ChatRepository.getNewMessages(threadId, afterId),
    enabled: enabled && threadId > 0 && afterId > 0,
    refetchInterval: 5000,
  });
}
