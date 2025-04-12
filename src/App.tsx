import React, { useState } from 'react';
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
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  username: string;
  avatar: string;
  bio?: string;
  karma: number;
  badges: string[];
  level: number;
  joinedDate: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  createdAt: Date;
  isAnonymous?: boolean;
  summary?: string;
  isTrending?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: User;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  parentId?: string;
  isCollapsed?: boolean;
  isAnonymous?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  postCount: number;
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
      name: 'General Discussion',
      description: 'Talk about anything and everything',
      icon: '💬',
      postCount: 0
    },
    {
      id: '2',
      name: 'Technology',
      description: 'Latest tech news and discussions',
      icon: '💻',
      postCount: 0
    },
    {
      id: '3',
      name: 'Gaming',
      description: 'Video games and gaming culture',
      icon: '🎮',
      postCount: 0
    }
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
      category: 'General Discussion',
      tags: [],
      upvotes: 10,
      downvotes: 0,
      comments: [],
      createdAt: new Date()
    }
  ]);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState(categories[0].name);

  const [loginUsername, setLoginUsername] = useState('');
  const [isLoginFocused, setIsLoginFocused] = useState(false);

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
      category,
      tags: [],
      upvotes: 0,
      downvotes: 0,
      comments: [],
      createdAt: new Date()
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
              createdAt: new Date()
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

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        {/* Header */}
        <header className="modern-nav sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gradient">
              Future Forum
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="login-input"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-light" />
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="avatar">
                    {currentUser.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentUser.username}</span>
                    <span className="text-xs text-text-light">Level {currentUser.level}</span>
                  </div>
                </div>
              ) : (
                <div className="login-container input-animation">
                  <div className="login-glow"></div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Enter username"
                      className="login-input"
                    />
                    <button
                      onClick={() => handleLogin(loginUsername)}
                      disabled={!loginUsername}
                      className="login-button button-hover"
                    >
                      <UserIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-1">
                  <div className="modern-card p-4">
                    <h2 className="text-lg font-semibold mb-4">Categories</h2>
                    <ul className="space-y-2">
                      {categories.map(category => (
                        <li key={category.id}>
                          <Link
                            to={`/category/${category.id}`}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors"
                          >
                            <span className="text-lg">{category.icon}</span>
                            <div className="flex-1">
                              <span>{category.name}</span>
                              <span className="text-xs text-text-light ml-2">({category.postCount})</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Content Area */}
                <div className="md:col-span-3">
                  <div className="modern-card p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setSelectedFilter('trending')}
                          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
                            ${selectedFilter === 'trending' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-primary/5'}`}
                        >
                          <FireIcon className="h-5 w-5" />
                          <span>Trending</span>
                        </button>
                        <button
                          onClick={() => setSelectedFilter('recent')}
                          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
                            ${selectedFilter === 'recent' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-primary/5'}`}
                        >
                          <ClockIcon className="h-5 w-5" />
                          <span>Recent</span>
                        </button>
                      </div>
                      {currentUser && (
                        <button
                          onClick={() => setShowCreatePostModal(true)}
                          className="minimal-button"
                        >
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Create Post
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
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
                              {post.summary && (
                                <p className="text-sm text-text-light italic mb-2">{post.summary}</p>
                              )}
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
                                  <span>{post.isAnonymous ? 'Anonymous' : post.author.username}</span>
                                </div>
                                <span className="mx-2">•</span>
                                <span className="category-pill">{post.category}</span>
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
                </div>
              </div>
            } />
            <Route path="/category/:id" element={<div>Category Page</div>} />
          </Routes>
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
      </div>
    </Router>
  );
};

export default App; 
