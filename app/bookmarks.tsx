import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FeedRepository } from '../src/data/repositories/FeedRepository';
import { useToggleReaction, useToggleBookmark } from '../src/features/feed/hooks/useFeedMutations';
import FeedCard from '../src/features/feed/components/FeedCard';
import type { FeedItem } from '../src/data/schemas/feed';

export default function BookmarksScreen() {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => FeedRepository.getBookmarks(),
  });

  const toggleReaction = useToggleReaction();
  const toggleBookmark = useToggleBookmark();

  const feeds: FeedItem[] = data?.feeds.data ?? [];

  const handleReaction = useCallback(
    (feedId: number) => {
      toggleReaction.mutate(feedId);
    },
    [toggleReaction]
  );

  const handleBookmark = useCallback(
    (feedId: number) => {
      toggleBookmark.mutate(feedId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        },
      });
    },
    [toggleBookmark, queryClient]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '북마크' }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '북마크' }} />
        <Text style={styles.errorText}>북마크를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '북마크' }} />
      <FlatList
        data={feeds}
        renderItem={({ item }: { item: FeedItem }) => (
          <FeedCard
            item={item}
            onReact={() => handleReaction(item.id)}
            onBookmark={() => handleBookmark(item.id)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>저장한 게시글이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  errorText: { fontSize: 15, color: '#666' },
});
