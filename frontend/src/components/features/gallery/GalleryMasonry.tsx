// FILE: /components/features/gallery/GalleryMasonry.tsx
'use client'

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Types
import { GalleryItem } from '@/types/gallery';

interface GalleryMasonryProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

export default function GalleryMasonry({ items, onItemClick }: GalleryMasonryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate gallery items on scroll
    if (galleryRef.current) {
      gsap.fromTo(
        '.gallery-item',
        { 
          opacity: 0,
          y: 40 
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [items]);
  
  // Split items into 3 columns for masonry layout
  const columnCount = 3;
  const columnsItems: GalleryItem[][] = Array.from({ length: columnCount }, () => []);
  
  items.forEach((item, index) => {
    columnsItems[index % columnCount].push(item);
  });
  
  // Item hover animations
  const itemVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div ref={galleryRef} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columnsItems.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex flex-col space-y-6">
            {column.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`gallery-${item.id}`}
                className="gallery-item relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                variants={itemVariants}
                whileHover="hover"
                onClick={() => onItemClick(item)}
              >
                <div className="relative pb-[75%]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-200">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
