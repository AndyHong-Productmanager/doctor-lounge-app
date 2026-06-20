import { z } from 'zod';

export const ChatParticipantSchema = z.object({
  user_id: z.number(),
  display_name: z.string(),
  avatar: z.string().nullable().optional(),
});

export const ChatLastMessageSchema = z.object({
  id: z.number().optional(),
  message: z.string().optional().default(''),
  created_at: z.string().optional().default(''),
  sender: ChatParticipantSchema.optional(),
});

export const ChatThreadSchema = z.object({
  id: z.number(),
  title: z.string().optional().default(''),
  type: z.enum(['direct', 'group']).optional().default('direct'),
  last_message: ChatLastMessageSchema.nullable().optional(),
  unread_count: z.number().optional().default(0),
  participants: z.array(ChatParticipantSchema).optional().default([]),
  updated_at: z.string().optional().default(''),
});

export const ChatThreadListResponseSchema = z.array(ChatThreadSchema);

export const ChatMessageSenderSchema = z.object({
  user_id: z.number(),
  display_name: z.string(),
  avatar: z.string().nullable().optional(),
});

export const ChatMessageSchema = z.object({
  id: z.number(),
  thread_id: z.number().optional(),
  message: z.string(),
  sender: ChatMessageSenderSchema.optional(),
  created_at: z.string(),
  reactions: z.array(z.unknown()).optional().default([]),
});

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
