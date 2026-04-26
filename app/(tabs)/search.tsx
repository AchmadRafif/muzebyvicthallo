import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name, bio')
      .ilike('username', `%${text}%`)
      .limit(20);
    if (data) setResults(data as Profile[]);
  };

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity style={styles.profileCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
      </View>
      <View>
        <Text style={styles.username}>@{item.username}</Text>
        {item.full_name && <Text style={styles.fullName}>{item.full_name}</Text>}
        {item.bio && <Text style={styles.bio}>{item.bio}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari</Text>
      </View>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Cari username..."
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderProfile}
        ListEmptyComponent={
          query.length >= 2 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Tidak ada user ditemukan</Text>
            </View>
          ) : null
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
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  searchBox: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    color: Colors.text,
    fontSize: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 18,
  },
  username: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  fullName: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  bio: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
});