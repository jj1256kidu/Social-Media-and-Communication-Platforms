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
      className="glass-card rounded-xl p-6 mb-6 card-hover neon-gradient"
    >
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onUpvote}
            className="glass-button p-2 rounded-full hover:text-cyan-400"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </motion.button>
          <span className="cyber-text text-lg">{upvotes}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDownvote}
            className="glass-button p-2 rounded-full hover:text-purple-400"
          >
            <ArrowDownIcon className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-cyan-400">
              Posted by {author}
            </span>
            <span className="text-sm text-purple-400">in {category}</span>
            <span className="text-sm text-gray-400">{createdAt}</span>
          </div>
          
          <h3 className="text-xl font-bold cyber-text mb-3 hover-glow">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-4">
            {content}
          </p>

          {showSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card rounded-lg mb-4 p-4 border border-cyan-400/30"
            >
              <div className="flex items-start space-x-2">
                <SparklesIcon className="h-5 w-5 text-cyan-400" />
                <p className="text-sm text-cyan-300">
                  {aiSummary}
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftIcon className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">{comments} comments</span>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojis(!showEmojis)}
                className="glass-button flex items-center space-x-1"
              >
                <FaceSmileIcon className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">{selectedEmoji || 'React'}</span>
              </motion.button>

              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-0 glass-card rounded-lg shadow-xl p-2 flex space-x-2 z-10"
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
                      className="text-xl hover-glow"
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
              className="glass-button flex items-center space-x-1"
            >
              <SparklesIcon className="h-4 w-4 text-purple-400" />
              <span className="text-sm">AI Summary</span>
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="glass-button text-xs py-1 hover:text-cyan-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadCard; 
