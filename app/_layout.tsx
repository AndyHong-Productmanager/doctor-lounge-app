import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/features/auth/hooks/useAuthStore';
import { AuthRepository } from '../src/data/repositories/AuthRepository';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30000 },
  },
});

function AuthGate() {
  const { isLoading, setLoading, clearAuth } = useAuthStore();

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
