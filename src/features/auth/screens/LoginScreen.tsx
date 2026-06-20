import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { AuthRepository } from '../../../data/repositories/AuthRepository';
import { useAuthStore } from '../hooks/useAuthStore';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);
  const { setAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const result = await AuthRepository.login(username, password);
      await SecureStore.setItemAsync('auto_login', autoLogin ? 'true' : 'false');
      setAuthenticated({
        email: result.user_email,
        displayName: result.user_display_name,
        nicename: result.user_nicename,
      });
      router.replace('/(tabs)/feed');
    } catch (error: any) {
      const msg = error.response?.data?.message || '로그인에 실패했습니다.';
      Alert.alert('로그인 실패', msg.replace(/<[^>]*>/g, ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Image source={require('../../../../assets/branding/dl-logo-full.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Doctor Lounge</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디 또는 이메일"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.autoLoginRow}
          onPress={() => setAutoLogin((prev) => !prev)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, autoLogin && styles.checkboxChecked]}>
            {autoLogin && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.autoLoginText}>자동 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>로그인</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/register-webview')} style={styles.registerLink}>
          <Text style={styles.registerText}>회원가입 (웹 페이지로 이동)</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 32, color: '#1a1a1a' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 12, backgroundColor: '#f9f9f9' },
  autoLoginRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  checkboxChecked: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700', lineHeight: 18 },
  autoLoginText: { fontSize: 14, color: '#555' },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { color: '#2563eb', fontSize: 14 },
});
