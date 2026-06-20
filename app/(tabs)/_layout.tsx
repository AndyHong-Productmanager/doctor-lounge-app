import React from 'react';
import { Tabs } from 'expo-router';
import { MessageSquare, Bell, User, Layout, Users } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb', headerShown: false }}>
      <Tabs.Screen name="feed" options={{ title: '피드', tabBarIcon: ({ color, size }) => <Layout size={size} color={color} /> }} />
      <Tabs.Screen name="spaces" options={{ title: '스페이스', tabBarIcon: ({ color, size }) => <Users size={size} color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: '채팅', headerShown: true, tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} /> }} />
      <Tabs.Screen name="notifications" options={{ title: '알림', headerShown: true, tabBarIcon: ({ color, size }) => <Bell size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: '프로필', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tabs>
  );
}
