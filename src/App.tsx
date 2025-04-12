import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, CogIcon, ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/outline';

interface User {
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  karma: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  category: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  tags: string[];
}

interface Comment {
  id: number;
  content: string;
  author: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  postCount: number;
  lastPost?: Post;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('👤');
  const [showProfile, setShowProfile] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');

  // Mock data
  const mockUsers: { [key: string]: User } = {
    'Alice': { username: 'Alice', avatar: '👩‍💼', status: 'online', karma: 150 },
    'Bob': { username: 'Bob', avatar: '👨‍💼', status: 'online', karma: 89 },
    'Charlie': { username: 'Charlie', avatar: '👨‍🔬', status: 'offline', lastSeen: new Date(Date.now() - 3600000), karma: 42 }
  };

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: 'General Discussion',
      description: 'Talk about anything and everything',
      postCount: 24,
      lastPost: {
        id: 1,
        title: 'Welcome to the forum!',
        content: 'This is a new forum for everyone to discuss various topics.',
        author: 'Alice',
        timestamp: new Date(),
        category: 'General Discussion',
        upvotes: 15,
        downvotes: 2,
        comments: [],
        tags: ['welcome', 'introduction']
      }
    },
    {
      id: 2,
      name: 'Technology',
      description: 'Discuss the latest in tech',
      postCount: 12,
      lastPost: {
        id: 2,
        title: 'New AI Developments',
        content: 'What do you think about the latest AI advancements?',
        author: 'Bob',
        timestamp: new Date(),
        category: 'Technology',
        upvotes: 8,
        downvotes: 1,
        comments: [],
        tags: ['ai', 'technology']
      }
    }
  ]);

  const [posts, setPosts] = useState<Post[]>([]);

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    return usernameRegex.test(username);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUsername(username)) {
      if (!mockUsers[username]) {
        mockUsers[username] = {
          username,
          avatar: '👤',
          status: 'online',
          karma: 0
        };
      }
      setIsLoggedIn(true);
    } else {
      alert('Invalid username! Username must be 3-20 characters, start with a letter, and can only contain letters, numbers, and underscores.');
    }
  };

  const handleVote = (postId: number, isUpvote: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          upvotes: isUpvote ? post.upvotes + 1 : post.upvotes,
          downvotes: !isUpvote ? post.downvotes + 1 : post.downvotes
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() && newPostContent.trim() && currentCategory) {
      const newPost: Post = {
        id: Date.now(),
        title: newPostTitle,
        content: newPostContent,
        author: username,
        timestamp: new Date(),
        category: currentCategory.name,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        tags: []
      };

      setPosts([...posts, newPost]);
      setNewPostTitle('');
      setNewPostContent('');
      setCurrentPost(newPost);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentPost) {
      const newCommentObj: Comment = {
        id: Date.now(),
        content: newComment,
        author: username,
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0,
        replies: []
      };

      setPosts(posts.map(post => {
        if (post.id === currentPost.id) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj]
          };
        }
        return post;
      }));

      setNewComment('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary-600 mb-6 text-center">Forum</h1>
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
              Enter Forum
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
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{userAvatar}</span>
            <span className="font-medium">{username}</span>
            <span className="text-sm text-gray-500">({mockUsers[username].karma} karma)</span>
          </div>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <CogIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="p-4">
            <h2 className="font-semibold text-gray-800 mb-4">Categories</h2>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setCurrentCategory(category)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  currentCategory?.id === category.id ? 'bg-primary-50' : ''
                }`}
              >
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{category.postCount} posts</span>
                  {category.lastPost && (
                    <span className="text-xs text-gray-500">
                      Last post: {category.lastPost.timestamp.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentCategory ? (
          currentPost ? (
            // Post View
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleVote(currentPost.id, true)}
                      className="p-2 hover:text-green-500 transition-colors duration-200"
                    >
                      <ArrowUpIcon className="h-5 w-5" />
                    </button>
                    <span className="font-medium">{currentPost.upvotes - currentPost.downvotes}</span>
                    <button
                      onClick={() => handleVote(currentPost.id, false)}
                      className="p-2 hover:text-red-500 transition-colors duration-200"
                    >
                      <ArrowDownIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">{currentPost.title}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500">
                        Posted by {currentPost.author} on {currentPost.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-4 text-gray-700">{currentPost.content}</div>
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
                  <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Post Comment
                    </button>
                  </form>

                  {currentPost.comments.map((comment) => (
                    <div key={comment.id} className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => {/* Handle comment vote */}}
                            className="p-2 hover:text-green-500 transition-colors duration-200"
                          >
                            <ArrowUpIcon className="h-5 w-5" />
                          </button>
                          <span className="font-medium">{comment.upvotes - comment.downvotes}</span>
                          <button
                            onClick={() => {/* Handle comment vote */}}
                            className="p-2 hover:text-red-500 transition-colors duration-200"
                          >
                            <ArrowDownIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-gray-500">
                              {comment.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Category View
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h1>
                <button
                  onClick={() => setCurrentPost(null)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  New Post
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="bg-white rounded-lg shadow p-6 mb-6">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Write your post..."
                  className="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={6}
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Create Post
                </button>
              </form>

              {posts
                .filter(post => post.category === currentCategory.name)
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setCurrentPost(post)}
                    className="bg-white rounded-lg shadow p-6 mb-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{post.upvotes - post.downvotes}</span>
                        <span className="text-xs text-gray-500">votes</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Posted by {post.author} on {post.timestamp.toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{post.comments.length} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a category to view posts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 
