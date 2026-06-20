import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { CommentItem as CommentItemType } from '../../../data/schemas/feed';
import HtmlContent from './HtmlContent';

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

interface CommentItemProps {
  comment: CommentItemType;
}

export default function CommentItemComponent({ comment }: CommentItemProps) {
  const author = comment.xprofile;

  return (
    <View style={styles.container}>
      {author?.avatar ? (
        <Image source={{ uri: author.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>
            {(author?.display_name ?? '?')[0]}
          </Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.authorName}>
            {author?.display_name ?? '알 수 없음'}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimeAgo(comment.created_at)}
          </Text>
        </View>
        <HtmlContent
          html={comment.message_rendered || comment.message}
          baseStyle={{ fontSize: 14, lineHeight: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  body: {
    flex: 1,
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
