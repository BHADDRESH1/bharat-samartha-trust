// File: lib/gsap-setup.ts
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP as useGSAPOriginal } from '@gsap/react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import TextPlugin from 'gsap/TextPlugin'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin)

// Re-export the useGSAP hook
export const useGSAP = useGSAPOriginal

// Custom hook to create GSAP context
export const useGSAPContext = (callback, dependencies = []) => {
  const contextRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(callback, contextRef.current)
    return () => ctx.revert()
  }, dependencies)

  return contextRef
}

// Helper functions for common animations
export const fadeIn = (element, delay = 0, duration = 0.8) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: duration, 
      delay: delay, 
      ease: 'power3.out' 
    }
  )
}

export const staggerItems = (elements, staggerTime = 0.1, duration = 0.8) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: duration, 
      stagger: staggerTime, 
      ease: 'power3.out' 
    }
  )
}

export const shakeElement = (element) => {
  return gsap.to(element, {
    x: [-5, 5, -5, 5, 0],
    duration: 0.4,
    ease: 'power2.inOut'
  })
}

export default gsap