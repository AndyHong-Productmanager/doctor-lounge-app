import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SpaceRepository } from '../../../data/repositories/SpaceRepository';
import type { SpaceItem } from '../../../data/schemas/space';

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: () => SpaceRepository.getSpaces(),
  });
}

export function useSpaceDetail(slug: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['space', slug],
    queryFn: () => SpaceRepository.getSpaceBySlug(slug),
    enabled: slug.length > 0,
    select: (data) => {
      if (!data.members_count) {
        const spaces = queryClient.getQueryData<SpaceItem[]>(['spaces']);
        const cached = spaces?.find(s => s.slug === slug);
        if (cached?.members_count) {
          return { ...data, members_count: cached.members_count };
        }
      }
      return data;
    },
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
