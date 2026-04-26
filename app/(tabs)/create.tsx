import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

export default function CreateScreen() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Tulis sesuatu dulu!');
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    const { error } = await supabase.from('posts').insert({
      content: content.trim(),
      user_id: user.id,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setContent('');
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buat Post</Text>
      </View>
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Apa yang lagi kamu pikirkan?"
          placeholderTextColor={Colors.textSecondary}
          multiline
          maxLength={500}
          value={content}
          onChangeText={setContent}
        />
        <Text style={styles.charCount}>{content.length}/500</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !content.trim() && styles.buttonDisabled]}
          onPress={handlePost}
          disabled={loading || !content.trim()}
        >
          <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
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
  body: {
    flex: 1,
    padding: 16,
  },
  input: {
    color: Colors.text,
    fontSize: 18,
    lineHeight: 26,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  charCount: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});