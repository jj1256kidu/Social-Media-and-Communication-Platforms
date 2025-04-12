import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ChatBubbleLeftIcon,
  UserIcon,
  HomeIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  SearchIcon,
  FireIcon,
  ClockIcon,
  TagIcon,
  MicrophoneIcon,
  SparklesIcon,
  UserGroupIcon,
  BookmarkIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  karma: number;
  level: number;
  postCount: number;
  commentCount: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  threadCount: number;
  color: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: Category;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  lastReplyAt: Date;
  isAnonymous: boolean;
  views: number;
  isTrending: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  createdAt: Date;
  isOP: boolean;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'trending' | 'recent'>('recent');
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Tech',
      icon: '💻',
      description: 'Discussions about technology, programming, and software development',
      threadCount: 1250,
      color: '#00C6FF',
    },
    {
      id: '2',
      name: 'Life',
      icon: '🌱',
      description: 'Life advice, personal development, and general discussions',
      threadCount: 890,
      color: '#8F00FF',
    },
    {
      id: '3',
      name: 'Humor',
      icon: '😂',
      description: 'Funny stories, memes, and light-hearted content',
      threadCount: 750,
      color: '#39FF14',
    },
    {
      id: '4',
      name: 'AMA',
      icon: '❓',
      description: 'Ask Me Anything sessions with interesting people',
      threadCount: 320,
      color: '#FF6B6B',
    },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Welcome to the Future Forum!',
      content: 'This is a futuristic forum where you can discuss anything you want.',
      author: {
        id: '1',
        username: 'Admin',
        avatar: '👨‍💻'
      },
      category: {
        id: '1',
        name: 'Tech',
        icon: '💻',
        description: 'Discussions about technology, programming, and software development',
        threadCount: 1250,
        color: '#00C6FF',
      },
      tags: [],
      upvotes: 10,
      downvotes: 0,
      comments: [],
      createdAt: new Date(),
      lastReplyAt: new Date(),
      isAnonymous: false,
      views: 0,
      isTrending: true
    }
  ]);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState(categories[0].name);

  const [loginUsername, setLoginUsername] = useState('');
  const [isLoginFocused, setIsLoginFocused] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleLogin = (username: string) => {
    setCurrentUser({
      id: '2',
      username,
      avatar: '👤'
    });
  };

  const handleVote = (postId: string, isUpvote: boolean) => {
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

  const handleCreatePost = (title: string, content: string, category: string) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author: currentUser,
      category: categories.find(c => c.name === category) as Category,
      tags: [],
      upvotes: 0,
      downvotes: 0,
      comments: [],
      createdAt: new Date(),
      lastReplyAt: new Date(),
      isAnonymous: false,
      views: 0,
      isTrending: false
    };

    setPosts([newPost, ...posts]);
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!currentUser) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now().toString(),
              content,
              author: currentUser,
              upvotes: 0,
              downvotes: 0,
              replies: [],
              createdAt: new Date(),
              isOP: true
            }
          ]
        };
      }
      return post;
    }));
  };

  const handleCreatePostSubmit = () => {
    handleCreatePost(newPostTitle, newPostContent, newPostCategory);
    setShowCreatePostModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory(categories[0].name);
  };

  const handleVoiceInput = () => {
    setIsVoiceInputActive(true);
    // Implement voice recognition logic here
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'trending') {
      return post.isTrending;
    }
    return true;
  });

  // Search animation
  useEffect(() => {
    if (searchQuery) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        {/* Particle Background */}
        <div className="particle-background" id="particles-js" />

        {/* Navigation */}
        <nav className="modern-nav fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-gradient"
                >
                  Future Forum
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-xl hover:bg-surface/50"
                >
                  <SearchIcon className="w-5 h-5 text-text" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-xl hover:bg-surface/50"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5 text-text" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-text" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-0 right-0 z-40 px-4"
            >
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isTyping ? 'Searching...' : 'Search threads, users, or categories'}
                    className="w-full px-4 py-3 rounded-xl bg-surface/50 backdrop-blur-lg border border-border/50
                             focus:outline-none focus:ring-2 focus:ring-primary text-text"
                  />
                  <button
                    onClick={() => setShowSearch(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XMarkIcon className="w-5 h-5 text-text-light" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="modern-card p-6 cursor-pointer hover-lift"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-text">{category.name}</h3>
                  </div>
                  <p className="text-sm text-text-light mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-light">{category.threadCount} threads</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNewThreadModal(true);
                      }}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trending Threads */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Trending Threads</h2>
                <button className="minimal-button">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="modern-card p-4 hover-lift"
                  >
                    {post.isTrending && (
                      <div className="flex items-center text-primary mb-2">
                        <FireIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Trending</span>
                      </div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleVote(post.id, true)}
                          className="vote-button"
                        >
                          <ArrowUpIcon className="h-5 w-5" />
                        </button>
                        <span className="font-medium my-1">{post.upvotes - post.downvotes}</span>
                        <button
                          onClick={() => handleVote(post.id, false)}
                          className="vote-button"
                        >
                          <ArrowDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold">{post.title}</h2>
                        <p className="text-text-light mt-2">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="category-pill">
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center mt-4 text-sm text-text-light">
                          <div className="flex items-center">
                            <div className="avatar mr-2">
                              {post.author.avatar}
                            </div>
                            <span>{post.author.username}</span>
                          </div>
                          <span className="mx-2">•</span>
                          <span className="category-pill">{post.category.name}</span>
                          <span className="mx-2">•</span>
                          <span>{post.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="comment-section">
                          <button
                            onClick={() => {/* Open comments section */}}
                            className="flex items-center text-primary hover:text-primary-dark"
                          >
                            <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                            {post.comments.length} Comments
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Top Contributors</h2>
                <button className="minimal-button">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Contributor cards will go here */}
              </div>
            </div>
          </div>
        </main>

        {/* Create Post Modal */}
        {showCreatePostModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="modern-card p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="subtle-input"
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <div className="relative">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="subtle-input"
                      rows={4}
                      placeholder="Write your post content here..."
                    />
                    <button
                      onClick={handleVoiceInput}
                      className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors
                        ${isVoiceInputActive ? 'bg-primary text-white' : 'text-text-light hover:bg-primary/10'}`}
                    >
                      <MicrophoneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="subtle-input"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Post Anonymously</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Generate AI Summary</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCreatePostModal(false)}
                    className="px-4 py-2 rounded-lg font-medium text-text-light hover:text-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePostSubmit}
                    className="minimal-button"
                    disabled={!newPostTitle || !newPostContent}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Thread Modal */}
        <AnimatePresence>
          {showNewThreadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modern-card w-full max-w-2xl mx-4"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-text">Create New Thread</h3>
                    <button
                      onClick={() => setShowNewThreadModal(false)}
                      className="p-2 rounded-lg hover:bg-surface/50"
                    >
                      <XMarkIcon className="w-5 h-5 text-text" />
                    </button>
                  </div>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        className="subtle-input"
                        placeholder="Enter thread title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        Category
                      </label>
                      <select className="subtle-input">
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        Content
                      </label>
                      <textarea
                        className="subtle-input min-h-[200px]"
                        placeholder="Write your thread content here..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        className="subtle-input"
                        placeholder="Add tags (comma separated)"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowNewThreadModal(false)}
                        className="px-4 py-2 rounded-xl font-medium text-text-light hover:bg-surface/50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="minimal-button"
                      >
                        Create Thread
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App; 
