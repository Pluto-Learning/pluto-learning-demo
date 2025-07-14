import React from 'react';

const ChatList = ({ chats, onChatSelect }) => {
  return (
    <div className="sidebar">
      <h3>Chats</h3>
      <ul className="chat-list">
        {chats?.map((chat, index) => (
          <li key={index} className="chat-list-item" onClick={() => onChatSelect(chat)}>
            <img src={chat.avatar} alt={chat.name} />
            <div>
              <div className="name">{chat.name}</div>
              <div className="last-message">{chat.lastMessage}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
