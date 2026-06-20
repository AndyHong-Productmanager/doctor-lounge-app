import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import { MembersResponseSchema, type MemberItem } from '../schemas/member';

const BASE = FLUENT_API;

export const MemberRepository = {
  async getMembersList(): Promise<MemberItem[]> {
    const { data } = await client.get(`${BASE}/members`);
    const parsed = MembersResponseSchema.parse(data);
    return parsed.members;
  },
};
