'use client'

import { useRef, useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const ParticleBackground = () => {
  const { theme } = useTheme()
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const [isClient, setIsClient] = useState(false)
  const isDarkMode = theme === 'dark'

  // Initialize client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles - Math.random() is now safely within useEffect
    const initParticles = () => {
      particles = []
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1
        })
      }
      
      particlesRef.current = particles
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw and update particles
      particles.forEach((particle, i) => {
        // Set color based on theme
        const baseColor = isDarkMode ? '74, 144, 226' : '59, 130, 246'
        ctx.fillStyle = `rgba(${baseColor}, ${particle.opacity})`
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }
        
        // Connect particles that are close to each other
        particles.forEach((particle2, j) => {
          if (i !== j) {
            const dx = particle.x - particle2.x
            const dy = particle.y - particle2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 100) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(${baseColor}, ${0.1 * (1 - distance / 100)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(particle2.x, particle2.y)
              ctx.stroke()
            }
          }
        })
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }

    // Set up
    handleResize()
    window.addEventListener('resize', handleResize)
    animate()

    // Add GSAP animation for subtle background shift
    gsap.to(canvas, {
      backgroundPositionX: '+=10',
      backgroundPositionY: '+=10',
      duration: 20,
      repeat: -1,
      ease: 'none',
      yoyo: true
    })

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme, isClient])

  // Don't render until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <motion.canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.4) 0%, rgba(226, 232, 240, 0.8) 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    )
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{
        background: isDarkMode
          ? 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)'
          : 'radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.4) 0%, rgba(226, 232, 240, 0.8) 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}

export default ParticleBackground