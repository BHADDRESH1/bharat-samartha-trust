"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";

// Components
import GalleryHero from "@/components/features/gallery/GalleryHero";
import GalleryMasonry from "@/components/features/gallery/GalleryMasonry";
import GalleryRotator from "@/components/features/gallery/GalleryRotator";
import GalleryLightbox from "@/components/features/gallery/GalleryLightbox";
import GalleryFilter from "@/components/features/gallery/GalleryFilter";
import GalleryAudioControls from "@/components/features/gallery/GalleryAudioControls";
import FloatingDonateButton from "@/components/ui/FloatingDonateButton";
import ChatbotButton from "@/components/features/ChatbotButton";

// Hooks
import useGalleryAudio from "@/hooks/useGalleryAudio";

// Types
import { GalleryItem } from "@/types/gallery";
import { safeFetch } from "@/lib/fetchUtils";
import { galleryItems as fallbackGalleryItems } from "@/data/galleryData";

export default function GalleryPage() {
  // State for gallery functionality
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [categories, setCategories] = useState<
    Array<{ id: string; label: string; count?: number }>
  >([{ id: "all", label: "All" }]);

  // Refs for animations
  const galleryRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Media query for responsive design
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Audio hooks
  const {
    isPlaying,
    togglePlay,
    toggleMute,
    isMuted,
    currentSound,
    setCurrentSound,
  } = useGalleryAudio();

  // Fetch gallery items and categories from backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          safeFetch("/api/gpage/items", { timeout: 5000 }),
          safeFetch("/api/gpage/categories", { timeout: 5000 }),
        ]);

        const fallbackImage =
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

        // Check if we have valid API data
        if (itemsRes.success && Array.isArray(itemsRes.data) && itemsRes.data.length > 0) {
          const normalizedItems: GalleryItem[] = itemsRes.data.map((item: any, index: number) => ({
            id: item._id || item.id || `item-${index}`,
            title: item.title || "Untitled",
            description: item.description || "",
            category: item.category?.name || "Uncategorized",
            date: item.uploadDate
              ? new Date(item.uploadDate).toISOString()
              : new Date().toISOString(),
            image:
              item.image || item.imageUrl || item.thumbnail || fallbackImage,
            type: "image",
            featured: Boolean(item.featured),
          }));

          const normalizedCategories = Array.isArray(categoriesRes.data)
            ? categoriesRes.data.map((cat: any, index: number) => ({
                id: cat._id || cat.id || `cat-${index}`,
                label: cat.name || "Uncategorized",
              }))
            : [];

          const counts = normalizedCategories.map((cat) => ({
            ...cat,
            count: normalizedItems.filter((item) => item.category === cat.label)
              .length,
          }));

          const finalCategories = [
            { id: "all", label: "All", count: normalizedItems.length },
            ...counts,
          ];

          setAllItems(normalizedItems);
          setFilteredItems(normalizedItems);
          setCategories(finalCategories);
          console.log('Using API data for gallery');
        } else {
          // Use fallback data
          console.log('API failed or no data, using fallback gallery items');
          setAllItems(fallbackGalleryItems);
          setFilteredItems(fallbackGalleryItems);
          
          // Create categories from fallback data
          const fallbackCategories = Array.from(
            new Set(fallbackGalleryItems.map(item => item.category))
          ).map((cat, index) => ({
            id: cat.toLowerCase().replace(/\s+/g, '-'),
            label: cat,
            count: fallbackGalleryItems.filter(item => item.category === cat).length
          }));
          
          setCategories([
            { id: "all", label: "All", count: fallbackGalleryItems.length },
            ...fallbackCategories,
          ]);
        }
      } catch (err) {
        console.error(
          "Failed to load gallery from API, using fallback data",
          err
        );
        setAllItems(fallbackGalleryItems);
        setFilteredItems(fallbackGalleryItems);
        
        // Create categories from fallback data
        const fallbackCategories = Array.from(
          new Set(fallbackGalleryItems.map(item => item.category))
        ).map((cat, index) => ({
          id: cat.toLowerCase().replace(/\s+/g, '-'),
          label: cat,
          count: fallbackGalleryItems.filter(item => item.category === cat).length
        }));
        
        setCategories([
          { id: "all", label: "All", count: fallbackGalleryItems.length },
          ...fallbackCategories,
        ]);
      }
    };

    fetchGallery();
  }, []);

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize ScrollTrigger animations
    const heroAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    heroAnimation.to(".hero-content", {
      y: 100,
      opacity: 0.5,
      ease: "none",
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Filter items when category changes
  useEffect(() => {
    const newFilteredItems =
      selectedCategory === "all"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory);

    setFilteredItems(newFilteredItems);
  }, [selectedCategory, allItems]);

  // Handle item selection for lightbox
  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setLightboxOpen(true);
    // Play sound effect
    setCurrentSound("click");
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentSound("filter");
  };

  // Toggle autoplay
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <GalleryHero />
      </section>

      {/* Gallery Controls */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <GalleryFilter
            selectedCategory={selectedCategory}
            categories={categories}
            onChange={handleCategoryChange}
          />

          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <GalleryAudioControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              isAutoPlay={isAutoPlay}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onToggleAutoPlay={toggleAutoPlay}
            />
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section
        ref={galleryRef}
        className="py-12 md:py-20 bg-gray-50"
        data-sound="hover"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Impact in Pictures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Witness the transformative power of kindness through our visual
              journey.
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <GalleryMasonry items={filteredItems} onItemClick={handleItemClick} />
        </div>
      </section>

      {/* 3D Rotating Gallery */}
      <section
        ref={rotatorRef}
        className="py-16 md:py-24 bg-gray-900 text-white overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Featured Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our most impactful moments in this interactive display.
            </p>
          </motion.div>

          <GalleryRotator autoPlay={isAutoPlay} onItemClick={handleItemClick} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Be Part of Our Story
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join us in making a difference. Your contribution can be the next
              inspiring image in our gallery.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href="/donate"
                className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Donate Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedItem && (
          <GalleryLightbox item={selectedItem} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      {/* Floating UI Elements */}
      <FloatingDonateButton />
      <ChatbotButton />
    </main>
  );
}
