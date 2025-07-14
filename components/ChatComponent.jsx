"use client"
import React, { useState } from 'react';
import { MessageList, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import moment from 'moment';
import ChatList from './ChatList';

const ChatComponent = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');

  const chatList = [
    {
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: 'Hey! How are you?',
    },
    {
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: 'Can you send me the report?',
    },
  ];

  // Handle sending new message
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        position: 'right',
        type: 'text',
        text: newMessage,
        date: new Date(),
      };

      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  // Select a chat from the list
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages([
      {
        position: 'left',
        type: 'text',
        text: chat.lastMessage,
        date: new Date(),
      },
    ]);
  };

  return (
    <div className="app-container">
      {/* Sidebar with chat list */}
      <ChatList chats={chatList} onChatSelect={handleChatSelect} />

      {/* Main chat window */}
      <div className="chat-container">
        {selectedChat ? (
          <>
            <div className="message-list-container">
              <MessageList
                className="message-list"
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={messages.map((msg) => ({
                  position: msg.position,
                  type: 'text',
                  text: msg.text,
                  date: msg.date,
                }))}
              />
            </div>
            <div className="input-container">
              <Input
                className="input-field"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rightButtons={
                  <button className="send-button" onClick={handleSendMessage}>
                    Send
                  </button>
                }
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
