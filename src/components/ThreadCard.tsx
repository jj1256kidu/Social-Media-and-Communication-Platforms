import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { FaceSmileIcon } from '@heroicons/react/24/solid';

interface ThreadCardProps {
  title: string;
  author: string;
  content: string;
  category: string;
  upvotes: number;
  comments: number;
  createdAt: string;
  tags: string[];
  onUpvote: () => void;
  onDownvote: () => void;
}

const emojis = ['👍', '❤️', '🎉', '🤔', '👏'];

const ThreadCard: React.FC<ThreadCardProps> = ({
  title,
  author,
  content,
  category,
  upvotes,
  comments,
  createdAt,
  tags,
  onUpvote,
  onDownvote,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  // Mock AI summary
  const aiSummary = "This thread discusses modern state management solutions in React, comparing Redux with newer alternatives like Zustand and Jotai. Users share their experiences and preferences.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 mb-4"
    >
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onUpvote}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowUpIcon className="h-5 w-5 text-gray-500 hover:text-green-500" />
          </motion.button>
          <span className="text-sm font-medium">{upvotes}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDownvote}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowDownIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </motion.button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Posted by {author} in {category}
            </span>
            <span className="text-xs text-gray-400">{createdAt}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {content}
          </p>

          {showSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4"
            >
              <div className="flex items-start space-x-2">
                <SparklesIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {aiSummary}
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{comments} comments</span>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojis(!showEmojis)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <FaceSmileIcon className="h-4 w-4" />
                <span className="text-sm">{selectedEmoji || 'React'}</span>
              </motion.button>

              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2"
                >
                  {emojis.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojis(false);
                      }}
                      className="text-xl"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <SparklesIcon className="h-4 w-4" />
              <span className="text-sm">AI Summary</span>
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadCard; 
