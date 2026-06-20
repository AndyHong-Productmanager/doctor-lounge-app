import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileRepository } from '../../../data/repositories/ProfileRepository';
import type { UserProfile } from '../../../data/schemas/profile';

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => ProfileRepository.getProfile(username),
    enabled: username.length > 0,
  });
}

export function useProfileSpaces(username: string) {
  return useQuery({
    queryKey: ['profileSpaces', username],
    queryFn: () => ProfileRepository.getProfileSpaces(username),
    enabled: username.length > 0,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      username,
      data,
    }: {
      username: string;
      data: Partial<Pick<UserProfile, 'display_name' | 'short_description'>>;
    }) => ProfileRepository.updateProfile(username, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['profile', variables.username],
      });
    },
  });
}
