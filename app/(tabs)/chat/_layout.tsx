import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[threadId]" options={{ title: '채팅', headerBackTitle: '뒤로' }} />
      <Stack.Screen name="new" options={{ title: '새 대화', headerBackTitle: '뒤로' }} />
    </Stack>
  );
}
