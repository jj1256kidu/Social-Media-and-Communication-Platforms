import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    description: string;
    threadCount: number;
    color: string;
  };
  onSelect: (category: CategoryCardProps['category']) => void;
  onCreateThread: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect,
  onCreateThread,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(category)}
      className="modern-card p-6 cursor-pointer"
      style={{
        borderColor: isHovered ? category.color : 'transparent',
        boxShadow: isHovered ? `0 0 20px ${category.color}40` : 'none',
      }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <motion.span
          animate={{ scale: isHovered ? 1.2 : 1 }}
          className="text-2xl"
        >
          {category.icon}
        </motion.span>
        <h3 className="text-lg font-semibold text-text">{category.name}</h3>
      </div>

      <p className="text-sm text-text-light mb-4">{category.description}</p>

      <div className="flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
          className="text-xs text-text-light"
        >
          {category.threadCount} threads
        </motion.span>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onCreateThread(category.id);
          }}
          className="p-2 rounded-lg"
          style={{
            backgroundColor: isHovered ? `${category.color}20` : 'transparent',
            color: category.color,
          }}
        >
          <PlusIcon className="w-5 h-5" />
        </motion.button>
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

export default CategoryCard; 
