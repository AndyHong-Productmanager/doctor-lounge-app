import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: '게시글', headerBackTitle: '뒤로' }} />
      <Stack.Screen name="compose" options={{ title: '새 글 작성', headerBackTitle: '뒤로' }} />
    </Stack>
  );
}
