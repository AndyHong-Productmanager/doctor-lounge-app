import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatRepository } from '../../../data/repositories/ChatRepository';

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      threadId,
      message,
    }: {
      threadId: number;
      message: string;
    }) => ChatRepository.sendMessage(threadId, message),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chatMessages', variables.threadId],
      });
      queryClient.invalidateQueries({
        queryKey: ['chatNewMessages', variables.threadId],
      });
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      threadId,
    }: {
      messageId: number;
      threadId: number;
    }) => ChatRepository.deleteMessage(messageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chatMessages', variables.threadId],
      });
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}

export function useToggleMessageReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      threadId,
    }: {
      messageId: number;
      threadId: number;
    }) => ChatRepository.toggleReaction(messageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chatMessages', variables.threadId],
      });
    },
  });
}

export function useCreateThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => ChatRepository.createThread(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}

export function useMarkThreadRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: number) =>
      ChatRepository.markThreadRead(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
      queryClient.invalidateQueries({ queryKey: ['chatUnreadThreads'] });
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      memberIds,
    }: {
      title: string;
      memberIds: number[];
    }) => ChatRepository.createGroup(title, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: number) => ChatRepository.leaveGroup(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}
