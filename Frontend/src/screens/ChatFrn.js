import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import ChatBot from './src/ChatBot';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ChatBot />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;