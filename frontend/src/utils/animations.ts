import { gsap } from 'gsap';

// Animation for page entry
export const pageEntryAnimation = (element: string | Element) => {
  gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out',
  });
};

// Animation for staggered items
export const staggeredAnimation = (elements: string | Element[], staggerDelay = 0.1) => {
  gsap.from(elements, {
    opacity: 0,
    y: 20,
    stagger: staggerDelay,
    duration: 0.6,
    ease: 'power2.out',
  });
};

// Impact counter animation
export const countAnimation = (element: string | Element, startValue: number, endValue: number, duration = 2) => {
  let obj = { val: startValue };
  const target = gsap.utils.toArray(element)[0];
  
  if (!target) return;
  
  return gsap.to(obj, {
    val: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: function() {
      if (target instanceof HTMLElement) {
        target.innerHTML = Math.floor(obj.val).toLocaleString();
      }
    },
  });
};

// Heart beat animation
export const heartbeatAnimation = (element: string | Element) => {
  gsap.to(element, {
    scale: 1.15,
    duration: 0.2,
    ease: 'power1.inOut',
    repeat: 1,
    yoyo: true,
  });
};

// Scroll-triggered animation
export const createScrollTrigger = (element: string | Element, animation: gsap.core.Timeline) => {
  return gsap.ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    toggleActions: 'play none none reverse',
    animation: animation,
  });
};

// Animated progress bar
export const animateProgressBar = (element: string | Element, percentage: number) => {
  gsap.to(element, {
    width: `${percentage}%`,
    duration: 1.5,
    ease: 'power2.out',
  });
};

// Donation complete celebration animation
export const celebrationAnimation = () => {
  // Create confetti elements
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(confettiContainer);
  
  // Create confetti pieces
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
  const totalConfetti = 100;
  
  for (let i = 0; i < totalConfetti; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'absolute w-2 h-2 rounded-full';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.top = '50%';
    confetti.style.left = '50%';
    confettiContainer.appendChild(confetti);
    
    // Animate each confetti piece
    gsap.to(confetti, {
      x: `random(-200, 200)`,
      y: `random(-200, 200)`,
      scale: `random(0.5, 1.5)`,
      rotation: `random(0, 360)`,
      opacity: 0,
      duration: `random(1, 2)`,
      ease: 'power3.out',
      onComplete: () => {
        confetti.remove();
        // Remove container when all confetti are done
        if (confettiContainer.childElementCount === 0) {
          confettiContainer.remove();
        }
      },
    });
  }
};

// Hover animation for buttons
export const buttonHoverAnimation = {
  scale: 1.05,
  transition: { duration: 0.2, ease: 'easeInOut' },
};

// Hover animation for cards
export const cardHoverAnimation = {
  y: -5,
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.3, ease: 'easeOut' },
};

// Typewriter effect for text
export const typewriterEffect = (element: string | Element, text: string, speed = 50) => {
  const target = gsap.utils.toArray(element)[0];
  if (!target || !(target instanceof HTMLElement)) return;
  
  let i = 0;
  target.textContent = '';
  
  const typeChar = () => {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    }
  };
  
  typeChar();
};

// Scroll-based parallax effect
export const createParallaxEffect = (element: string | Element, strength = 0.2) => {
  gsap.to(element, {
    y: () => window.innerHeight * strength * -1,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Animation for pulse effect
export const pulseAnimation = (element: string | Element) => {
  gsap.to(element, {
    scale: 1.05,
    opacity: 0.8,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

// Glow effect animation
export const glowAnimation = (element: string | Element, color = '#8B5CF6') => {
  gsap.to(element, {
    boxShadow: `0 0 20px ${color}`,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};