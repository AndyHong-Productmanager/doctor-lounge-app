import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Heart, Bookmark } from 'lucide-react-native';
import { useFeedDetail } from '../hooks/useFeedDetail';
import { useComments } from '../hooks/useComments';
import { useToggleReaction, useToggleBookmark, useAddComment } from '../hooks/useFeedMutations';
import HtmlContent from '../components/HtmlContent';
import CommentItemComponent from '../components/CommentItem';
import CommentInput from '../components/CommentInput';
import type { CommentItem, FeedItem } from '../../../data/schemas/feed';

function getMediaImages(item: FeedItem): string[] {
  const meta = item.meta as Record<string, unknown> | null | undefined;
  if (!meta && !item.featured_image) {
    return item.featured_image ? [item.featured_image] : [];
  }

  const images: string[] = [];

  if (meta) {
    const mediaItems = meta.media_items;
    if (Array.isArray(mediaItems)) {
      for (const mi of mediaItems) {
        if (
          mi &&
          typeof mi === 'object' &&
          'url' in mi &&
          typeof (mi as Record<string, unknown>).url === 'string'
        ) {
          images.push((mi as Record<string, unknown>).url as string);
        }
      }
    }

    const preview = meta.media_preview;
    if (preview && typeof preview === 'object' && 'image' in preview) {
      const previewImage = (preview as Record<string, unknown>).image;
      if (
        typeof previewImage === 'string' &&
        previewImage &&
        !images.includes(previewImage)
      ) {
        images.push(previewImage);
      }
    }
  }

  if (item.featured_image && !images.includes(item.featured_image)) {
    images.unshift(item.featured_image);
  }

  return images.map(url => {
    try { return encodeURI(decodeURI(url)); } catch { return encodeURI(url); }
  });
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const feedId = Number(id);

  const { data: feed, isLoading: feedLoading } = useFeedDetail(feedId);
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(feedId);
  const toggleReaction = useToggleReaction();
  const toggleBookmark = useToggleBookmark();
  const addComment = useAddComment();

  const comments: CommentItem[] =
    commentsData?.pages.flat() ?? [];

  const handleAddComment = useCallback(
    (message: string) => {
      addComment.mutate({ feedId, message });
    },
    [feedId, addComment]
  );

  if (feedLoading || !feed) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '게시글' }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const author = feed.xprofile;

  const renderHeader = () => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        {author?.avatar ? (
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {(author?.display_name ?? '?')[0]}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.authorName}>
            {author?.display_name ?? '알 수 없음'}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimeAgo(feed.created_at)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <HtmlContent html={feed.message_rendered} />
      </View>

      {(() => {
        const mediaImages = getMediaImages(feed);
        if (mediaImages.length === 0) return null;
        return (
          <View style={{ marginBottom: 16 }}>
            {mediaImages.map((url, idx) => (
              <Image
                key={idx}
                source={{ uri: url }}
                style={{ width: '100%', height: 300, borderRadius: 8, marginBottom: 4 }}
                resizeMode="cover"
              />
            ))}
          </View>
        );
      })()}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleReaction.mutate(feedId)}
        >
          <Heart
            size={20}
            color={feed.is_reacted ? '#ef4444' : '#9ca3af'}
            fill={feed.is_reacted ? '#ef4444' : 'none'}
          />
          <Text
            style={[
              styles.actionText,
              feed.is_reacted && styles.actionTextActive,
            ]}
          >
            {feed.reactions_count > 0
              ? `${feed.reactions_count}`
              : '좋아요'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { marginLeft: 'auto' }]}
          onPress={() => toggleBookmark.mutate(feedId)}
        >
          <Bookmark
            size={20}
            color={feed.is_bookmarked ? '#2563eb' : '#9ca3af'}
            fill={feed.is_bookmarked ? '#2563eb' : 'none'}
          />
          <Text style={styles.actionText}>
            {feed.is_bookmarked ? '저장됨' : '저장'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>
          댓글 {feed.comments_count > 0 ? `(${feed.comments_count})` : ''}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '게시글' }} />
      <FlatList
        data={comments}
        renderItem={({ item }) => <CommentItemComponent comment={item} />}
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
          <View style={styles.emptyComments}>
            <Text style={styles.emptyText}>아직 댓글이 없습니다.</Text>
          </View>
        }
      />
      <CommentInput
        onSubmit={handleAddComment}
        loading={addComment.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  postContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: 18, fontWeight: '600', color: '#6b7280' },
  headerText: { marginLeft: 12, flex: 1 },
  authorName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  timestamp: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  content: { marginBottom: 16 },
  actions: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionText: { fontSize: 14, color: '#9ca3af' },
  actionTextActive: { color: '#ef4444' },
  commentsHeader: {
    paddingVertical: 12,
  },
  commentsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  loadingMore: { paddingVertical: 16 },
  emptyComments: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});
