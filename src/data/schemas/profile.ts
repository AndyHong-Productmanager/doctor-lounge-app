import { z } from 'zod';

export const UserProfileSchema = z.object({
  display_name: z.string().optional().default(''),
  username: z.string().optional().default(''),
  avatar: z.string().nullable().optional(),
  cover_photo: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  short_description: z.string().nullable().optional(),
  created_at: z.string().optional(),
  user_id: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }),
  status: z.string().nullable().optional(),
  is_verified: z.union([z.boolean(), z.number()]).optional().default(false).transform((v) => Boolean(v)),
  total_points: z.union([z.string(), z.number()]).optional().default(0).transform((v) => Number(v)),
  last_activity: z.string().nullable().optional(),
  permalink: z.string().nullable().optional(),
  has_custom_avatar: z.boolean().optional(),
  badge_slugs: z.array(z.string()).optional().default([]),
  is_restricted: z.boolean().optional(),
  profile_navs: z.array(z.unknown()).optional().default([]),
  counts: z
    .object({
      posts: z.number().optional().default(0),
      comments: z.number().optional().default(0),
      spaces: z.number().optional().default(0),
    })
    .nullable()
    .optional(),
});

/**
 * Profile response — accepts both { user: {...} } and direct profile object.
 * The repository handles extraction.
 */
export const ProfileResponseSchema = z.object({
  user: UserProfileSchema.optional(),
}).passthrough();

export type UserProfile = z.infer<typeof UserProfileSchema>;
