import { useQuery } from '@tanstack/react-query';
import { MemberRepository } from '../../../data/repositories/MemberRepository';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => MemberRepository.getMembersList(),
  });
}
