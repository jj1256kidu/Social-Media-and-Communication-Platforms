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
  XMarkIcon,
  MagnifyingGlassIcon
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
  upvotedBy: string[];
  downvotedBy: string[];
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
      isTrending: true,
      upvotedBy: [],
      downvotedBy: []
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

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleLogin = () => {
    setCurrentUser({
      id: '1',
      username: 'Demo User',
      avatar: '👤',
      bio: 'Demo user for testing',
      karma: 0,
      level: 1,
      postCount: 0,
      commentCount: 0
    });
  };

  const handleVote = (postId: string, isUpvote: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          upvotes: isUpvote ? post.upvotes + 1 : post.upvotes,
          downvotes: !isUpvote ? post.downvotes + 1 : post.downvotes,
          upvotedBy: isUpvote ? [...post.upvotedBy, currentUser?.id || ''] : post.upvotedBy.filter(id => id !== currentUser?.id),
          downvotedBy: !isUpvote ? [...post.downvotedBy, currentUser?.id || ''] : post.downvotedBy.filter(id => id !== currentUser?.id)
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
      isTrending: false,
      upvotedBy: [],
      downvotedBy: []
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

  // Improved particles effect
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000));

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <canvas
          id="particle-canvas"
          className="fixed inset-0 z-0"
          style={{ pointerEvents: 'none' }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                ForumHub
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <MoonIcon className="h-6 w-6 text-gray-600" />
                  )}
                </button>
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{currentUser.username}</span>
                    <button
                      onClick={() => setCurrentUser(null)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="py-8">
            {/* Search and Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFilter('trending')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'trending'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FireIcon className="h-5 w-5" />
                  Trending
                </button>
                <button
                  onClick={() => setSelectedFilter('recent')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'recent'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ClockIcon className="h-5 w-5" />
                  Recent
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg transition-colors ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-75">{category.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">
                      {posts.filter((p) => p.category.id === category.id).length} posts
                    </span>
                    <button
                      onClick={() => {
                        setNewPostCategory(category.id);
                        setShowNewThreadModal(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      New Post
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl shadow-lg transition-colors ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <p className="text-sm opacity-75">
                        by {post.author.username} in {categories.find((c) => c.id === post.category.id)?.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(post.id, true)}
                        className={`p-2 rounded-full transition-colors ${
                          post.upvotedBy.includes(currentUser?.id || '') ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <ArrowUpIcon className="h-5 w-5" />
                      </button>
                      <span className="font-medium">{post.upvotes - post.downvotes}</span>
                      <button
                        onClick={() => handleVote(post.id, false)}
                        className={`p-2 rounded-full transition-colors ${
                          post.downvotedBy.includes(currentUser?.id || '') ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                      >
                        <ArrowDownIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowCommentModal(true);
                      }}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>{post.comments.length} comments</span>
                    </button>
                    <div className="flex space-x-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>

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
                      <option key={category.id} value={category.id}>
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
