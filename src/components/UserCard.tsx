import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  FireIcon,
  ChatBubbleLeftIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';

interface UserCardProps {
  user: {
    id: string;
    username: string;
    avatar: string;
    bio: string;
    karma: number;
    level: number;
    postCount: number;
    commentCount: number;
    isTopContributor?: boolean;
  };
  onSelect: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(user.id)}
      className="modern-card p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className="avatar"
          >
            {user.avatar}
          </motion.div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{user.username}</span>
              <span className="level-badge">Level {user.level}</span>
              {user.isTopContributor && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="trending-badge"
                >
                  <FireIcon className="w-4 h-4" />
                  <span>Top Contributor</span>
                </motion.span>
              )}
            </div>
            <span className="text-xs text-text-light">Karma: {user.karma}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-light mb-4 line-clamp-2">{user.bio}</p>

      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-1 text-text-light"
        >
          <UserIcon className="w-4 h-4" />
          <span className="text-sm">{user.postCount} posts</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-1 text-text-light"
        >
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span className="text-sm">{user.commentCount} comments</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-1 text-text-light"
        >
          <ArrowUpIcon className="w-4 h-4" />
          <span className="text-sm">{user.karma} karma</span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default UserCard; 
