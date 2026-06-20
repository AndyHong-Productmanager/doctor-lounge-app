import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SpaceRepository } from '../../../data/repositories/SpaceRepository';

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: () => SpaceRepository.getSpaces(),
  });
}

export function useSpaceDetail(slug: string) {
  return useQuery({
    queryKey: ['space', slug],
    queryFn: () => SpaceRepository.getSpaceBySlug(slug),
    enabled: slug.length > 0,
  });
}

export function useJoinSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => SpaceRepository.joinSpace(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
  });
}

export function useLeaveSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => SpaceRepository.leaveSpace(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
  });
}
