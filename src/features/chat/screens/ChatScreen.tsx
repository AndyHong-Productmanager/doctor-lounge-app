import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMessages } from '../hooks/useMessages';
import {
  useSendMessage,
  useDeleteMessage,
  useMarkThreadRead,
} from '../hooks/useChatMutations';
import { ChatRepository } from '../../../data/repositories/ChatRepository';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { useAuthStore } from '../../auth/hooks/useAuthStore';
import type { ChatMessage } from '../../../data/schemas/chat';

export default function ChatScreen() {
  const { threadId: threadIdParam } = useLocalSearchParams<{
    threadId: string;
  }>();
  const threadId = Number(threadIdParam) || 0;

  const user = useAuthStore((s) => s.user);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMessages(threadId);

  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();
  const markRead = useMarkThreadRead();

  // Flatten pages into a single list (newest last for inverted FlatList)
  const allMessages = useMemo(() => {
    if (!data?.pages) return [];
    const msgs = data.pages.flatMap((page) => page.messages);
    // Sort ascending by id so newest is at the end (inverted list renders from bottom)
    return [...msgs].sort((a, b) => a.id - b.id);
  }, [data]);

  // Track the latest message id for polling
  const latestId = useMemo(() => {
    if (allMessages.length === 0) return 0;
    return allMessages[allMessages.length - 1].id;
  }, [allMessages]);

  // New messages from polling
  const [polledMessages, setPolledMessages] = useState<ChatMessage[]>([]);
  const latestIdRef = useRef(latestId);

  useEffect(() => {
    latestIdRef.current = latestId;
  }, [latestId]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (threadId <= 0) return;

    const interval = setInterval(async () => {
      const afterId = latestIdRef.current;
      if (afterId <= 0) return;
      try {
        const newMsgs = await ChatRepository.getNewMessages(
          threadId,
          afterId,
        );
        if (newMsgs.length > 0) {
          setPolledMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const fresh = newMsgs.filter((m) => !existingIds.has(m.id));
            return [...prev, ...fresh];
          });
        }
      } catch {
        // Silently ignore polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [threadId]);

  // Merge polled messages with paginated data
  const displayMessages = useMemo(() => {
    if (polledMessages.length === 0) return allMessages;
    const existingIds = new Set(allMessages.map((m) => m.id));
    const newOnes = polledMessages.filter((m) => !existingIds.has(m.id));
    return [...allMessages, ...newOnes].sort((a, b) => a.id - b.id);
  }, [allMessages, polledMessages]);

  // Mark thread as read on mount
  useEffect(() => {
    if (threadId > 0) {
      markRead.mutate(threadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage.mutate(
        { threadId, message },
        {
          onSuccess: (newMsg) => {
            setPolledMessages((prev) => {
              const exists = prev.some((m) => m.id === newMsg.id);
              if (exists) return prev;
              return [...prev, newMsg];
            });
          },
        },
      );
    },
    [threadId, sendMessage],
  );

  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      Alert.alert('메시지 삭제', '이 메시지를 삭제하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteMessage.mutate({ messageId, threadId });
            setPolledMessages((prev) =>
              prev.filter((m) => m.id !== messageId),
            );
          },
        },
      ]);
    },
    [threadId, deleteMessage],
  );

  // Determine if a message is mine based on user nicename matching sender display_name
  // or sender user_id. Since auth store has limited info, we compare display_name.
  const isMine = useCallback(
    (msg: ChatMessage) => {
      if (!user) return false;
      return msg.sender?.display_name === user.displayName;
    },
    [user],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble
        message={item}
        isMine={isMine(item)}
        onLongPress={
          isMine(item) ? () => handleDeleteMessage(item.id) : undefined
        }
      />
    ),
    [isMine, handleDeleteMessage],
  );

  const keyExtractor = useCallback(
    (item: ChatMessage) => String(item.id),
    [],
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
        <Text style={styles.errorText}>메시지를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={displayMessages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
      <ChatInput
        onSend={handleSend}
        isSending={sendMessage.isPending}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 15, color: '#666' },
  loadingMore: { paddingVertical: 16 },
  listContent: { paddingVertical: 8 },
});
