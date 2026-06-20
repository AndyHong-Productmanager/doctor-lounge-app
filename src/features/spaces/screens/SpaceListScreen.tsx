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
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import { useSpaces } from '../hooks/useSpaces';
import type { SpaceItem } from '../../../data/schemas/space';

export default function SpaceListScreen() {
  const { data: spaces, isLoading, isError, refetch, isRefetching } = useSpaces();

  const renderItem = useCallback(({ item }: { item: SpaceItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => router.push(`/(tabs)/spaces/${item.slug}`)}
      >
        {item.logo ? (
          <Image source={{ uri: item.logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Users size={24} color="#9ca3af" />
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.members}>
            {item.members_count}명 참여
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

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
        <Text style={styles.errorText}>
          스페이스를 불러오지 못했습니다.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={spaces}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          colors={['#2563eb']}
        />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>참여 가능한 스페이스가 없습니다.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  listContent: { paddingVertical: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  logoPlaceholder: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  members: {
    fontSize: 12,
    color: '#9ca3af',
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  errorText: { fontSize: 15, color: '#666', marginBottom: 12 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
