import { z } from 'zod';

export const NotificationItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  title: z.string().optional().default(''),
  content: z.string().optional().default(''),
  type: z.string().optional().default('general'),
  is_read: z.union([z.boolean(), z.number()]).optional().default(false).transform((v) => Boolean(v)),
  created_at: z.string().optional().default(''),
  route: z.string().nullable().optional(),
  src_object_type: z.string().nullable().optional(),
  src_object_id: z.union([z.string(), z.number()]).nullable().optional().transform((v) => {
    if (v === null || v === undefined) return null;
    const num = Number(v);
    return isNaN(num) ? null : num;
  }),
  feed_id: z.union([z.string(), z.number()]).nullable().optional().transform((v) => {
    if (v === null || v === undefined) return null;
    const num = Number(v);
    return isNaN(num) ? null : num;
  }),
  actor: z
    .object({
      display_name: z.string().optional().default(''),
      avatar: z.string().nullable().optional(),
      username: z.string().optional().default(''),
    })
    .nullable()
    .optional(),
});

/**
 * Notifications response — accepts both simple array and paginated object.
 * The API may return { notifications: [...] } or { notifications: { data: [...] } }
 * depending on auth state and API version. Without auth it returns an error object.
 */
export const NotificationsResponseSchema = z.object({
  notifications: z
    .union([
      z.array(NotificationItemSchema),
      z.object({
        data: z.array(NotificationItemSchema).optional().default([]),
        total: z.number().optional(),
        per_page: z.number().optional(),
        current_page: z.number().optional(),
      }),
    ])
    .optional()
    .default([])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      return val.data ?? [];
    }),
  unread_count: z.number().optional().default(0),
});

export type NotificationItem = z.infer<typeof NotificationItemSchema>;
