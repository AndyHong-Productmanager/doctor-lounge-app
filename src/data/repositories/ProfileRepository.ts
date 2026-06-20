import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import {
  UserProfileSchema,
  type UserProfile,
} from '../schemas/profile';
import { SpacesResponseSchema, AllSpacesResponseSchema, type SpaceItem } from '../schemas/space';

const BASE = FLUENT_API;

export const ProfileRepository = {
  async getProfile(username: string): Promise<UserProfile> {
    const { data } = await client.get(`${BASE}/profile/${username}`);
    // Handle both { user: {...} } and direct profile object
    const raw = data.user ?? data.profile ?? data;
    return UserProfileSchema.parse(raw);
  },

  async updateProfile(
    username: string,
    payload: Partial<Pick<UserProfile, 'display_name' | 'short_description'>>
  ) {
    const { data } = await client.put(
      `${BASE}/profile/${username}`,
      payload
    );
    const raw = data.user ?? data.profile ?? data;
    return UserProfileSchema.parse(raw);
  },

  async getProfileSpaces(username: string): Promise<SpaceItem[]> {
    const { data } = await client.get(`${BASE}/profile/${username}/spaces`);
    // Try simple array first, then paginated
    try {
      const parsed = SpacesResponseSchema.parse(data);
      return parsed.spaces;
    } catch {
      try {
        const parsed = AllSpacesResponseSchema.parse(data);
        return parsed.spaces.data;
      } catch {
        // Fallback: try extracting array directly
        const raw = data.spaces ?? data;
        return Array.isArray(raw) ? raw : (raw?.data ?? []);
      }
    }
  },
};
