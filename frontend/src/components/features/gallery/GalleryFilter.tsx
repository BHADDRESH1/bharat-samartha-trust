// FILE: /components/features/gallery/GalleryFilter.tsx
"use client";

import { motion } from "framer-motion";

interface GalleryFilterProps {
  selectedCategory: string;
  onChange: (category: string) => void;
  categories: Array<{ id: string; label: string; count?: number }>;
}

export default function GalleryFilter({
  selectedCategory,
  onChange,
  categories,
}: GalleryFilterProps) {
  const fallbackCategories = [{ id: "all", label: "All" }];

  const finalCategories =
    categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="flex flex-wrap gap-3">
      {finalCategories.map((category) => (
        <motion.button
          key={category.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onChange(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.label}
          {typeof category.count === "number" ? ` (${category.count})` : ""}
        </motion.button>
      ))}
    </div>
  );
}
