import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftIcon,
  ReplyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Comment {
  id: string;
  content: string;
  author: {
    username: string;
    avatar: string;
    level: number;
  };
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  createdAt: Date;
  isOP: boolean;
}

interface CommentSectionProps {
  comments: Comment[];
  onUpvote: (commentId: string) => void;
  onDownvote: (commentId: string) => void;
  onReply: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onUpvote,
  onDownvote,
  onReply,
}) => {
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderComment = (comment: Comment, level: number = 0) => {
    const isExpanded = expandedReplies[comment.id];

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`modern-card p-6 mb-4 ${level > 0 ? 'ml-4' : ''}`}
        style={{
          marginLeft: `${level * 2}rem`,
          borderLeft: level > 0 ? `2px solid var(--primary)` : 'none',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="avatar">
              {comment.author.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{comment.author.username}</span>
                <span className="level-badge">Level {comment.author.level}</span>
                {comment.isOP && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    OP
                  </span>
                )}
              </div>
              <span className="text-xs text-text-light">
                {comment.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-text-light mb-4">{comment.content}</p>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpvote(comment.id)}
              className="vote-button"
            >
              <ArrowUpIcon className="w-5 h-5 text-text" />
            </motion.button>
            <span className="font-medium">{comment.upvotes - comment.downvotes}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownvote(comment.id)}
              className="vote-button"
            >
              <ArrowDownIcon className="w-5 h-5 text-text" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReply(comment.id)}
            className="flex items-center space-x-1 text-text-light hover:text-primary"
          >
            <ReplyIcon className="w-5 h-5" />
            <span>Reply</span>
          </motion.button>

          {comment.replies.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleReplies(comment.id)}
              className="flex items-center space-x-1 text-text-light hover:text-primary"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span>
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && comment.replies.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4"
            >
              {comment.replies.map(reply => renderComment(reply, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6">Comments</h3>
      <div className="space-y-4">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentSection; 
