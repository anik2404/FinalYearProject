import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

const apiKey = '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';
const ChatBot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const userMessage = messages[0].text;

    axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: userMessage,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        const botMessage = {
          _id: Math.random().toString(36).substring(7),
          text: response.data.choices[0].text.trim(),
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'ChatBot',
            avatar: 'https://placeimg.com/140/140/any',
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, botMessage)
        );
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} user={{ _id: 1 }} />;
};

export default ChatBot
