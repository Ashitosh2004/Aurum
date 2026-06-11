'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ChevronDown, Star, Users, Coffee, Award } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

// Coffee bean SVG as a reusable shape
function CoffeeBean({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 32 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="16" cy="20" rx="12" ry="17" fill="rgba(196, 154, 42, 0.15)" />
      <path
        d="M16 4C9 4 4 11.5 4 20C4 28.5 9 36 16 36C23 36 28 28.5 28 20C28 11.5 23 4 16 4Z"
        stroke="rgba(196, 154, 42, 0.25)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M16 6C16 6 12 14 12 20C12 26 16 34 16 34"
        stroke="rgba(196, 154, 42, 0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration, start])

  return count
}

// Floating dot particle
function FloatingDot({
  delay,
  duration,
  x,
  y,
  size,
}: {
  delay: number
  duration: number
  x: string
  y: string
  size: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(196, 154, 42, 0.4) 0%, rgba(196, 154, 42, 0) 70%)',
      }}
      animate={{
        y: [0, -20, 10, -15, 0],
        x: [0, 8, -5, 10, 0],
        opacity: [0, 0.6, 0.8, 0.4, 0],
        scale: [0.8, 1.2, 1, 1.3, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Stat item component (must be a separate component to call useAnimatedCounter hook)
function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  index,
  inView,
  isDecimal,
}: {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
  index: number
  inView: boolean
  isDecimal?: boolean
}) {
  const counterRaw = useAnimatedCounter(
    isDecimal ? Math.round(value * 10) : value,
    2000,
    inView
  )
  const displayValue = isDecimal ? (counterRaw / 10).toFixed(1) : counterRaw

  return (
    <motion.div
      className="flex flex-col items-center gap-1 px-5 sm:px-8 py-1 sm:py-0"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.15,
        ease: 'easeOut',
      }}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mb-1.5" />
      <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-cream font-[family-name:var(--font-playfair)] tabular-nums">
        {displayValue}
        <span className="text-gold-400">{suffix}</span>
      </span>
      <span className="text-[10px] sm:text-xs text-cream/40 font-body tracking-wider uppercase">
        {label}
      </span>
    </motion.div>
  )
}

// Configuration for coffee bean particles
const coffeeBeans = [
  { left: '5%', top: '15%', size: 28, animDuration: 7, animDelay: 0, rotation: 30 },
  { left: '85%', top: '20%', size: 22, animDuration: 8, animDelay: 1, rotation: -20 },
  { left: '15%', top: '60%', size: 18, animDuration: 6, animDelay: 0.5, rotation: 45 },
  { left: '90%', top: '65%', size: 24, animDuration: 9, animDelay: 1.5, rotation: -35 },
  { left: '40%', top: '10%', size: 16, animDuration: 7.5, animDelay: 2, rotation: 60 },
  { left: '70%', top: '80%', size: 20, animDuration: 6.5, animDelay: 0.8, rotation: -50 },
  { left: '25%', top: '85%', size: 26, animDuration: 8.5, animDelay: 1.2, rotation: 15 },
  { left: '60%', top: '40%', size: 14, animDuration: 7, animDelay: 2.5, rotation: -70 },
  { left: '50%', top: '75%', size: 20, animDuration: 9.5, animDelay: 0.3, rotation: 40 },
  { left: '10%', top: '40%', size: 16, animDuration: 8, animDelay: 1.8, rotation: -25 },
]

// Configuration for floating dot particles
const dotParticles = [
  { x: '8%', y: '25%', size: 4, delay: 0, duration: 8 },
  { x: '92%', y: '35%', size: 3, delay: 1.5, duration: 7 },
  { x: '20%', y: '70%', size: 5, delay: 0.8, duration: 9 },
  { x: '78%', y: '15%', size: 3, delay: 2, duration: 6 },
  { x: '35%', y: '85%', size: 4, delay: 1.2, duration: 8.5 },
  { x: '65%', y: '55%', size: 3, delay: 0.5, duration: 7.5 },
  { x: '45%', y: '30%', size: 4, delay: 2.5, duration: 10 },
  { x: '55%', y: '90%', size: 3, delay: 1.8, duration: 6.5 },
  { x: '88%', y: '75%', size: 5, delay: 0.3, duration: 8 },
  { x: '12%', y: '50%', size: 3, delay: 2.2, duration: 7 },
  { x: '72%', y: '5%', size: 4, delay: 1, duration: 9 },
  { x: '30%', y: '45%', size: 3, delay: 3, duration: 7.5 },
]

