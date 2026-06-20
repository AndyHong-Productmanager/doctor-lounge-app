import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useCreateFeed } from '../hooks/useFeedMutations';
import { useSpaces } from '../../spaces/hooks/useSpaces';
import type { SpaceItem } from '../../../data/schemas/space';

export default function FeedComposeScreen() {
  const [message, setMessage] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | undefined>(
    undefined
  );
  const createFeed = useCreateFeed();
  const { data: spaces } = useSpaces();

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }
    try {
      await createFeed.mutateAsync({
        message: trimmed,
        space_id: selectedSpaceId,
      });
      router.back();
    } catch {
      Alert.alert('오류', '게시글 작성에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '새 게시글',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createFeed.isPending || !message.trim()}
            >
              {createFeed.isPending ? (
                <ActivityIndicator size="small" color="#2563eb" />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    !message.trim() && styles.submitTextDisabled,
                  ]}
                >
                  게시
                </Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      {spaces && spaces.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.spacePicker}
          contentContainerStyle={styles.spacePickerContent}
        >
          <TouchableOpacity
            style={[
              styles.spaceChip,
              selectedSpaceId === undefined && styles.spaceChipActive,
            ]}
            onPress={() => setSelectedSpaceId(undefined)}
          >
            <Text
              style={[
                styles.spaceChipText,
                selectedSpaceId === undefined && styles.spaceChipTextActive,
              ]}
            >
              전체
            </Text>
          </TouchableOpacity>
          {spaces.map((space: SpaceItem) => (
            <TouchableOpacity
              key={space.id}
              style={[
                styles.spaceChip,
                selectedSpaceId === space.id && styles.spaceChipActive,
              ]}
              onPress={() => setSelectedSpaceId(space.id)}
            >
              <Text
                style={[
                  styles.spaceChipText,
                  selectedSpaceId === space.id && styles.spaceChipTextActive,
                ]}
              >
                {space.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TextInput
        style={styles.textInput}
        placeholder="무슨 이야기를 나누고 싶으신가요?"
        value={message}
        onChangeText={setMessage}
        multiline
        textAlignVertical="top"
        autoFocus
        maxLength={10000}
        editable={!createFeed.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  submitText: { fontSize: 16, fontWeight: '600', color: '#2563eb' },
  submitTextDisabled: { color: '#93c5fd' },
  spacePicker: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    maxHeight: 52,
  },
  spacePickerContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  spaceChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  spaceChipActive: {
    backgroundColor: '#2563eb',
  },
  spaceChipText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  spaceChipTextActive: {
    color: '#fff',
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#1a1a1a',
  },
});
