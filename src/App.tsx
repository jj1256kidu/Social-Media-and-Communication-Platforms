import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { mockThreads, mockCategories } from './data/mockData';
import ThreadCard from './components/ThreadCard';

const App: React.FC = () => {
  const [threads, setThreads] = useState(mockThreads);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpvote = (threadId: string) => {
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? { ...thread, upvotes: thread.upvotes + 1 }
        : thread
    ));
  };

  const handleDownvote = (threadId: string) => {
    setThreads(threads.map(thread =>
      thread.id === threadId
        ? { ...thread, downvotes: thread.downvotes + 1 }
        : thread
    ));
  };

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = !selectedCategory || thread.category.id === selectedCategory;
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">ForumHub</span>
                </Link>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search threads..."
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h2>
                <div className="space-y-2">
                  {mockCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Thread List */}
            <div className="flex-1">
              <div className="space-y-4">
                {filteredThreads.map(thread => (
                  <ThreadCard
                    key={thread.id}
                    title={thread.title}
                    author={thread.author.username}
                    content={thread.content}
                    category={thread.category.name}
                    upvotes={thread.upvotes}
                    comments={thread.comments.length}
                    createdAt={new Date(thread.createdAt).toLocaleDateString()}
                    onUpvote={() => handleUpvote(thread.id)}
                    onDownvote={() => handleDownvote(thread.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App; 
