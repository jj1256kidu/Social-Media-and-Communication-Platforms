import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { mockThreads, mockCategories } from './data/mockData';
import ThreadCard from './components/ThreadCard';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';

const App: React.FC = () => {
  const [threads, setThreads] = useState(mockThreads);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Add dark mode class to document
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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
        <Navbar
          onSearch={setSearchQuery}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

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
                    tags={thread.tags}
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
