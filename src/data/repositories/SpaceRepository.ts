import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import {
  AllSpacesResponseSchema,
  SpacesResponseSchema,
  SpaceItemSchema,
  type SpaceItem,
} from '../schemas/space';

const BASE = FLUENT_API;

export const SpaceRepository = {
  /**
   * Fetch all spaces (public listing).
   * Uses `/spaces/all-spaces` which returns a paginated wrapper.
   */
  async getSpaces(): Promise<SpaceItem[]> {
    const { data } = await client.get(`${BASE}/spaces/all-spaces`);
    const parsed = AllSpacesResponseSchema.parse(data);
    return parsed.spaces.data;
  },

  /**
   * Fetch user's joined spaces (requires auth).
   * Uses `/spaces` which returns a simple array.
   */
  async getMySpaces(): Promise<SpaceItem[]> {
    const { data } = await client.get(`${BASE}/spaces`);
    const parsed = SpacesResponseSchema.parse(data);
    return parsed.spaces;
  },

  async getSpaceBySlug(slug: string): Promise<SpaceItem> {
    const { data } = await client.get(`${BASE}/spaces/${slug}/by-slug`);
    const space = data.space ?? data;
    return SpaceItemSchema.parse(space);
  },

  async joinSpace(slug: string) {
    const { data } = await client.post(`${BASE}/spaces/${slug}/join`);
    return data as { success: boolean };
  },

  async leaveSpace(slug: string) {
    const { data } = await client.post(`${BASE}/spaces/${slug}/leave`);
    return data as { success: boolean };
  },
};
