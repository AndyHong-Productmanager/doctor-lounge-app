import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import type { MemberItem } from '../schemas/member';

const BASE = FLUENT_API;

export interface FollowToggleResponse {
  is_following: boolean;
}

export interface FollowersResponse {
  members: MemberItem[];
}

export const FollowRepository = {
  async follow(username: string): Promise<FollowToggleResponse> {
    const { data } = await client.post(`${BASE}/profile/${username}/follow`);
    return data as FollowToggleResponse;
  },

  async unfollow(username: string): Promise<FollowToggleResponse> {
    const { data } = await client.post(`${BASE}/profile/${username}/unfollow`);
    return data as FollowToggleResponse;
  },

  async toggleFollow(userId: number): Promise<FollowToggleResponse> {
    const { data } = await client.post(`${BASE}/profile/${userId}/toggle-follow`);
    return data as FollowToggleResponse;
  },

  async block(username: string): Promise<{ success: boolean }> {
    const { data } = await client.post(`${BASE}/profile/${username}/block`);
    return data as { success: boolean };
  },

  async unblock(username: string): Promise<{ success: boolean }> {
    const { data } = await client.post(`${BASE}/profile/${username}/unblock`);
    return data as { success: boolean };
  },

  async getFollowers(username: string): Promise<MemberItem[]> {
    const { data } = await client.get(`${BASE}/profile/${username}/followers`);
    const result = data as FollowersResponse;
    return result.members ?? [];
  },

  async getFollowings(username: string): Promise<MemberItem[]> {
    const { data } = await client.get(`${BASE}/profile/${username}/followings`);
    const result = data as FollowersResponse;
    return result.members ?? [];
  },
};
