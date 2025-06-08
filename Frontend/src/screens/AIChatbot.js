import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const scrollViewRef = useRef(null);
  const genAI = useRef(null);
  const model = useRef(null);

  const initializeGemini = () => {
    if (!apiKey.trim()) return;

    try {
      genAI.current = new GoogleGenerativeAI(apiKey);
      model.current = genAI.current.getGenerativeModel({ model: 'gemini-1.5-flash' });
      setShowApiKeyInput(false);

      // Add welcome message
      const welcomeMessage = {
        id: Date.now().toString(),
        text: "Hello! I'm Your Friendly Chatbot. How can I help you today?",
        sender: 'gemini',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing Gemini:', error);
      alert('Failed to initialize Gemini. Please check your API key.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get Gemini response with proper error handling
      const result = await model.current.generateContent({
        contents: [{ role: 'user', parts: [{ text: input }] }],
      });

      // Properly extract the text from the response
      const response = result.response;
      const text = response.text();

      // Add Gemini response
      const geminiMessage = {
        id: Date.now().toString(),
        text: text,
        sender: 'gemini',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, geminiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      // More specific error messages
      if (error.message.includes('API key not valid')) {
        errorMessage = 'Invalid API key. Please check your Gemini API key.';
      } else if (error.message.includes('Unexpected response format')) {
        errorMessage = 'Received unexpected response from Gemini.';
      } else if (error.message.includes('content policy')) {
        errorMessage = 'This query violates Gemini content policies.';
      } else if (error.message.includes('location not supported')) {
        errorMessage = 'Gemini is not available in your location.';
      }

      const errorMsg = {
        id: Date.now().toString(),
        text: errorMessage,
        sender: 'gemini',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const resetChat = () => {
    setMessages([]);
    setShowApiKeyInput(true);
    setApiKey('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {showApiKeyInput ? (
        <View style={styles.apiKeyContainer}>
          <Text style={styles.apiKeyTitle}>Enter Your API Key</Text>
          <TextInput
            style={styles.apiKeyInput}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Paste your API key here"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.apiKeyButton}
            onPress={initializeGemini}
            disabled={!apiKey.trim()}
          >
            <Text style={styles.apiKeyButtonText}>Continue</Text>
          </TouchableOpacity>
          <Text style={styles.apiKeyNote}>
            Your API key is used only to communicate with Google's servers and is not stored anywhere.
          </Text>
          <Text style={styles.apiKeyHelp}>
            Get your API key from: https://ai.google.dev/
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>ChatBot</Text>
            <TouchableOpacity onPress={resetChat}>
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === 'user'
                    ? styles.userBubble
                    : styles.geminiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user'
                      ? styles.userText
                      : styles.geminiText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text style={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageBubble, styles.geminiBubble]}>
                <ActivityIndicator size="small" color="#666" />
                <Text style={[styles.messageText, styles.geminiText]}>
                  ChatBot is thinking...
                </Text>
              </View>
            )}
          </ScrollView>

          <View
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              editable={!loading}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || loading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  apiKeyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  apiKeyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  apiKeyInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  apiKeyButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  apiKeyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  apiKeyNote: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  apiKeyHelp: {
    marginTop: 10,
    fontSize: 12,
    color: '#4285F4',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  header: {
    backgroundColor: '#4285F4',
    padding: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: hp(3),
    fontWeight: '500',
    marginTop:hp(1.5)
  },
  resetButton: {
    color: 'white',
    fontSize: hp(2),
    marginTop:hp(2)
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chatContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#4285F4',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  geminiBubble: {
    backgroundColor: '#e9e9eb',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  geminiText: {
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingBottom:hp(9),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    fontSize: 16,
    color: 'black',
    marginTop:hp(2)
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#4285F4',
    borderRadius: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 64,
    marginTop:hp(2)
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AIChatbot;