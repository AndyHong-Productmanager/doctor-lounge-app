import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import { NotificationsResponseSchema, type NotificationItem } from '../schemas/notification';

const BASE = FLUENT_API;

export const NotificationRepository = {
  async getNotifications(page: number = 1): Promise<{
    notifications: NotificationItem[];
    unread_count: number;
  }> {
    const { data } = await client.get(`${BASE}/notifications`, {
      params: { page },
    });
    // If API returns an error object (e.g. no auth), return empty
    if (data?.code === 'plugin_exception' || data?.code === 'rest_forbidden') {
      return { notifications: [], unread_count: 0 };
    }
    const parsed = NotificationsResponseSchema.parse(data);
    return parsed;
  },

  async markAllRead() {
    const { data } = await client.post(`${BASE}/notifications/mark-all-read`);
    return data as { success: boolean };
  },
};
