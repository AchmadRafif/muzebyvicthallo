import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  likes: { id: string }[];
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    fetchPosts();

    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => { fetchPosts(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUserId(data.user?.id ?? null);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url), likes(id)')
      .order('created_at', { ascending: false });
    if (data) setPosts(data as Post[]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: string, liked: boolean) => {
    if (!userId) return;
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId });
    }
    fetchPosts();
  };

  const renderPost = ({ item }: { item: Post }) => {
    const liked = item.likes.some((l) => l.id === userId);
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.profiles?.username?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.username}>@{item.profiles?.username ?? 'unknown'}</Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.postFooter}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item.id, liked)}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? Colors.primary : Colors.textSecondary}
            />
            <Text style={styles.likeCount}>{item.likes.length}</Text>
          </TouchableOpacity>
          <Text style={styles.postDate}>
            {new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>muze</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Belum ada post. Jadilah yang pertama! 🎵</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  postCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  content: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  postFooter: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  postDate: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});