import { z } from 'zod';

export const MemberItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  display_name: z.string().optional().default(''),
  username: z.string().optional().default(''),
  avatar: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  is_verified: z.union([z.boolean(), z.number()]).optional().default(false).transform((v) => Boolean(v)),
  total_points: z.union([z.string(), z.number()]).optional().default(0).transform((v) => Number(v)),
  last_activity: z.string().nullable().optional(),
});

/**
 * Raw response schema — accepts both array and paginated object for the members field.
 */
export const MembersResponseSchema = z.object({
  members: z.union([
    z.array(MemberItemSchema),
    z.object({
      data: z.array(MemberItemSchema).optional().default([]),
      total: z.number().optional(),
      per_page: z.number().optional(),
      current_page: z.number().optional(),
    }),
  ]),
});

export type MemberItem = z.infer<typeof MemberItemSchema>;
