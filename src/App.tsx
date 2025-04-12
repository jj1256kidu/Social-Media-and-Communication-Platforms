import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, UserIcon, PhotographIcon, EmojiHappyIcon, CheckIcon } from '@heroicons/react/outline';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useDropzone } from 'react-dropzone';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  isMedia?: boolean;
  mediaUrl?: string;
  reactions?: { [key: string]: string[] };
  status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: number;
  name: string;
  members: string[];
  lastMessage?: Message;
  isTyping?: string[];
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced mock data
  const mockUsers = {
    'Alice': { avatar: '👩‍💼', online: true },
    'Bob': { avatar: '👨‍💼', online: true },
    'Charlie': { avatar: '👨‍🔬', online: false },
    'David': { avatar: '👨‍🎨', online: true },
    'Eve': { avatar: '👩‍🎤', online: false }
  };

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'General Chat',
      members: ['Alice', 'Bob', 'Charlie'],
      lastMessage: {
        id: 1,
        text: 'Hello everyone! 👋',
        sender: 'Alice',
        timestamp: new Date(),
        status: 'read',
        reactions: { '👍': ['Bob', 'Charlie'] }
      },
      isTyping: ['Bob']
    },
    {
      id: 2,
      name: 'Work Group',
      members: ['David', 'Eve'],
      lastMessage: {
        id: 2,
        text: 'Meeting at 3 PM today',
        sender: 'David',
        timestamp: new Date(),
        status: 'delivered'
      }
    },
    {
      id: 3,
      name: 'Project Team',
      members: ['Alice', 'David', 'Eve'],
      lastMessage: {
        id: 3,
        text: 'Just shared the design mockups',
        sender: 'Eve',
        timestamp: new Date(),
        isMedia: true,
        mediaUrl: 'https://picsum.photos/200/300',
        status: 'read'
      }
    }
  ]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || previewUrl) && currentChat) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        sender: username,
        timestamp: new Date(),
        status: 'sent',
        ...(previewUrl && { isMedia: true, mediaUrl: previewUrl })
      };

      setChats(chats.map(chat => 
        chat.id === currentChat.id 
          ? { 
              ...chat, 
              lastMessage: newMessage,
              isTyping: chat.isTyping?.filter(user => user !== username)
            } 
          : chat
      ));

      setMessage('');
      setPreviewUrl(null);
      setShowEmojiPicker(false);
    }
  };

  const addReaction = (messageId: number, emoji: string) => {
    setChats(chats.map(chat => {
      if (chat.lastMessage?.id === messageId) {
        const reactions = chat.lastMessage.reactions || {};
        const users = reactions[emoji] || [];
        if (!users.includes(username)) {
          reactions[emoji] = [...users, username];
        }
        return {
          ...chat,
          lastMessage: {
            ...chat.lastMessage,
            reactions
          }
        };
      }
      return chat;
    }));
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
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">{chat.name}</h3>
                <span className="text-xs text-gray-500">
                  {chat.lastMessage?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage?.sender}: {chat.lastMessage?.text}
              </p>
              {chat.isTyping && chat.isTyping.length > 0 && (
                <p className="text-xs text-primary-600">typing...</p>
              )}
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
              <div className="flex items-center space-x-2">
                {currentChat.members.map(member => (
                  <span key={member} className="text-sm text-gray-500">
                    {mockUsers[member].avatar} {member}
                    {mockUsers[member].online && (
                      <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.lastMessage && (
                <div className="flex flex-col space-y-2">
                  <div className={`flex ${currentChat.lastMessage.sender === username ? 'justify-end' : 'justify-start'}`}>
                    <div className={`message-bubble ${
                      currentChat.lastMessage.sender === username ? 'message-bubble-sent' : 'message-bubble-received'
                    }`}>
                      {currentChat.lastMessage.isMedia ? (
                        <img 
                          src={currentChat.lastMessage.mediaUrl} 
                          alt="Shared media" 
                          className="max-w-xs rounded-lg"
                        />
                      ) : (
                        <div>{currentChat.lastMessage.text}</div>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs opacity-70">
                          {currentChat.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {currentChat.lastMessage.sender === username && (
                          <span className="text-xs">
                            {currentChat.lastMessage.status === 'read' ? (
                              <CheckIcon className="h-4 w-4 text-blue-500" />
                            ) : currentChat.lastMessage.status === 'delivered' ? (
                              <CheckIcon className="h-4 w-4 text-gray-400" />
                            ) : null}
                          </span>
                        )}
                      </div>
                      {currentChat.lastMessage.reactions && (
                        <div className="flex space-x-1 mt-1">
                          {Object.entries(currentChat.lastMessage.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(currentChat.lastMessage!.id, emoji)}
                              className="text-xs bg-gray-100 rounded-full px-2 py-1 hover:bg-gray-200"
                            >
                              {emoji} {users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {previewUrl && (
                <div className="mb-4 relative">
                  <img src={previewUrl} alt="Preview" className="max-w-xs rounded-lg" />
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    ×
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                  >
                    <EmojiHappyIcon className="h-6 w-6" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2">
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                          setMessage(prev => prev + emoji.native);
                          setShowEmojiPicker(false);
                        }}
                        theme="light"
                      />
                    </div>
                  )}
                </div>
                <div {...getRootProps()} className="flex-1">
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                  >
                    <PhotographIcon className="h-6 w-6" />
                  </button>
                </div>
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
