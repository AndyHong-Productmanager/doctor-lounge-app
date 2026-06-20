import { z } from 'zod';

export const UserProfileSchema = z.object({
  display_name: z.string(),
  username: z.string(),
  avatar: z.string().nullable().optional(),
  cover_photo: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  created_at: z.string().optional(),
  counts: z
    .object({
      posts: z.number().optional().default(0),
      comments: z.number().optional().default(0),
      spaces: z.number().optional().default(0),
    })
    .optional(),
});

export const ProfileResponseSchema = z.object({
  user: UserProfileSchema,
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
