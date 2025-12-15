import { useState, useEffect, useRef } from "react";
import { safeFetch } from "@/lib/fetchUtils";

interface SoundEffects {
  [key: string]: HTMLAudioElement;
}

export default function useGalleryAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);

  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const soundEffects = useRef<SoundEffects>({});

  // Initialize audio elements
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const res = await safeFetch("/api/gaudio");

        const tracks = Array.isArray(res.data?.audioTracks)
          ? res.data.audioTracks
          : [];
        const fallbackBg = "/audio/gallery-background.mp3";

        const findTrack = (predicate: (t: any) => boolean) =>
          tracks.find(predicate)?.url;

        const bgSrc =
          findTrack((t) => t.type === "background" && t.isDefault) ||
          findTrack((t) => t.type === "background") ||
          fallbackBg;

        const hoverSrc =
          findTrack((t) => t.id?.toLowerCase().includes("hover")) ||
          "/audio/hover.mp3";
        const clickSrc =
          findTrack((t) => t.id?.toLowerCase().includes("click")) ||
          "/audio/click.mp3";
        const filterSrc =
          findTrack((t) => t.id?.toLowerCase().includes("transition")) ||
          findTrack((t) => t.id?.toLowerCase().includes("filter")) ||
          "/audio/filter.mp3";

        backgroundMusic.current = new Audio(bgSrc);
        backgroundMusic.current.loop = true;
        backgroundMusic.current.volume = 0.4;

        soundEffects.current = {
          click: new Audio(clickSrc),
          hover: new Audio(hoverSrc),
          filter: new Audio(filterSrc),
        };
      } catch (err) {
        console.error(
          "Failed to load gallery audio config, using fallbacks",
          err
        );
        backgroundMusic.current = new Audio("/audio/gallery-background.mp3");
        backgroundMusic.current.loop = true;
        backgroundMusic.current.volume = 0.4;
        soundEffects.current = {
          click: new Audio("/audio/click.mp3"),
          hover: new Audio("/audio/hover.mp3"),
          filter: new Audio("/audio/filter.mp3"),
        };
      }
    };

    loadAudio();

    return () => {
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current = null;
      }
      Object.values(soundEffects.current).forEach((audio) => {
        audio.pause();
      });
      soundEffects.current = {};
    };
  }, []);

  // Handle background music play/pause
  useEffect(() => {
    if (!backgroundMusic.current) return;

    if (isPlaying) {
      backgroundMusic.current.play().catch((error) => {
        console.error("Error playing background music:", error);
        setIsPlaying(false);
      });
    } else {
      backgroundMusic.current.pause();
    }
  }, [isPlaying]);

  // Handle mute/unmute
  useEffect(() => {
    if (!backgroundMusic.current) return;

    backgroundMusic.current.muted = isMuted;
    Object.values(soundEffects.current).forEach((audio) => {
      audio.muted = isMuted;
    });
  }, [isMuted]);

  // Play sound effect when currentSound changes
  useEffect(() => {
    if (!currentSound || isMuted) return;

    const effect = soundEffects.current[currentSound];
    if (effect) {
      effect.currentTime = 0;
      effect.play().catch(console.error);
    }

    // Reset current sound after playing
    const timeout = setTimeout(() => {
      setCurrentSound(null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentSound, isMuted]);

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return {
    isPlaying,
    isMuted,
    currentSound,
    togglePlay,
    toggleMute,
    setCurrentSound,
  };
}
