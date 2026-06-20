import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import {
  FeedListResponseSchema,
  FeedItemSchema,
  CommentItemSchema,
  CommentsResponseSchema,
  type FeedItem,
  type CommentItem,
} from '../schemas/feed';

const BASE = FLUENT_API;

export interface FeedListParams {
  space_id?: number;
  page?: number;
  per_page?: number;
  search?: string;
}

export const FeedRepository = {
  async getFeeds(params: FeedListParams = {}) {
    const { data } = await client.get(`${BASE}/feeds`, { params });
    const parsed = FeedListResponseSchema.parse(data);
    return parsed;
  },

  async getFeedById(id: number): Promise<FeedItem> {
    const { data } = await client.get(`${BASE}/feeds/${id}/by-id`);
    const post = data.feed ?? data.post ?? data;
    return FeedItemSchema.parse(post);
  },

  async getFeedBySlug(slug: string): Promise<FeedItem> {
    const { data } = await client.get(`${BASE}/feeds/${slug}/by-slug`);
    const post = data.feed ?? data.post ?? data;
    return FeedItemSchema.parse(post);
  },

  async createFeed(payload: { message: string; space_id?: number }) {
    const { data } = await client.post(`${BASE}/feeds`, payload);
    const post = data.feed ?? data.post ?? data;
    return FeedItemSchema.parse(post);
  },

  async deleteFeed(id: number) {
    await client.delete(`${BASE}/feeds/${id}`);
  },

  async toggleReaction(feedId: number) {
    const { data } = await client.post(`${BASE}/feeds/${feedId}/react`);
    return data as { reactions_count: number };
  },

  async getComments(feedId: number, page: number = 1) {
    const { data } = await client.get(`${BASE}/feeds/${feedId}/comments`, {
      params: { page },
    });
    // Handle various response shapes
    if (Array.isArray(data)) {
      return data.map((c: unknown) => CommentItemSchema.parse(c));
    }
    const comments = data.comments ?? data.data ?? [];
    if (Array.isArray(comments)) {
      return comments.map((c: unknown) => CommentItemSchema.parse(c));
    }
    const parsed = CommentsResponseSchema.parse(data);
    return parsed.comments;
  },

  async addComment(feedId: number, message: string): Promise<CommentItem> {
    const { data } = await client.post(`${BASE}/feeds/${feedId}/comments`, {
      message,
    });
    const comment = data.comment ?? data;
    return comment as CommentItem;
  },

  async getBookmarks() {
    const { data } = await client.get(`${BASE}/feeds/bookmarks`);
    // Bookmarks endpoint may return same structure as feeds
    const parsed = FeedListResponseSchema.parse(data);
    return parsed;
  },

  async toggleBookmark(feedId: number) {
    const { data } = await client.post(`${BASE}/feeds/${feedId}/bookmark`);
    return data as { is_bookmarked: boolean };
  },

  async uploadMedia(formData: FormData) {
    const { data } = await client.post(`${BASE}/feeds/media-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data as { media_id: number; url: string };
  },
};
