'use client'

import { useState, useEffect } from 'react';

type LayoutType = 'grid' | 'list';

export default function useLayout() {
  const [layout, setLayout] = useState<LayoutType>('grid');

  // Load saved layout preference from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('blogLayout');
    if (savedLayout === 'grid' || savedLayout === 'list') {
      setLayout(savedLayout as LayoutType);
    }
  }, []);

  // Save layout preference when it changes
  useEffect(() => {
    localStorage.setItem('blogLayout', layout);
  }, [layout]);

  return { layout, setLayout };
}