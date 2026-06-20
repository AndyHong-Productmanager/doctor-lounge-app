import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/features/auth/hooks/useAuthStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/feed" />;
  }
  return <Redirect href="/(auth)/login" />;
}
