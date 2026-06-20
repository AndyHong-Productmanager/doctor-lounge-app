import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useProfile } from '../hooks/useProfile';
import { useFeeds } from '../../feed/hooks/useFeeds';
import { useToggleReaction } from '../../feed/hooks/useFeedMutations';
import FeedCard from '../../feed/components/FeedCard';
import type { FeedItem } from '../../../data/schemas/feed';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { data: profile, isLoading } = useProfile(username ?? '');
  const {
    data: feedsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeeds({ search: username });

  const toggleReaction = useToggleReaction();

  const feeds: FeedItem[] =
    feedsData?.pages.flatMap((page) => page.posts) ?? [];

  const handleReaction = useCallback(
    (feedId: number) => {
      toggleReaction.mutate(feedId);
    },
    [toggleReaction]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '프로필' }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const renderHeader = () => {
    if (!profile) return null;
    return (
      <View style={styles.profileHeader}>
        {profile.cover_photo && (
          <Image
            source={{ uri: profile.cover_photo }}
            style={styles.coverPhoto}
          />
        )}
        <View style={styles.profileInfo}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {(profile.display_name ?? '?')[0]}
              </Text>
            </View>
          )}
          <Text style={styles.displayName}>{profile.display_name}</Text>
          {profile.bio ? (
            <Text style={styles.bio}>{profile.bio}</Text>
          ) : null}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>
                {profile.counts?.posts ?? 0}
              </Text>
              <Text style={styles.statLabel}>게시글</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statCount}>
                {profile.counts?.comments ?? 0}
              </Text>
              <Text style={styles.statLabel}>댓글</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statCount}>
                {profile.counts?.spaces ?? 0}
              </Text>
              <Text style={styles.statLabel}>스페이스</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: profile?.display_name ?? username ?? '프로필' }}
      />
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
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>게시글이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  profileHeader: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  coverPhoto: {
    width: '100%',
    height: 140,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6b7280',
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  bio: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e5e7eb',
  },
  empty: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  loadingMore: { paddingVertical: 16, alignItems: 'center' },
});
