import { z } from 'zod';

export const MemberItemSchema = z.object({
  id: z.number(),
  display_name: z.string(),
  username: z.string(),
  avatar: z.string().nullable().optional(),
});

export const MembersResponseSchema = z.object({
  members: z.array(MemberItemSchema),
});

export type MemberItem = z.infer<typeof MemberItemSchema>;
