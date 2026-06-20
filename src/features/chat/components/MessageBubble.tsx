import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { ChatMessage } from '../../../data/schemas/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  onLongPress?: () => void;
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h < 12 ? '오전' : '오후';
  const hour12 = h % 12 || 12;
  return `${ampm} ${hour12}:${m}`;
}

export default function MessageBubble({
  message,
  isMine,
  onLongPress,
}: MessageBubbleProps) {
  const senderName = message.sender?.display_name ?? '';
  const senderAvatar = message.sender?.avatar;

  return (
    <View
      style={[
        styles.row,
        isMine ? styles.rowRight : styles.rowLeft,
      ]}
    >
      {!isMine && (
        <View style={styles.avatarCol}>
          {senderAvatar ? (
            <Image source={{ uri: senderAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {senderName.charAt(0)}
              </Text>
            </View>
          )}
        </View>
      )}
      <View
        style={[
          styles.bubbleWrapper,
          isMine ? styles.bubbleWrapperRight : styles.bubbleWrapperLeft,
        ]}
      >
        {!isMine && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine ? styles.messageTextMine : styles.messageTextOther,
            ]}
            onLongPress={onLongPress}
          >
            {message.message_rendered || message.message}
          </Text>
        </View>
        <Text
          style={[
            styles.time,
            isMine ? styles.timeRight : styles.timeLeft,
          ]}
        >
          {formatMessageTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  avatarCol: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  bubbleWrapper: {
    maxWidth: '75%',
  },
  bubbleWrapperLeft: {
    alignItems: 'flex-start',
  },
  bubbleWrapperRight: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMine: {
    color: '#fff',
  },
  messageTextOther: {
    color: '#111827',
  },
  time: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  timeLeft: {
    marginLeft: 4,
  },
  timeRight: {
    marginRight: 4,
  },
});
