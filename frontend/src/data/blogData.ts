// data/blogData.ts
import { BlogPost } from '@/types/blog';

// Featured blog post
export const featuredBlog: BlogPost = {
  id: '1',
  title: 'The Future of Web Development: What to Expect in 2025',
  slug: 'future-of-web-development-2025',
  excerpt: 'Explore cutting-edge trends shaping the future of web development, from AI integration to immersive experiences and beyond.',
  content: 'Full article content here...',
  coverImage: '/images/blog/featured-web-dev.jpg',
  publishDate: 'March 10, 2025',
  category: 'Web Development',
  tags: ['frontend', 'AI', 'webdev', 'future tech'],
  readTime: 8,
  author: {
    id: 'a1',
    name: 'Alex Morgan',
    avatar: '/images/authors/alex-morgan.jpg',
    bio: 'Senior Web Developer & Tech Enthusiast'
  },
  featured: true,
  audioVersion: '/audio/future-of-web-development.mp3'
};

// Trending blog posts
export const trendingBlogs: BlogPost[] = [
  {
    id: '2',
    title: 'Mastering Next.js 14: Performance Optimization Tips',
    slug: 'mastering-nextjs-14-performance',
    excerpt: 'Learn advanced techniques to optimize your Next.js applications for maximum speed and efficiency.',
    content: 'Full article content here...',
    coverImage: '/images/blog/nextjs-performance.jpg',
    publishDate: 'March 15, 2025',
    category: 'Frontend',
    tags: ['nextjs', 'performance', 'react', 'optimization'],
    readTime: 6,
    author: {
      id: 'a2',
      name: 'Sarah Chen',
      avatar: '/images/authors/sarah-chen.jpg'
    },
    trending: true
  },
  {
    id: '3',
    title: 'The Complete Guide to Framer Motion Animations',
    slug: 'complete-guide-framer-motion',
    excerpt: 'Everything you need to know about creating stunning animations with Framer Motion in your React applications.',
    content: 'Full article content here...',
    coverImage: '/images/blog/framer-motion.jpg',
    publishDate: 'March 12, 2025',
    category: 'Animation',
    tags: ['framer-motion', 'animation', 'react', 'frontend'],
    readTime: 7,
    author: {
      id: 'a3',
      name: 'Marcus Johnson',
      avatar: '/images/authors/marcus-johnson.jpg'
    },
    trending: true
  },
  {
    id: '4',
    title: 'Implementing Dark Mode with Next-Themes',
    slug: 'implementing-dark-mode-next-themes',
    excerpt: 'A step-by-step guide to adding dark mode to your Next.js application using the next-themes library.',
    content: 'Full article content here...',
    coverImage: '/images/blog/dark-mode.jpg',
    publishDate: 'March 8, 2025',
    category: 'UI/UX',
    tags: ['dark-mode', 'next-themes', 'accessibility', 'ui'],
    readTime: 5,
    author: {
      id: 'a4',
      name: 'Priya Patel',
      avatar: '/images/authors/priya-patel.jpg'
    },
    trending: true
  }
];

// All blog posts
export const blogPosts: BlogPost[] = [
  featuredBlog,
  ...trendingBlogs,
  {
    id: '5',
    title: 'Building Accessible Web Applications: A Comprehensive Guide',
    slug: 'building-accessible-web-applications',
    excerpt: 'Learn how to make your web applications accessible to everyone with practical techniques and best practices.',
    content: 'Full article content here...',
    coverImage: '/images/blog/accessibility.jpg',
    publishDate: 'March 5, 2025',
    category: 'Accessibility',
    tags: ['a11y', 'web accessibility', 'inclusivity', 'WCAG'],
    readTime: 9,
    author: {
      id: 'a5',
      name: 'Jordan Lee',
      avatar: '/images/authors/jordan-lee.jpg'
    }
  },
  {
    id: '6',
    title: 'GSAP and React: Creating Advanced Animations',
    slug: 'gsap-react-advanced-animations',
    excerpt: 'Discover how to integrate GSAP with React to create stunning, performance-optimized animations.',
    content: 'Full article content here...',
    coverImage: '/images/blog/gsap-animations.jpg',
    publishDate: 'March 3, 2025',
    category: 'Animation',
    tags: ['gsap', 'animation', 'react', 'frontend'],
    readTime: 8,
    author: {
      id: 'a3',
      name: 'Marcus Johnson',
      avatar: '/images/authors/marcus-johnson.jpg'
    }
  },
  {
    id: '7',
    title: 'Tailwind CSS Strategies for Large Applications',
    slug: 'tailwind-css-large-applications',
    excerpt: 'Best practices for organizing and scaling Tailwind CSS in enterprise-level applications.',
    content: 'Full article content here...',
    coverImage: '/images/blog/tailwind-css.jpg',
    publishDate: 'February 28, 2025',
    category: 'CSS',
    tags: ['tailwind', 'css', 'scaling', 'enterprise'],
    readTime: 6,
    author: {
      id: 'a6',
      name: 'Thomas Wright',
      avatar: '/images/authors/thomas-wright.jpg'
    }
  },
  {
    id: '8',
    title: 'Implementing Real-time Features with WebSockets in Next.js',
    slug: 'real-time-websockets-nextjs',
    excerpt: 'A detailed guide to adding real-time functionality to your Next.js applications using WebSockets.',
    content: 'Full article content here...',
    coverImage: '/images/blog/websockets.jpg',
    publishDate: 'February 25, 2025',
    category: 'Backend',
    tags: ['websockets', 'real-time', 'nextjs', 'backend'],
    readTime: 7,
    author: {
      id: 'a7',
      name: 'Emma Rodriguez',
      avatar: '/images/authors/emma-rodriguez.jpg'
    }
  },
  {
    id: '9',
    title: 'Micro-interactions: Small Details, Big Impact',
    slug: 'micro-interactions-small-details',
    excerpt: 'How to use subtle animations and feedback to enhance user experience and engagement.',
    content: 'Full article content here...',
    coverImage: '/images/blog/micro-interactions.jpg',
    publishDate: 'February 20, 2025',
    category: 'UI/UX',
    tags: ['micro-interactions', 'ux', 'animation', 'design'],
    readTime: 5,
    author: {
      id: 'a4',
      name: 'Priya Patel',
      avatar: '/images/authors/priya-patel.jpg'
    }
  },
  {
    id: '10',
    title: 'State Management in 2025: Beyond Redux',
    slug: 'state-management-beyond-redux',
    excerpt: 'Exploring modern state management solutions and when to use each approach.',
    content: 'Full article content here...',
    coverImage: '/images/blog/state-management.jpg',
    publishDate: 'February 15, 2025',
    category: 'Frontend',
    tags: ['state management', 'redux', 'context', 'zustand'],
    readTime: 8,
    author: {
      id: 'a2',
      name: 'Sarah Chen',
      avatar: '/images/authors/sarah-chen.jpg'
    }
  }
];