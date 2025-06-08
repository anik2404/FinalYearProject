import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A simple bookmark icon component using Unicode symbol with styling
const BookmarkIcon = ({ style }) => (
  <Text style={[styles.bookmarkIcon, style]}>{'\u{1F516}'}</Text> // Bookmark symbol
);

const CommentBox = ({ recipeId = null, isOnHomepage = false }) => {
  // State for comment input, comments array, and animation for homepage toggle
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [boxOpen, setBoxOpen] = useState(!isOnHomepage);
  const animation = React.useRef(new Animated.Value(0)).current;

  const storageKey = recipeId ? `comments_${recipeId}` : 'comments_global';

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    if (isOnHomepage) {
      Animated.timing(animation, {
        toValue: boxOpen ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [boxOpen, isOnHomepage, animation]);

  const loadComments = async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load comments:', e);
    }
  };

  const saveComments = async (newComments) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newComments));
    } catch (e) {
      console.error('Failed to save comments:', e);
    }
  };

  const onSubmit = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      user: 'User',
      text: comment.trim(),
      timestamp: new Date().toISOString(),
    };
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    saveComments(updatedComments);
    setComment('');
  };

  // Transition height and opacity for homepage bookmark expanding to comment box
  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 320],
  });
  const containerOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
  });

  if (isOnHomepage) {
    return (
      <Animated.View
        style={[
          styles.homepageContainer,
          {
            height: containerHeight,
            opacity: containerOpacity,
          },
        ]}
      >
        {!boxOpen && (
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => setBoxOpen(true)}
            accessibilityLabel="Open comments"
            accessibilityHint="Opens the comment box"
          >
            <BookmarkIcon />
          </TouchableOpacity>
        )}
        {boxOpen && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.commentBoxFull}
          >
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Comments</Text>
              <TouchableOpacity
                onPress={() => setBoxOpen(false)}
                accessibilityLabel="Close comments"
                accessibilityHint="Closes the comment box"
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
              multiline={true}
              numberOfLines={2}
              accessibilityLabel="Add comment input"
            />
            <TouchableOpacity
              style={[styles.button, comment.trim() ? styles.buttonEnabled : styles.buttonDisabled]}
              onPress={onSubmit}
              disabled={!comment.trim()}
              accessibilityLabel="Submit comment"
            >
              <Text style={styles.buttonText}>Comment</Text>
            </TouchableOpacity>
            <FlatList
              keyboardShouldPersistTaps="handled"
              style={styles.commentList}
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>
              }
            />
          </KeyboardAvoidingView>
        )}
      </Animated.View>
    );
  }

  // For main content blocks: show full comment box always open
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.commentBoxFull}
    >
      <Text style={styles.headerTitle}>Comments</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        placeholderTextColor="#999"
        value={comment}
        onChangeText={setComment}
        multiline={true}
        numberOfLines={2}
        accessibilityLabel="Add comment input"
      />
      <TouchableOpacity
        style={[styles.button, comment.trim() ? styles.buttonEnabled : styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={!comment.trim()}
        accessibilityLabel="Submit comment"
      >
        <Text style={styles.buttonText}>Comment</Text>
      </TouchableOpacity>
      <FlatList
        keyboardShouldPersistTaps="handled"
        style={styles.commentList}
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.user}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentTime}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  homepageContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 320,
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
    zIndex: 999,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bookmarkIcon: {
    fontSize: 24,
    color: '#000',
  },
  commentBoxFull: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  closeText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
    lineHeight: 30,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111',
    minHeight: 48,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  button: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    transitionDuration: '300ms',
  },
  buttonEnabled: {
    backgroundColor: '#000',
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  commentList: {
    maxHeight: 200,
  },
  commentItem: {
    marginBottom: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  commentUser: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },
  commentText: {
    fontSize: 16,
    color: '#222',
    marginVertical: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  noCommentsText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default CommentBox;