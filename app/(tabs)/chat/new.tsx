import React from 'react';
import { Stack } from 'expo-router';
import NewChatScreen from '../../../src/features/chat/screens/NewChatScreen';

export default function NewChatRoute() {
  return (
    <>
      <Stack.Screen options={{ title: '새 대화', headerBackTitle: '뒤로' }} />
      <NewChatScreen />
    </>
  );
}
