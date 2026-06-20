import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';

export default function RegisterWebView() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '회원가입', headerBackTitle: '뒤로' }} />
      <WebView source={{ uri: 'https://doctorlounge.kr/portal/register' }} style={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
