import React from 'react';
import { Stack } from 'expo-router';
import ChatScreen from '../../../src/features/chat/screens/ChatScreen';

export default function ChatThreadRoute() {
  return (
    <>
      <Stack.Screen options={{ title: '채팅', headerBackTitle: '뒤로' }} />
      <ChatScreen />
    </>
  );
}
