import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Users } from 'lucide-react-native';
import { useSpaceDetail } from '../hooks/useSpaces';
import { useFeeds } from '../../feed/hooks/useFeeds';
import { useToggleReaction } from '../../feed/hooks/useFeedMutations';
import FeedCard from '../../feed/components/FeedCard';
import type { FeedItem } from '../../../data/schemas/feed';

export default function SpaceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: space, isLoading: spaceLoading } = useSpaceDetail(slug ?? '');
  const {
    data: feedsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: feedsLoading,
    refetch,
    isRefetching,
  } = useFeeds(slug ? { space: slug } : {});

  const toggleReaction = useToggleReaction();

  const feeds: FeedItem[] =
    feedsData?.pages.flatMap((page) => page.feeds.data) ?? [];

  const handleReaction = useCallback(
    (feedId: number) => {
      toggleReaction.mutate(feedId);
    },
    [toggleReaction]
  );

  if (spaceLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '스페이스' }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const renderHeader = () => {
    if (!space) return null;
    return (
      <View style={styles.spaceHeader}>
        {space.cover_photo && (
          <Image
            source={{ uri: space.cover_photo }}
            style={styles.coverPhoto}
          />
        )}
        <View style={styles.spaceInfo}>
          {space.logo ? (
            <Image source={{ uri: space.logo }} style={styles.spaceLogo} />
          ) : (
            <View style={[styles.spaceLogo, styles.logoPlaceholder]}>
              <Users size={28} color="#9ca3af" />
            </View>
          )}
          <Text style={styles.spaceTitle}>{space.title}</Text>
          {space.description ? (
            <Text style={styles.spaceDesc}>{space.description}</Text>
          ) : null}
          <Text style={styles.memberCount}>
            {space.members_count}명 참여
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: space?.title ?? '스페이스' }} />
      <FlatList
        data={feeds}
        renderItem={({ item }: { item: FeedItem }) => (
          <FeedCard item={item} onReact={() => handleReaction(item.id)} />
        )}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          feedsLoading ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>아직 게시글이 없습니다.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  spaceHeader: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  coverPhoto: {
    width: '100%',
    height: 140,
  },
  spaceInfo: {
    padding: 16,
    alignItems: 'center',
  },
  spaceLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 12,
  },
  logoPlaceholder: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  spaceDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  memberCount: {
    fontSize: 13,
    color: '#9ca3af',
  },
  empty: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  loadingMore: { paddingVertical: 16, alignItems: 'center' },
});
