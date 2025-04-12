import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface ThreadCardProps {
  title: string;
  author: string;
  content: string;
  category: string;
  upvotes: number;
  comments: number;
  createdAt: string;
  onUpvote: () => void;
  onDownvote: () => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  title,
  author,
  content,
  category,
  upvotes,
  comments,
  createdAt,
  onUpvote,
  onDownvote,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button
            onClick={onUpvote}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowUpIcon className="h-5 w-5 text-gray-500 hover:text-green-500" />
          </button>
          <span className="text-sm font-medium">{upvotes}</span>
          <button
            onClick={onDownvote}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowDownIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </button>
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
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard; 
