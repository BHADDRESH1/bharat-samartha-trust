// types/blog.ts

export interface Author {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
  }
  
  export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    publishDate: string;
    category: string;
    tags: string[];
    readTime: number;
    author: Author;
    featured?: boolean;
    trending?: boolean;
    audioVersion?: string;
  }