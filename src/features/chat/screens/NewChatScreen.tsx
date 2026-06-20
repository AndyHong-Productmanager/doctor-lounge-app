import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { ChatRepository } from '../../../data/repositories/ChatRepository';
import { useCreateThread } from '../hooks/useChatMutations';
import type { ChatUser } from '../../../data/schemas/chat';

export default function NewChatScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(text.trim());
    }, 400);
  }, []);

  const { data: users, isLoading } = useQuery({
    queryKey: ['chatUsers', debouncedSearch],
    queryFn: () => ChatRepository.searchUsers(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const createThread = useCreateThread();

  const handleUserPress = useCallback(
    (user: ChatUser) => {
      createThread.mutate(user.id, {
        onSuccess: (thread) => {
          router.replace(`/chat/${thread.id}`);
        },
      });
    },
    [createThread],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatUser }) => (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleUserPress(item)}
        disabled={createThread.isPending}
      >
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.display_name.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.display_name}</Text>
          {item.username ? (
            <Text style={styles.userHandle}>@{item.username}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    ),
    [handleUserPress, createThread.isPending],
  );

  const keyExtractor = useCallback(
    (item: ChatUser) => String(item.id),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="이름 또는 닉네임으로 검색"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={handleSearchChange}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {createThread.isPending && (
        <View style={styles.creatingOverlay}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.creatingText}>채팅방 생성 중...</Text>
        </View>
      )}

      {isLoading && debouncedSearch.length > 0 && (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#2563eb" />
        </View>
      )}

      <FlatList
        data={users ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          debouncedSearch.length > 0 && !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          ) : debouncedSearch.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                대화할 상대를 검색해 주세요.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    fontSize: 15,
    color: '#111827',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  userHandle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  center: { paddingVertical: 20, alignItems: 'center' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  creatingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
  },
  creatingText: {
    fontSize: 13,
    color: '#2563eb',
    marginLeft: 8,
  },
});
