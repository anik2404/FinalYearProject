import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

const CommentBox = ({ idMeal }) => {
  const { username } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const COMMENTS_KEY = `@comments_${idMeal}`;

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(COMMENTS_KEY);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const saveComments = async (newComments) => {
    try {
      await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(newComments));
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  };

  const handleAddComment = async () => {
    if (!username || username === 'User') {
      alert('Please log in to comment.');
      return;
    }
    if (comment.trim() === '') return;

    const newComment = {
      id: Date.now().toString(),
      username,
      comment,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    await saveComments(updatedComments);
    setComment('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments</Text>

      <ScrollView style={{ maxHeight: 300 }}>
        {comments.map((item) =>{
          const userInitial = item.username.charAt(0).toUpperCase();
          const timeAgo = moment(item.timestamp).fromNow();

          return (
            <View key={item.id} style={styles.commentRow}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitial}>{userInitial}</Text>
              </View>
              <View style={styles.commentContent}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
                <Text style={styles.timestamp}>{timeAgo}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a public comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingBottom:50
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  profileCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 15,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: 'orange',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 8,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommentBox;
