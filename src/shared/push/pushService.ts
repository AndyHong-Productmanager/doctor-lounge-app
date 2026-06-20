import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import client from '../../data/http/client';
import { DL_APP_API } from '../../config/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '기본 알림',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.setNotificationChannelAsync('chat', {
      name: '채팅',
      importance: Notifications.AndroidImportance.HIGH,
    });
    await Notifications.setNotificationChannelAsync('community', {
      name: '커뮤니티',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const deviceToken = await Notifications.getDevicePushTokenAsync();
  return deviceToken.data as string;
}

export async function registerDeviceToken(token: string): Promise<void> {
  try {
    await client.post(`${DL_APP_API}/device-token`, {
      token,
      platform: 'android',
    });
  } catch (e) {
    console.warn('Failed to register device token:', e);
  }
}

export async function unregisterDeviceToken(token: string): Promise<void> {
  try {
    await client.delete(`${DL_APP_API}/device-token`, {
      data: { token },
    });
  } catch (e) {
    console.warn('Failed to unregister device token:', e);
  }
}
