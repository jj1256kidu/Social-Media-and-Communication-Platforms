import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    content: string;
    author: {
      username: string;
      avatar: string;
      level: number;
    };
    category: {
      name: string;
      icon: string;
    };
    upvotes: number;
    downvotes: number;
    comments: number;
    tags: string[];
    createdAt: Date;
    isTrending: boolean;
  };
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onBookmark: (id: string) => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  onUpvote,
  onDownvote,
  onBookmark,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVoteAnimation, setShowVoteAnimation] = useState(false);
  const [voteCount, setVoteCount] = useState(thread.upvotes - thread.downvotes);

  const handleUpvote = () => {
    onUpvote(thread.id);
    setVoteCount(prev => prev + 1);
    setShowVoteAnimation(true);
    setTimeout(() => setShowVoteAnimation(false), 500);
  };

  const handleDownvote = () => {
    onDownvote(thread.id);
    setVoteCount(prev => prev - 1);
    setShowVoteAnimation(true);
    setTimeout(() => setShowVoteAnimation(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="modern-card p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            {thread.author.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{thread.author.username}</span>
              <span className="level-badge">Level {thread.author.level}</span>
            </div>
            <span className="text-xs text-text-light">
              {thread.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {thread.isTrending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="trending-badge"
            >
              <FireIcon className="w-4 h-4" />
              <span>Trending</span>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBookmark(thread.id)}
            className="p-2 rounded-lg hover:bg-surface/50"
          >
            <BookmarkIcon className="w-5 h-5 text-text-light" />
          </motion.button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{thread.title}</h3>
      <p className="text-text-light mb-4 line-clamp-3">{thread.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {thread.tags.map((tag, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="tag"
          >
            #{tag}
          </motion.span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpvote}
              className="vote-button"
            >
              <ArrowUpIcon className="w-5 h-5 text-text" />
            </motion.button>
            <div className="relative w-8 text-center">
              <AnimatePresence>
                {showVoteAnimation && (
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-primary font-medium"
                  >
                    +1
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="font-medium">{voteCount}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownvote}
              className="vote-button"
            >
              <ArrowDownIcon className="w-5 h-5 text-text" />
            </motion.button>
          </div>
          <div className="flex items-center space-x-1 text-text-light">
            <ChatBubbleLeftIcon className="w-5 h-5" />
            <span>{thread.comments}</span>
          </div>
        </div>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          className="text-sm text-primary"
        >
          Read more
        </motion.span>
      </div>
    </motion.div>
  );
};

export default ThreadCard; 
