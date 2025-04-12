import React, { useState } from 'react';
import { PaperAirplaneIcon, UserIcon, PhotographIcon, EmojiHappyIcon } from '@heroicons/react/outline';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  isMedia?: boolean;
  mediaUrl?: string;
}

interface Chat {
  id: number;
  name: string;
  members: string[];
  lastMessage?: Message;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');

  // Mock data
  const chats: Chat[] = [
    {
      id: 1,
      name: 'General Chat',
      members: ['Alice', 'Bob', 'Charlie'],
      lastMessage: {
        id: 1,
        text: 'Hello everyone!',
        sender: 'Alice',
        timestamp: new Date(),
      },
    },
    {
      id: 2,
      name: 'Work Group',
      members: ['David', 'Eve'],
      lastMessage: {
        id: 2,
        text: 'Meeting at 3 PM',
        sender: 'David',
        timestamp: new Date(),
      },
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentChat) {
      // Mock sending message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary-600 mb-6 text-center">Minimal Messenger</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Enter Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                currentChat?.id === chat.id ? 'bg-primary-50' : ''
              }`}
            >
              <h3 className="font-medium text-gray-800">{chat.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage?.sender}: {chat.lastMessage?.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">{currentChat.name}</h2>
              <p className="text-sm text-gray-500">
                {currentChat.members.length} members
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Mock messages */}
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-2xl px-4 py-2 max-w-[70%]">
                  Hello everyone!
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-2xl px-4 py-2 max-w-[70%]">
                  Hi there! How are you?
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <EmojiHappyIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                >
                  <PhotographIcon className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="p-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 
