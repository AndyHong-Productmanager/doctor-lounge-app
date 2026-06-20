import { useQuery } from '@tanstack/react-query';
import { FeedRepository } from '../../../data/repositories/FeedRepository';

export function useFeedDetail(id: number) {
  return useQuery({
    queryKey: ['feed', id],
    queryFn: () => FeedRepository.getFeedById(id),
    enabled: id > 0,
  });
}
