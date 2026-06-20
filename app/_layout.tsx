import React, { useEffect, useRef } from 'react';
import { Slot, router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import type { EventSubscription } from 'expo-modules-core';
import { useAuthStore } from '../src/features/auth/hooks/useAuthStore';
import { AuthRepository } from '../src/data/repositories/AuthRepository';
import {
  registerForPushNotifications,
  registerDeviceToken,
} from '../src/shared/push/pushService';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30000 },
  },
});

function AuthGate() {
  const { isAuthenticated, isLoading, setLoading, setDeviceToken, clearAuth } = useAuthStore();
  const deviceTokenRef = useRef<string | null>(null);
  const notificationResponseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const valid = await AuthRepository.validate();
      if (!valid) {
        clearAuth();
      }
      setLoading(false);
    })();
  }, []);

  // Register push notifications after auth validation succeeds
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    (async () => {
      try {
        const token = await registerForPushNotifications();
        if (token) {
          deviceTokenRef.current = token;
          setDeviceToken(token);
          await registerDeviceToken(token);
        }
      } catch (e) {
        console.warn('Push notification registration failed:', e);
      }
    })();

    // Listen for notification taps
    notificationResponseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<string, unknown> | undefined;
        if (!data) return;

        const type = data.type as string | undefined;
        if (type === 'comment' || type === 'mention') {
          const feedId = data.feed_id as string | number | undefined;
          if (feedId) {
            router.push(`/feed/${feedId}`);
          }
        } else if (type === 'chat') {
          const threadId = data.thread_id as string | number | undefined;
          if (threadId) {
            router.push(`/chat/${threadId}`);
          }
        }
      });

    return () => {
      if (notificationResponseListener.current) {
        notificationResponseListener.current.remove();
      }
    };
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
