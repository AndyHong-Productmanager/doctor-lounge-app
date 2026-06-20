import { Stack } from 'expo-router';

export default function SpacesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[slug]" options={{ title: '스페이스', headerBackTitle: '뒤로' }} />
      <Stack.Screen name="feed/[id]" options={{ title: '게시글', headerBackTitle: '뒤로' }} />
    </Stack>
  );
}
