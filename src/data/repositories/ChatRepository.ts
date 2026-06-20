import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import {
  ChatThreadSchema,
  ChatThreadListResponseSchema,
  ChatMessageSchema,
  ChatMessageListResponseSchema,
  ChatUserListResponseSchema,
  type ChatThread,
  type ChatMessage,
  type ChatMessageListResponse,
  type ChatUser,
} from '../schemas/chat';

const BASE = FLUENT_API;

export const ChatRepository = {
  // ── Threads ──

  async getThreads(): Promise<ChatThread[]> {
    const { data } = await client.get(`${BASE}/chat/threads`);
    const list = Array.isArray(data) ? data : data.threads ?? data.data ?? [];
    try {
      return ChatThreadListResponseSchema.parse(list);
    } catch {
      return Array.isArray(list) ? list : [];
    }
  },

  async getThread(threadId: number): Promise<ChatThread> {
    const { data } = await client.get(`${BASE}/chat/threads/${threadId}`);
    const thread = data.thread ?? data;
    return ChatThreadSchema.parse(thread);
  },

  async createThread(userId: number): Promise<ChatThread> {
    const { data } = await client.post(`${BASE}/chat/threads`, {
      user_id: userId,
    });
    const thread = data.thread ?? data;
    return ChatThreadSchema.parse(thread);
  },

  async getUnreadThreads(): Promise<number[]> {
    const { data } = await client.get(`${BASE}/chat/unread_threads`);
    const ids: number[] = Array.isArray(data) ? data : data.thread_ids ?? [];
    return ids;
  },

  async markThreadRead(threadId: number): Promise<void> {
    await client.post(`${BASE}/chat/read-threads`, {
      thread_id: threadId,
    });
  },

  // ── Messages ──

  async getMessages(
    threadId: number,
    page: number = 1,
    perPage: number = 20,
  ): Promise<ChatMessageListResponse> {
    const { data } = await client.get(`${BASE}/chat/messages/${threadId}`, {
      params: { page, per_page: perPage },
    });
    try {
      return ChatMessageListResponseSchema.parse(data);
    } catch {
      const msgs = data.messages ?? data.data ?? (Array.isArray(data) ? data : []);
      return { messages: Array.isArray(msgs) ? msgs : [] };
    }
  },

  async getNewMessages(
    threadId: number,
    afterId: number,
  ): Promise<ChatMessage[]> {
    const { data } = await client.get(
      `${BASE}/chat/messages/${threadId}/new`,
      { params: { after_id: afterId } },
    );
    const list = Array.isArray(data) ? data : data.messages ?? [];
    return list.map((m: unknown) => ChatMessageSchema.parse(m));
  },

  async sendMessage(
    threadId: number,
    message: string,
  ): Promise<ChatMessage> {
    const { data } = await client.post(`${BASE}/chat/messages/${threadId}`, {
      message,
    });
    const msg = data.message ?? data;
    return ChatMessageSchema.parse(msg);
  },

  async deleteMessage(messageId: number): Promise<void> {
    await client.post(`${BASE}/chat/messages/delete/${messageId}`);
  },

  async toggleReaction(messageId: number): Promise<void> {
    await client.post(`${BASE}/chat/messages/${messageId}/react`);
  },

  // ── Groups ──

  async createGroup(
    title: string,
    memberIds: number[],
  ): Promise<ChatThread> {
    const { data } = await client.post(`${BASE}/chat/groups`, {
      title,
      member_ids: memberIds,
    });
    const thread = data.thread ?? data;
    return ChatThreadSchema.parse(thread);
  },

  async updateGroup(
    threadId: number,
    payload: { title?: string },
  ): Promise<void> {
    await client.post(`${BASE}/chat/groups/${threadId}`, payload);
  },

  async getGroupMembers(threadId: number): Promise<ChatUser[]> {
    const { data } = await client.get(
      `${BASE}/chat/groups/${threadId}/members`,
    );
    const list = Array.isArray(data) ? data : data.members ?? [];
    return ChatUserListResponseSchema.parse(list);
  },

  async addGroupMembers(
    threadId: number,
    memberIds: number[],
  ): Promise<void> {
    await client.post(`${BASE}/chat/groups/${threadId}/members`, {
      member_ids: memberIds,
    });
  },

  async leaveGroup(threadId: number): Promise<void> {
    await client.post(`${BASE}/chat/groups/${threadId}/leave`);
  },

  // ── Users ──

  async searchUsers(search: string = ''): Promise<ChatUser[]> {
    const { data } = await client.get(`${BASE}/chat/users`, {
      params: { search },
    });
    const list = Array.isArray(data) ? data : data.users ?? [];
    return ChatUserListResponseSchema.parse(list);
  },
};
