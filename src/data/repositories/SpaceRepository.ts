import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import {
  SpacesResponseSchema,
  SpaceItemSchema,
  type SpaceItem,
} from '../schemas/space';

const BASE = FLUENT_API;

export const SpaceRepository = {
  async getSpaces(): Promise<SpaceItem[]> {
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
