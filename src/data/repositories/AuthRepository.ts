import client from '../http/client';
import * as SecureStore from 'expo-secure-store';
import { LoginResponseSchema } from '../schemas/auth';

export const AuthRepository = {
  async login(username: string, password: string) {
    const { data } = await client.post('/jwt-auth/v1/token', { username, password });
    const parsed = LoginResponseSchema.parse(data);
    await SecureStore.setItemAsync('jwt_token', parsed.token);
    return parsed;
  },

  async validate() {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (!token) return false;
    try {
      await client.post('/jwt-auth/v1/token/validate');
      return true;
    } catch {
      await SecureStore.deleteItemAsync('jwt_token');
      return false;
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
  },
};
