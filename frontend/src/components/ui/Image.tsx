// components/ui/Image.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function SafeImage({ src, alt, width = 300, height = 200, className = '' }: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Default fallback image - you can use a placeholder or a local image
  const fallbackImage = '/images/placeholder.jpg'; // Make sure this exists in your public folder
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageError ? fallbackImage : src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}