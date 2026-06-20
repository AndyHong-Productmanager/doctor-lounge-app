import client from '../http/client';
import { FLUENT_API } from '../../config/api';
import { NotificationsResponseSchema } from '../schemas/notification';

const BASE = FLUENT_API;

export const NotificationRepository = {
  async getNotifications(page: number = 1) {
    const { data } = await client.get(`${BASE}/notifications`, {
      params: { page },
    });
    const parsed = NotificationsResponseSchema.parse(data);
    return parsed;
  },

  async markAllRead() {
    const { data } = await client.post(`${BASE}/notifications/mark-all-read`);
    return data as { success: boolean };
  },
};
