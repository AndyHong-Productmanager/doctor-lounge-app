import client from '../http/client';
import * as SecureStore from 'expo-secure-store';
import { LoginResponseSchema } from '../schemas/auth';

export const AuthRepository = {
  async login(username: string, password: string) {
    const { data } = await client.post('/jwt-auth/v1/token', { username, password });
    const parsed = LoginResponseSchema.parse(data);
    await SecureStore.setItemAsync('jwt_token', parsed.token);
    await SecureStore.setItemAsync('user_info', JSON.stringify({
      email: parsed.user_email,
      displayName: parsed.user_display_name,
      nicename: parsed.user_nicename,
    }));
    return parsed;
  },

  async validate(): Promise<{ email: string; displayName: string; nicename: string } | null> {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (!token) return null;
    try {
      await client.post('/jwt-auth/v1/token/validate');
      const userStr = await SecureStore.getItemAsync('user_info');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      await SecureStore.deleteItemAsync('jwt_token');
      await SecureStore.deleteItemAsync('user_info');
      return null;
    }
  },

  async logout(deviceToken?: string | null) {
    if (deviceToken) {
      try {
        await client.delete('/dl-app/v1/device-token', {
          data: { token: deviceToken },
        });
      } catch {
        // Ignore device token unregister errors
      }
    }
    await SecureStore.deleteItemAsync('jwt_token');
    await SecureStore.deleteItemAsync('user_info');
  },
};
