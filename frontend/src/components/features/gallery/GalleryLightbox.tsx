// FILE: /components/features/gallery/GalleryLightbox.tsx
'use client'
import { AnimatePresence } from 'framer-motion';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

// Types
import { GalleryItem } from '@/types/gallery';

// Mock data
import { galleryItems } from '@/data/galleryData';

interface GalleryLightboxProps {
  item: GalleryItem;
  onClose: () => void;
}

export default function GalleryLightbox({ item, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  // Find the current item index
  useEffect(() => {
    const index = galleryItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [item.id]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      } else if (e.key === 'i') {
        setShowInfo(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, onClose]);
  
  // Navigation functions
  const navigateNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };
  
  const navigatePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };
  
  // Current item
  const currentItem = galleryItems[currentIndex];
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };
  
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      
      {/* Info button */}
      <button
        className="absolute top-4 left-4 text-white z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        onClick={() => setShowInfo(prev => !prev)}
      >
        <Info size={24} />
      </button>
      
      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        onClick={navigatePrev}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        onClick={navigateNext}
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Main content */}
      <motion.div
        className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        layoutId={`gallery-${currentItem.id}`}
      >
        <div className="relative w-full h-full">
          {currentItem.type === 'image' ? (
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <video
              src={currentItem.video}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          )}
        </div>
      </motion.div>
      
      {/* Info overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">{currentItem.title}</h2>
            <p className="text-sm mb-1">Category: {currentItem.category}</p>
            <p className="text-sm mb-3">Date: {currentItem.date}</p>
            <p className="text-base">{currentItem.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}