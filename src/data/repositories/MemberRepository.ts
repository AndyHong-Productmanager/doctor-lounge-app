import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import { MembersResponseSchema, type MemberItem } from '../schemas/member';

const BASE = FLUENT_API;

export const MemberRepository = {
  async getMembersList(): Promise<MemberItem[]> {
    try {
      const { data } = await client.get(`${BASE}/members`);
      // API returns { message, permission_failed: true } when not authenticated
      if (data?.permission_failed) {
        return [];
      }
      const parsed = MembersResponseSchema.parse(data);
      // Handle both array and paginated object
      const raw = parsed.members;
      const list: MemberItem[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];
      return list;
    } catch {
      return [];
    }
  },
};
