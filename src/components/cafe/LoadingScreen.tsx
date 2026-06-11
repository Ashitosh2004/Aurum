'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafe-store';

export default function LoadingScreen() {
  const { isLoading, loadingProgress, setLoading, setLoadingProgress } = useCafeStore();
  const [showTagline, setShowTagline] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);

  const logoText = 'AURUM COFFEE';

  // Start tagline reveal after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTagline(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Animate progress bar and complete loading after 4s
  useEffect(() => {
    if (!progressStarted) return;

    const duration = 4000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Easing: slow at start, fast in middle, slow at end
      const raw = currentStep / steps;
      const eased = raw < 0.5
        ? 4 * raw * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      const progress = Math.min(100, Math.round(eased * 100));

      setLoadingProgress(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Brief pause at 100% before dismissing
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [progressStarted, setLoading, setLoadingProgress]);

  // Start progress animation shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressStarted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#1a0e08' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
          }}
          transition={{
            exit: {
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
          }}
        >
          {/* Subtle radial glow behind the cup */}
          <div
            className="absolute rounded-full blur-[100px] pointer-events-none"
            style={{
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(196, 154, 42, 0.15) 0%, transparent 70%)',
            }}
          />

          {/* Coffee Cup SVG */}
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <svg
              width="120"
              height="140"
              viewBox="0 0 120 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              {/* Cup body */}
              <path
                d="M20 40 H85 L78 120 Q76 130 66 130 H39 Q29 130 27 120 Z"
                stroke="#c49a2a"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Cup rim */}
              <rect
                x="16"
                y="36"
                width="73"
                height="8"
                rx="4"
                stroke="#c49a2a"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Handle */}
              <path
                d="M85 55 Q110 55 110 80 Q110 105 85 105"
                stroke="#c49a2a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Coffee fill (animated via cup-fill class) */}
              <defs>
                <linearGradient id="coffeeGradient" x1="52" y1="44" x2="52" y2="130" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#c49a2a" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#a67c00" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7a5230" stopOpacity="0.7" />
                </linearGradient>
                <clipPath id="cupClip">
                  <path d="M22 44 H83 L77 118 Q75 127 66 127 H40 Q31 127 29 118 Z" />
                </clipPath>
              </defs>
              <rect
                x="18"
                y="40"
                width="70"
                height="92"
                fill="url(#coffeeGradient)"
                clipPath="url(#cupClip)"
                className="cup-fill"
              />

              {/* Coffee surface shine */}
              <ellipse
                cx="52"
                cy="48"
                rx="28"
                ry="4"
                fill="#d4a843"
                opacity="0.4"
                className="cup-fill"
                clipPath="url(#cupClip)"
              />

              {/* Saucer */}
              <ellipse
                cx="52"
                cy="133"
                rx="50"
                ry="6"
                stroke="#c49a2a"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* Steam particles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 flex gap-3 z-20">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-steam-rise"
                  style={{
                    animationDelay: `${i * 0.8}s`,
                    width: '8px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to top, rgba(196, 154, 42, 0.4), rgba(196, 154, 42, 0))',
                    filter: 'blur(2px)',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Logo text - letter by letter animation */}
          <div className="relative mb-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-[0.3em] text-center"
              style={{ color: '#fefcf7' }}
            >
              {logoText.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.08,
                    ease: 'easeOut',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </h1>

            {/* Gold underline accent */}
            <motion.div
              className="mx-auto mt-2 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #c49a2a, transparent)',
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '60%', opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="text-sm sm:text-base font-body tracking-[0.15em] uppercase text-center mb-12"
            style={{ color: 'rgba(254, 252, 247, 0.6)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={showTagline ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Where every cup tells a story
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="w-56 sm:w-64 md:w-72"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Progress track */}
            <div
              className="relative h-[2px] rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(254, 252, 247, 0.1)' }}
            >
              {/* Progress fill */}
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #a67c00, #c49a2a, #d4a843)',
                  boxShadow: '0 0 12px rgba(196, 154, 42, 0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Percentage text */}
            <div className="flex justify-between items-center mt-3">
              <span
                className="text-[10px] font-body tracking-[0.2em] uppercase"
                style={{ color: 'rgba(254, 252, 247, 0.3)' }}
              >
                Loading
              </span>
              <span
                className="text-xs font-body tabular-nums"
                style={{ color: '#c49a2a' }}
              >
                {loadingProgress}%
              </span>
            </div>
          </motion.div>

          {/* Decorative corner elements */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t border-l opacity-20" style={{ borderColor: '#c49a2a' }} />
          <div className="absolute top-8 right-8 w-12 h-12 border-t border-r opacity-20" style={{ borderColor: '#c49a2a' }} />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l opacity-20" style={{ borderColor: '#c49a2a' }} />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r opacity-20" style={{ borderColor: '#c49a2a' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}