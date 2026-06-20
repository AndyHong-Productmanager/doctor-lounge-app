import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Heart, MessageCircle, Bookmark } from 'lucide-react-native';
import type { FeedItem } from '../../../data/schemas/feed';
import HtmlContent from './HtmlContent';

function getMediaImages(item: FeedItem): string[] {
  const meta = item.meta as Record<string, unknown> | null | undefined;
  if (!meta && !item.featured_image) {
    return item.featured_image ? [item.featured_image] : [];
  }

  const images: string[] = [];

  // Check meta.media_items (FluentCommunity stores images here)
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

    // Check meta.media_preview
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

  // Also check featured_image as fallback
  if (item.featured_image && !images.includes(item.featured_image)) {
    images.unshift(item.featured_image);
  }

  return images;
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

interface FeedCardProps {
  item: FeedItem;
  onPress?: () => void;
  onReact?: () => void;
  onBookmark?: () => void;
}

export default function FeedCard({ item, onPress, onReact, onBookmark }: FeedCardProps) {
  const author = item.xprofile;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress ?? (() => router.push(`/(tabs)/feed/${item.id}`))}
    >
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
          <Text style={styles.timestamp}>{formatTimeAgo(item.created_at)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <HtmlContent html={item.message_rendered} />
      </View>

      {(() => {
        const mediaImages = getMediaImages(item);
        if (mediaImages.length === 0) return null;
        if (mediaImages.length === 1) {
          return (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: mediaImages[0] }}
                style={styles.singleImage}
                resizeMode="cover"
              />
            </View>
          );
        }
        return (
          <View style={styles.mediaContainer}>
            <View style={styles.imageGrid}>
              {mediaImages.slice(0, 4).map((url, idx) => (
                <Image
                  key={idx}
                  source={{ uri: url }}
                  style={[
                    styles.gridImage,
                    mediaImages.length === 2 && { width: '49%' },
                    mediaImages.length === 3 && idx === 0 && { width: '100%', height: 200 },
                    mediaImages.length >= 4 && { width: '49%' },
                  ]}
                  resizeMode="cover"
                />
              ))}
              {mediaImages.length > 4 ? (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{mediaImages.length - 4}</Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={(e) => {
            e.stopPropagation();
            onReact?.();
          }}
        >
          <Heart
            size={18}
            color={item.is_reacted ? '#ef4444' : '#9ca3af'}
            fill={item.is_reacted ? '#ef4444' : 'none'}
          />
          <Text
            style={[
              styles.actionText,
              item.is_reacted && styles.actionTextActive,
            ]}
          >
            {item.reactions_count > 0 ? item.reactions_count : ''}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionBtn}>
          <MessageCircle size={18} color="#9ca3af" />
          <Text style={styles.actionText}>
            {item.comments_count > 0 ? item.comments_count : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { marginLeft: 'auto' }]}
          onPress={(e) => {
            e.stopPropagation();
            onBookmark?.();
          }}
        >
          <Bookmark
            size={18}
            color={item.is_bookmarked ? '#2563eb' : '#9ca3af'}
            fill={item.is_bookmarked ? '#2563eb' : 'none'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  content: {
    marginBottom: 10,
  },
  mediaContainer: {
    marginBottom: 10,
  },
  singleImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '48%',
    height: 150,
    borderRadius: 4,
  },
  moreOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '49%',
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  moreText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  actionTextActive: {
    color: '#ef4444',
  },
});
