'use client'

import { useEffect, useRef } from 'react';

export default function useSoundEffects(enabled: boolean) {
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      hoverSoundRef.current = new Audio('/sounds/hover.mp3');
      clickSoundRef.current = new Audio('/sounds/click.mp3');
      
      // Preload sounds
      hoverSoundRef.current.load();
      clickSoundRef.current.load();
      
      // Set volume
      if (hoverSoundRef.current) hoverSoundRef.current.volume = 0.2;
      if (clickSoundRef.current) clickSoundRef.current.volume = 0.3;
    }
    
    return () => {
      hoverSoundRef.current = null;
      clickSoundRef.current = null;
    };
  }, []);

  const playHoverSound = () => {
    if (enabled && hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  const playClickSound = () => {
    if (enabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  return { playHoverSound, playClickSound };
}