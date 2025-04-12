import React from 'react';
import { motion } from 'framer-motion';
import { mockCategories } from '../data/mockData';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="glass-card rounded-xl p-6 sticky top-24">
      <h2 className="text-xl font-bold cyber-text mb-6 flex items-center">
        Categories
        <span className="ml-2 animate-pulse">_</span>
      </h2>
      <div className="space-y-3">
        {mockCategories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full glass-button rounded-xl transition-all duration-300 ${
              selectedCategory === category.id
                ? 'border-cyan-400/50 text-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'hover:border-purple-400/50 hover:text-purple-400'
            }`}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{category.name}</span>
                <motion.span 
                  className="text-xs glass-card px-2 py-1 rounded-full"
                  whileHover={{ scale: 1.1 }}
                >
                  {category.postCount}
                </motion.span>
              </div>
              <p className="text-sm mt-2 text-gray-400">
                {category.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar; 
