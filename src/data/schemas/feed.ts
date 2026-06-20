import { z } from 'zod';

export const XProfileSchema = z.object({
  display_name: z.string(),
  avatar: z.string().nullable().optional(),
  username: z.string(),
});

export const FeedItemSchema = z.object({
  id: z.number(),
  message: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  space_id: z.number().nullable().optional(),
  comments_count: z.number().optional().default(0),
  reactions_count: z.number().optional().default(0),
  is_reacted: z.boolean().optional().default(false),
  is_bookmarked: z.boolean().optional().default(false),
  content_type: z.string().optional().default('text'),
  slug: z.string().optional().default(''),
  xprofile: XProfileSchema.optional(),
});

export const FeedListResponseSchema = z.object({
  posts: z.array(FeedItemSchema),
  pagination: z
    .object({
      total: z.number().optional(),
      page: z.number().optional(),
    })
    .optional(),
});

export const CommentItemSchema = z.object({
  id: z.number(),
  message: z.string(),
  created_at: z.string(),
  xprofile: XProfileSchema.optional(),
  reactions_count: z.number().optional().default(0),
});

export const CommentsResponseSchema = z.object({
  comments: z.array(CommentItemSchema).optional().default([]),
});

export type XProfile = z.infer<typeof XProfileSchema>;
export type FeedItem = z.infer<typeof FeedItemSchema>;
export type FeedListResponse = z.infer<typeof FeedListResponseSchema>;
export type CommentItem = z.infer<typeof CommentItemSchema>;
