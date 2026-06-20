import { z } from 'zod';

export const XProfileSchema = z.object({
  user_id: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }),
  display_name: z.string(),
  avatar: z.string().nullable().optional(),
  username: z.string(),
  status: z.string().optional(),
  total_points: z.number().optional(),
  is_verified: z.number().optional(),
  meta: z.record(z.string(), z.unknown()).nullable().optional(),
  last_activity: z.string().optional(),
  permalink: z.string().optional(),
});

export const FeedItemSchema = z.object({
  id: z.number(),
  slug: z.string().optional().default(''),
  message_rendered: z.string(),
  meta: z.record(z.string(), z.unknown()).nullable().optional(),
  title: z.string().nullable().optional(),
  featured_image: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  privacy: z.string().optional(),
  priority: z.number().optional(),
  type: z.string().optional(),
  content_type: z.string().optional().default('text'),
  space_id: z.union([z.string(), z.number()]).nullable().optional().transform((val) => {
    if (val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }),
  user_id: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }),
  status: z.string().optional(),
  is_sticky: z.number().optional(),
  comments_count: z.number().optional().default(0),
  reactions_count: z.number().optional().default(0),
  permalink: z.string().optional(),
  xprofile: XProfileSchema.optional(),
  comments: z.array(z.unknown()).optional().default([]),
  space: z.record(z.string(), z.unknown()).nullable().optional(),
  reactions: z.array(z.unknown()).optional().default([]),
  terms: z.array(z.unknown()).optional().default([]),
  // client-side fields (may not come from API)
  is_reacted: z.boolean().optional().default(false),
  is_bookmarked: z.boolean().optional().default(false),
});

export const FeedListResponseSchema = z.object({
  feeds: z.object({
    data: z.array(FeedItemSchema),
    total: z.number().optional(),
    per_page: z.number().optional(),
  }),
  sticky: z.array(FeedItemSchema).nullable().optional().default([]),
  execution_time: z.number().optional(),
});

export const CommentItemSchema = z.object({
  id: z.number(),
  message: z.string().optional().default(''),
  message_rendered: z.string().optional().default(''),
  created_at: z.string(),
  xprofile: XProfileSchema.optional(),
  reactions_count: z.number().optional().default(0),
});

export const CommentsResponseSchema = z.object({
  comments: z.array(CommentItemSchema).optional().default([]),
}).passthrough();

export type XProfile = z.infer<typeof XProfileSchema>;
export type FeedItem = z.infer<typeof FeedItemSchema>;
export type FeedListResponse = z.infer<typeof FeedListResponseSchema>;
export type CommentItem = z.infer<typeof CommentItemSchema>;
