// FILE: /types/gallery.ts

export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    image: string;
    video?: string;
    type: 'image' | 'video';
    featured: boolean;
  }