// Stagger animation variants for text
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isStatsInView = useInView(statsRef, { once: true, margin: '-50px' })

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const statsOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [0, 1, 1])

  // Mouse-follow parallax state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const mouseParallaxX = mousePosition.x * 15
  const mouseParallaxY = mousePosition.y * 15

  const stats = [
    { icon: Users, value: 15, suffix: 'K+', label: 'Happy Customers' },
    { icon: Coffee, value: 50, suffix: '+', label: 'Coffee Blends' },
    { icon: Star, value: 4.9, suffix: '', label: 'Rating', isDecimal: true },
    { icon: Award, value: 5, suffix: '', label: 'Years of Excellence' },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 z-0 scale-110"
        style={{ y: backgroundY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/cafe/hero-bg.png)',
          }}
        />
      </motion.div>

      {/* Gradient overlay with additional dark overlay */}
      <motion.div
        className="absolute inset-0 z-[1] gradient-hero"
        style={{
          opacity: overlayOpacity,
          background: 'linear-gradient(180deg, rgba(26, 14, 8, 0.45) 0%, rgba(26, 14, 8, 0.2) 30%, rgba(26, 14, 8, 0.25) 60%, rgba(26, 14, 8, 0.7) 100%)',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26, 14, 8, 0.4) 100%)',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none texture-noise"
        style={{ opacity: 0.4 }}
      />

      {/* Mouse-follow parallax background glow */}
      <motion.div
        className="absolute z-[2] pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 154, 42, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          x: '50%',
          y: '40%',
          left: mouseParallaxX,
          top: mouseParallaxY,
        }}
        transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}
      />

      {/* Floating coffee bean particles */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {coffeeBeans.map((bean, index) => (
          <motion.div
            key={`bean-${index}`}
            className="absolute animate-float"
            style={{
              left: bean.left,
              top: bean.top,
              width: bean.size,
              height: bean.size * 1.25,
              animationDuration: `${bean.animDuration}s`,
              animationDelay: `${bean.animDelay}s`,
              opacity: 0.35,
              transform: `rotate(${bean.rotation}deg)`,
              // Mouse parallax per bean - further beans move more
              x: mouseParallaxX * (0.3 + index * 0.08),
              y: mouseParallaxY * (0.3 + index * 0.08),
            }}
            transition={{
              type: 'tween',
              duration: 0.6,
              ease: 'easeOut',
            }}
          >
            <CoffeeBean style={{ width: '100%', height: '100%' }} />
          </motion.div>
        ))}
      </div>

      {/* Floating dot particles */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {dotParticles.map((dot, index) => (
          <FloatingDot
            key={`dot-${index}`}
            x={dot.x}
            y={dot.y}
            size={dot.size}
            delay={dot.delay}
            duration={dot.duration}
          />
        ))}
      </div>

      {/* Main content with scroll parallax */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center"
        style={{ y: textY }}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative top accent line */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            variants={childVariants}
          >
            <div
              className="h-[1px] w-12 sm:w-20"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(196, 154, 42, 0.6))' }}
            />
            <Coffee
              className="w-4 h-4 text-gold-400"
              style={{ opacity: 0.7 }}
            />
            <div
              className="h-[1px] w-12 sm:w-20"
              style={{ background: 'linear-gradient(270deg, transparent, rgba(196, 154, 42, 0.6))' }}
            />
          </motion.div>

          {/* Overline text */}
          <motion.p
            className="text-xs sm:text-sm font-body tracking-[0.25em] uppercase mb-6"
            style={{ color: 'rgba(212, 168, 67, 0.8)' }}
            variants={childVariants}
          >
            Artisan Coffee Experience
          </motion.p>

          {/* Main headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 font-[family-name:var(--font-playfair)]"
            style={{ color: '#fefcf7' }}
            variants={childVariants}
          >
            Crafted with Passion,{' '}
            <span
              className="relative inline-block"
            >
              Served with Love
              {/* Gold underline accent */}
              <motion.span
                className="absolute -bottom-2 left-0 h-[2px] w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #c49a2a, #d4a843, #c49a2a, transparent)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-body"
            style={{ color: 'rgba(254, 252, 247, 0.7)' }}
            variants={childVariants}
          >
            Experience the art of artisan coffee in an ambiance that inspires
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            variants={childVariants}
          >
            {/* Primary CTA - Gold gradient */}
            <motion.a
              href="#menu"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide overflow-hidden magnetic-btn shine-effect"
              style={{
                color: '#1a0e08',
              }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Gold gradient background */}
              <span
                className="absolute inset-0 rounded-full gradient-gold"
              />
              {/* Hover shadow glow */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: '0 8px 32px rgba(196, 154, 42, 0.4), 0 2px 8px rgba(196, 154, 42, 0.2)',
                }}
              />
              <span className="relative z-10">Explore Our Menu</span>
            </motion.a>

            {/* Secondary CTA - Glass effect */}
            <motion.a
              href="#reserve"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full text-sm sm:text-base font-semibold tracking-wide overflow-hidden magnetic-btn"
              style={{
                color: '#fefcf7',
              }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Glass background */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(254, 252, 247, 0.15)',
                }}
              />
              {/* Hover brightened glass */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(254, 252, 247, 0.25)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Reserve a Table
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-gold-400"
                />
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.span
            className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-body"
            style={{ color: 'rgba(254, 252, 247, 0.4)' }}
          >
            Scroll to Discover
          </motion.span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown
              className="w-5 h-5"
              style={{ color: 'rgba(196, 154, 42, 0.6)' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Statistics bar at the bottom */}
      <motion.div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ opacity: statsOpacity }}
      >
        <div
          className="max-w-4xl mx-auto rounded-2xl py-5 sm:py-6 px-2 sm:px-4"
          style={{
            background: 'rgba(26, 14, 8, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(254, 252, 247, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:divide-x divide-cream/10">
            {stats.map((stat, index) => (
              <StatItem
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                index={index}
                inView={isStatsInView}
                isDecimal={stat.isDecimal}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}