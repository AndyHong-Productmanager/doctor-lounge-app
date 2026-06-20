import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useThreads } from '../hooks/useThreads';
import ThreadItem from '../components/ThreadItem';
import type { ChatThread } from '../../../data/schemas/chat';

export default function ChatListScreen() {
  const { data: threads, isLoading, isError, refetch, isRefetching } =
    useThreads();

  const sorted = React.useMemo(() => {
    if (!threads) return [];
    return [...threads].sort((a, b) => {
      const tA = a.last_message?.created_at || a.updated_at || '';
      const tB = b.last_message?.created_at || b.updated_at || '';
      return tB.localeCompare(tA);
    });
  }, [threads]);

  const renderItem = useCallback(
    ({ item }: { item: ChatThread }) => (
      <ThreadItem
        thread={item}
        onPress={() => router.push(`/(tabs)/chat/${item.id}`)}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: ChatThread) => String(item.id),
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>채팅 목록을 불러오지 못했습니다.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 채팅이 없습니다.</Text>
            <Text style={styles.emptySubtext}>
              새로운 대화를 시작해 보세요.
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/chat/new')}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  emptySubtext: { fontSize: 13, color: '#d1d5db', marginTop: 4 },
  errorText: { fontSize: 15, color: '#666', marginBottom: 12 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
