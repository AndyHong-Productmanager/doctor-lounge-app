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
import { useFeeds } from '../hooks/useFeeds';
import { useToggleReaction, useToggleBookmark } from '../hooks/useFeedMutations';
import FeedCard from '../components/FeedCard';
import type { FeedItem } from '../../../data/schemas/feed';

export default function FeedListScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useFeeds();

  const toggleReaction = useToggleReaction();
  const toggleBookmark = useToggleBookmark();

  const feeds: FeedItem[] =
    data?.pages.flatMap((page) => page.feeds.data) ?? [];

  const handleReaction = useCallback(
    (feedId: number) => {
      toggleReaction.mutate(feedId);
    },
    [toggleReaction]
  );

  const handleBookmark = useCallback(
    (feedId: number) => {
      toggleBookmark.mutate(feedId);
    },
    [toggleBookmark]
  );

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => (
      <FeedCard
        item={item}
        onReact={() => handleReaction(item.id)}
        onBookmark={() => handleBookmark(item.id)}
      />
    ),
    [handleReaction, handleBookmark]
  );

  const keyExtractor = useCallback(
    (item: FeedItem) => String(item.id),
    []
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  }, [isFetchingNextPage]);

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
        <Text style={styles.errorText}>
          피드를 불러오지 못했습니다.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 게시글이 없습니다.</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/feed/compose')}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  errorText: { fontSize: 15, color: '#666', marginBottom: 12 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  loadingMore: { paddingVertical: 16 },
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
