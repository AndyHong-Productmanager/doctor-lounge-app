import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FollowRepository } from '../../../data/repositories/FollowRepository';

export function useFollowers(username: string) {
  return useQuery({
    queryKey: ['followers', username],
    queryFn: () => FollowRepository.getFollowers(username),
    enabled: username.length > 0,
  });
}

export function useFollowings(username: string) {
  return useQuery({
    queryKey: ['followings', username],
    queryFn: () => FollowRepository.getFollowings(username),
    enabled: username.length > 0,
  });
}

export function useFollowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => FollowRepository.follow(username),
    onSuccess: (_data, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['followers', username] });
      queryClient.invalidateQueries({ queryKey: ['followings'] });
    },
  });
}

export function useUnfollowMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => FollowRepository.unfollow(username),
    onSuccess: (_data, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['followers', username] });
      queryClient.invalidateQueries({ queryKey: ['followings'] });
    },
  });
}

export function useBlockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => FollowRepository.block(username),
    onSuccess: (_data, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });
}

export function useUnblockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => FollowRepository.unblock(username),
    onSuccess: (_data, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });
}
