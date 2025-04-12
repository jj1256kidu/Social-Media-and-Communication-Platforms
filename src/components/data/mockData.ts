import { User, Category, Thread, Comment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    karma: 1500,
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    username: 'janedoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    karma: 2300,
    joinDate: '2022-11-20',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    description: 'Discussions about programming, hardware, and software',
    postCount: 1250,
  },
  {
    id: '2',
    name: 'Lifestyle',
    description: 'General lifestyle discussions and advice',
    postCount: 850,
  },
  {
    id: '3',
    name: 'Questions',
    description: 'Ask and answer questions about anything',
    postCount: 2100,
  },
];

export const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Best practices for React state management in 2024',
    content: 'I\'ve been using Redux for years, but I\'m curious about newer solutions like Zustand and Jotai. What are your experiences?',
    author: mockUsers[0],
    category: mockCategories[0],
    upvotes: 45,
    downvotes: 2,
    comments: [],
    createdAt: '2024-03-15T10:30:00Z',
    tags: ['react', 'state-management', 'frontend'],
  },
  {
    id: '2',
    title: 'How do you maintain work-life balance as a developer?',
    content: 'I\'ve been struggling with burnout lately. Looking for tips on how to better manage my time and energy.',
    author: mockUsers[1],
    category: mockCategories[1],
    upvotes: 38,
    downvotes: 1,
    comments: [],
    createdAt: '2024-03-14T15:45:00Z',
    tags: ['work-life-balance', 'productivity', 'mental-health'],
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    author: mockUsers[1],
    content: 'I\'ve switched to Zustand recently and it\'s been a game-changer. Much simpler than Redux!',
    upvotes: 12,
    createdAt: '2024-03-15T11:00:00Z',
  },
  {
    id: '2',
    author: mockUsers[0],
    content: 'I try to follow the Pomodoro technique and take regular breaks. Also, setting clear boundaries between work and personal time helps a lot.',
    upvotes: 8,
    createdAt: '2024-03-14T16:30:00Z',
  },
]; 
