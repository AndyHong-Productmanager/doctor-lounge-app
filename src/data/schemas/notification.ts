import { z } from 'zod';

export const NotificationItemSchema = z.object({
  id: z.number(),
  title: z.string().optional().default(''),
  content: z.string().optional().default(''),
  type: z.string().optional().default('general'),
  is_read: z.boolean().optional().default(false),
  created_at: z.string().optional().default(''),
  route: z.string().nullable().optional(),
  actor: z
    .object({
      display_name: z.string().optional(),
      avatar: z.string().nullable().optional(),
    })
    .optional(),
});

export const NotificationsResponseSchema = z.object({
  notifications: z.array(NotificationItemSchema),
  unread_count: z.number().optional().default(0),
});

export type NotificationItem = z.infer<typeof NotificationItemSchema>;
