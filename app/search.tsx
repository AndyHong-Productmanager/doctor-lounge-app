import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import { useFeeds } from '../src/features/feed/hooks/useFeeds';
import { useMembers } from '../src/features/members/hooks/useMembers';
import { useToggleReaction, useToggleBookmark } from '../src/features/feed/hooks/useFeedMutations';
import FeedCard from '../src/features/feed/components/FeedCard';
import type { FeedItem } from '../src/data/schemas/feed';
import type { MemberItem } from '../src/data/schemas/member';

type TabKey = 'feeds' | 'members';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('feeds');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: feedsData,
    isLoading: feedsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeeds(searchTerm ? { search: searchTerm } : {});

  const { data: allMembers, isLoading: membersLoading } = useMembers();

  const toggleReaction = useToggleReaction();
  const toggleBookmark = useToggleBookmark();

  const feeds: FeedItem[] =
    feedsData?.pages.flatMap((page) => page.posts) ?? [];

  const filteredMembers: MemberItem[] = searchTerm
    ? (allMembers ?? []).filter(
        (m) =>
          m.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allMembers ?? [];

  const handleSearch = useCallback(() => {
    setSearchTerm(query.trim());
  }, [query]);

  const handleReaction = useCallback(
    (feedId: number) => {
      toggleReaction.mutate(feedId);
    },
    [toggleReaction]
  );

  const handleBookmark = useCallback(
    (feedId: number) => {
      toggleBookmark.mutate(feedId);
    },
    [toggleBookmark]
  );

  const renderMemberItem = useCallback(
    ({ item }: { item: MemberItem }) => (
      <TouchableOpacity
        style={styles.memberItem}
        onPress={() => router.push(`/profile/${item.username}`)}
      >
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
        ) : (
          <View style={[styles.memberAvatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {(item.display_name ?? '?')[0]}
            </Text>
          </View>
        )}
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.display_name}</Text>
          <Text style={styles.memberUsername}>@{item.username}</Text>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '검색' }} />

      <View style={styles.searchBar}>
        <SearchIcon size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feeds' && styles.tabActive]}
          onPress={() => setActiveTab('feeds')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'feeds' && styles.tabTextActive,
            ]}
          >
            피드
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'members' && styles.tabTextActive,
            ]}
          >
            멤버
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feeds' ? (
        feedsLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <FlatList
            data={feeds}
            renderItem={({ item }: { item: FeedItem }) => (
              <FeedCard
                item={item}
                onReact={() => handleReaction(item.id)}
                onBookmark={() => handleBookmark(item.id)}
              />
            )}
            keyExtractor={(item) => String(item.id)}
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
                <Text style={styles.emptyText}>
                  {searchTerm
                    ? '검색 결과가 없습니다.'
                    : '검색어를 입력해주세요.'}
                </Text>
              </View>
            }
          />
        )
      ) : membersLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          renderItem={renderMemberItem}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {searchTerm
                  ? '검색 결과가 없습니다.'
                  : '검색어를 입력해주세요.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    padding: 0,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  memberUsername: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: { fontSize: 15, color: '#9ca3af' },
  loadingMore: { paddingVertical: 16, alignItems: 'center' },
});
