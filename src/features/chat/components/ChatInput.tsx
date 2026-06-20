import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Send } from 'lucide-react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending?: boolean;
}

export default function ChatInput({ onSend, isSending = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setText('');
  };

  const canSend = text.trim().length > 0 && !isSending;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={2000}
        editable={!isSending}
      />
      <TouchableOpacity
        style={[styles.sendBtn, canSend && styles.sendBtnActive]}
        onPress={handleSend}
        disabled={!canSend}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Send size={20} color={canSend ? '#fff' : '#9ca3af'} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: '#111827',
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#2563eb',
  },
});
