export interface User {
  id: string;
  username: string;
  avatar: string;
  karma: number;
  joinDate: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  upvotes: number;
  createdAt: string;
  replies?: Comment[];
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  category: Category;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  createdAt: string;
  tags: string[];
} 
