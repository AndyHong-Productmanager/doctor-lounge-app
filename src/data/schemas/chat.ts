import { z } from 'zod';

export const ChatParticipantSchema = z.object({
  user_id: z.union([z.string(), z.number()]).transform(v => Number(v)),
  display_name: z.string().optional().default(''),
  avatar: z.string().nullable().optional(),
}).passthrough();

export const ChatLastMessageSchema = z.object({
  id: z.number().optional(),
  message: z.string().optional().default(''),
  message_rendered: z.string().optional().default(''),
  created_at: z.string().optional().default(''),
  sender: ChatParticipantSchema.optional(),
}).passthrough();

export const ChatThreadSchema = z.object({
  id: z.number(),
  title: z.string().optional().default(''),
  type: z.string().optional().default('direct'),
  last_message: ChatLastMessageSchema.nullable().optional(),
  unread_count: z.union([z.string(), z.number()]).optional().default(0).transform(v => Number(v)),
  participants: z.array(ChatParticipantSchema).optional().default([]),
  updated_at: z.string().optional().default(''),
}).passthrough();

export const ChatThreadListResponseSchema = z.array(ChatThreadSchema);

export const ChatMessageSenderSchema = z.object({
  user_id: z.union([z.string(), z.number()]).transform(v => Number(v)),
  display_name: z.string().optional().default(''),
  avatar: z.string().nullable().optional(),
}).passthrough();

export const ChatMessageSchema = z.object({
  id: z.number(),
  thread_id: z.union([z.string(), z.number()]).optional().transform(v => v ? Number(v) : undefined),
  message: z.string().optional().default(''),
  message_rendered: z.string().optional().default(''),
  sender: ChatMessageSenderSchema.optional(),
  created_at: z.string().optional().default(''),
  reactions: z.array(z.unknown()).optional().default([]),
}).passthrough();

export const ChatMessageListResponseSchema = z.object({
  messages: z.array(ChatMessageSchema).optional().default([]),
  pagination: z
    .object({
      total: z.number().optional(),
      page: z.number().optional(),
    })
    .optional(),
});

export const ChatUserSchema = z.object({
  id: z.number(),
  display_name: z.string(),
  avatar: z.string().nullable().optional(),
  username: z.string().optional().default(''),
});

export const ChatUserListResponseSchema = z.array(ChatUserSchema);

export type ChatParticipant = z.infer<typeof ChatParticipantSchema>;
export type ChatLastMessage = z.infer<typeof ChatLastMessageSchema>;
export type ChatThread = z.infer<typeof ChatThreadSchema>;
export type ChatMessageSender = z.infer<typeof ChatMessageSenderSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatMessageListResponse = z.infer<typeof ChatMessageListResponseSchema>;
export type ChatUser = z.infer<typeof ChatUserSchema>;
