import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import {
  ProfileResponseSchema,
  UserProfileSchema,
  type UserProfile,
} from '../schemas/profile';
import { SpacesResponseSchema, type SpaceItem } from '../schemas/space';

const BASE = FLUENT_API;

export const ProfileRepository = {
  async getProfile(username: string): Promise<UserProfile> {
    const { data } = await client.get(`${BASE}/profile/${username}`);
    const parsed = ProfileResponseSchema.parse(data);
    return parsed.user;
  },

  async updateProfile(
    username: string,
    payload: Partial<Pick<UserProfile, 'display_name' | 'bio' | 'avatar'>>
  ) {
    const { data } = await client.post(
      `${BASE}/profile/${username}`,
      payload
    );
    const user = data.user ?? data;
    return UserProfileSchema.parse(user);
  },

  async getProfileSpaces(username: string): Promise<SpaceItem[]> {
    const { data } = await client.get(`${BASE}/profile/${username}/spaces`);
    const parsed = SpacesResponseSchema.parse(data);
    return parsed.spaces;
  },
};
