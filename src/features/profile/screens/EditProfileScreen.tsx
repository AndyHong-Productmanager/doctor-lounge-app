import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { useAuthStore } from '../../auth/hooks/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { ProfileRepository } from '../../../data/repositories/ProfileRepository';
import { useQueryClient } from '@tanstack/react-query';

export default function EditProfileScreen() {
  const { user } = useAuthStore();
  const username = user?.nicename ?? '';
  const { data: profile, isLoading } = useProfile(username);
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setShortDescription(profile.short_description ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      await ProfileRepository.updateProfile(username, {
        display_name: displayName.trim(),
        short_description: shortDescription.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      Alert.alert('완료', '프로필이 수정되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('오류', '프로필 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '프로필 수정' }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: '프로필 수정', headerBackTitle: '뒤로' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Camera size={32} color="#9ca3af" />
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="이름을 입력하세요"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>한줄 소개</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={shortDescription}
            onChangeText={setShortDescription}
            placeholder="자기소개를 입력하세요"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>저장</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
