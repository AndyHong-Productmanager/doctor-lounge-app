import { useQuery } from '@tanstack/react-query';
import { ChatRepository } from '../../../data/repositories/ChatRepository';

export function useThreads() {
  return useQuery({
    queryKey: ['chatThreads'],
    queryFn: () => ChatRepository.getThreads(),
    refetchInterval: 30000,
  });
}

export function useUnreadThreads() {
  return useQuery({
    queryKey: ['chatUnreadThreads'],
    queryFn: () => ChatRepository.getUnreadThreads(),
    refetchInterval: 30000,
  });
}
