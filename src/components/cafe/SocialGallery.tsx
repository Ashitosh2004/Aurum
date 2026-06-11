'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight, Instagram, Camera, Hash } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface GalleryItem {
  id: number
  src: string
  alt: string
  caption: string
  likes: number
  comments: number
  height: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: '/images/cafe/product-1.png',
    alt: 'Signature Espresso',
    caption: 'Our signature espresso — bold, smooth, unforgettable. Every sip tells a story of carefully sourced beans. ☕✨',
    likes: 2847,
    comments: 134,
    height: 'h-[300px]',
  },
  {
    id: 2,
    src: '/images/cafe/atmosphere.png',
    alt: 'Café Atmosphere',
    caption: 'Where every corner is Instagram-worthy. Our warm ambiance invites you to stay a little longer. 🏛️',
    likes: 5231,
    comments: 312,
    height: 'h-[250px]',
  },
  {
    id: 3,
    src: '/images/cafe/product-2.png',
    alt: 'Golden Cappuccino',
    caption: 'The Golden Cappuccino — our most beloved creation. Latte art that warms the soul. 🎨☕',
    likes: 4102,
    comments: 267,
    height: 'h-[350px]',
  },
  {
    id: 4,
    src: '/images/cafe/story-2.png',
    alt: 'Our Story',
    caption: 'From a small roastery to your favorite corner — our journey has been nothing short of magical. 📖',
    likes: 6789,
    comments: 456,
    height: 'h-[280px]',
  },
  {
    id: 5,
    src: '/images/cafe/product-3.png',
    alt: 'Cold Brew Collection',
    caption: 'Summer never tasted this good. Our cold brew collection is now available! 🧊🍋',
    likes: 3156,
    comments: 189,
    height: 'h-[200px]',
  },
  {
    id: 6,
    src: '/images/cafe/product-4.png',
    alt: 'Matcha Latte',
    caption: 'When East meets West in a cup. Premium matcha paired with our silky oat milk. 🍵💚',
    likes: 3890,
    comments: 234,
    height: 'h-[320px]',
  },
  {
    id: 7,
    src: '/images/cafe/product-5.png',
    alt: 'Pastry Perfection',
    caption: 'Freshly baked every morning by our in-house pastry chef. The perfect companion to your coffee. 🥐✨',
    likes: 4567,
    comments: 298,
    height: 'h-[240px]',
  },
  {
    id: 8,
    src: '/images/cafe/hero-bg.png',
    alt: 'Aurum Experience',
    caption: 'This is the Aurum experience. Luxury in every detail, warmth in every moment. ✨🤎',
    likes: 8923,
    comments: 567,
    height: 'h-[300px]',
  },
  {
    id: 9,
    src: '/images/cafe/product-6.png',
    alt: 'Caramel Macchiato',
    caption: 'Layers of perfection. Our caramel macchiato is a symphony of flavors. 🍮☕',
    likes: 2345,
    comments: 156,
    height: 'h-[260px]',
  },
  {
    id: 10,
    src: '/images/cafe/product-7.png',
    alt: 'Single Origin Pour Over',
    caption: 'Single origin, single perfection. Taste the terroir in every drop. 🌍💧',
    likes: 1987,
    comments: 123,
    height: 'h-[340px]',
  },
  {
    id: 11,
    src: '/images/cafe/product-8.png',
    alt: 'Affogato Delight',
    caption: 'The marriage of gelato and espresso — our affogato is pure indulgence. 🍦☕',
    likes: 3678,
    comments: 245,
    height: 'h-[220px]',
  },
  {
    id: 12,
    src: '/images/cafe/product-10.png',
    alt: 'Seasonal Special',
    caption: 'Limited edition seasonal blend — available this month only! Don\'t miss out. 🍂✨',
    likes: 7234,
    comments: 412,
    height: 'h-[290px]',
  },
]

const trendingHashtags = [
  '#AurumCoffee',
  '#ArtisanCoffee',
  '#CoffeeLovers',
  '#SpecialtyCoffee',
  '#LatteArt',
  '#CoffeeCulture',
  '#CafeLife',
  '#BaristaLife',
  '#CoffeeGram',
  '#GoldStandard',
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function SocialGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const selectedItem = selectedIndex !== null ? galleryItems[selectedIndex] : null

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length)
  }, [selectedIndex])

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! + 1) % galleryItems.length)
  }, [selectedIndex])

  const handleLike = (itemId: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
        toast('Removed like')
      } else {
        next.add(itemId)
        toast('Liked! ❤️')
      }
      return next
    })
  }

  const handleClose = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, handleClose, handlePrev, handleNext])

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" id="social-gallery">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Instagram className="w-6 h-6 text-gold-500" />
          <span className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground">
            @aurumcoffee
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] text-foreground mb-4">
          Follow Our Journey
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          A visual diary of craft, community, and the perfect cup. Join 125K+ coffee enthusiasts
          who share our passion for the extraordinary.
        </p>
      </motion.div>

      {/* Masonry Gallery */}
      <div className="masonry-grid">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
            className="break-inside-avoid mb-4"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative rounded-xl overflow-hidden cursor-pointer group shadow-soft"
              onClick={() => setSelectedIndex(index)}
            >
              {/* Image */}
              <div className={`${item.height} w-full relative overflow-hidden`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-6 text-white">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(item.id)
                      }}
                      className="flex items-center gap-2 transition-colors"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          likedItems.has(item.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                      <span className="text-sm font-semibold">
                        {(likedItems.has(item.id) ? item.likes + 1 : item.likes).toLocaleString()}
                      </span>
                    </motion.button>

                    <div className="flex items-center gap-2 text-white">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm font-semibold">
                        {item.comments.toLocaleString()}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toast('Link copied to clipboard! 🔗')
                      }}
                      className="flex items-center gap-2 text-white transition-colors"
                    >
                      <Share2 className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-1 text-white/80 text-xs font-medium">
                    <Camera className="w-3 h-3" />
                    <span>@aurumcoffee</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Social Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 mb-12"
      >
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] text-foreground font-bold">
            <AnimatedCounter target={125} suffix="K" />
          </p>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide uppercase">Followers</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] text-foreground font-bold">
            <AnimatedCounter target={2} suffix=".4K" />
          </p>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide uppercase">Posts</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] text-foreground font-bold">
            <AnimatedCounter target={89} suffix="K" />
          </p>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide uppercase">Engagement</p>
        </div>
      </motion.div>

      {/* Trending Hashtags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 mb-12"
      >
        <Hash className="w-5 h-5 text-gold-500" />
        {trendingHashtags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            whileHover={{ scale: 1.08, borderColor: 'rgba(196, 154, 42, 0.6)' }}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground cursor-default transition-colors hover:text-gold-600 hover:border-gold-500/60 select-none"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Follow Us CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <motion.a
          href="https://instagram.com/aurumcoffee"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 gradient-gold text-white font-semibold px-8 py-4 rounded-full text-lg shadow-float transition-shadow hover:shadow-premium"
        >
          <Instagram className="w-5 h-5" />
          Follow Us on Instagram
        </motion.a>
      </motion.div>

      {/* Full-screen Preview Modal */}
      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={handleClose}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Navigation Arrows */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-2 md:left-6 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row rounded-2xl overflow-hidden bg-coffee-900/95 border border-white/10 shadow-2xl"
            >
              {/* Image */}
              <div className="relative w-full md:w-3/5 aspect-square md:aspect-auto flex-shrink-0 bg-black/50">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Panel */}
              <div className="w-full md:w-2/5 flex flex-col p-6 md:p-8 overflow-y-auto max-h-[40vh] md:max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">aurumcoffee</p>
                    <p className="text-white/50 text-xs">Aurum Coffee Co.</p>
                  </div>
                </div>

                {/* Caption */}
                <div className="flex-1 mb-6">
                  <p className="text-white/90 text-sm leading-relaxed">
                    <span className="font-semibold text-gold-400 mr-2">aurumcoffee</span>
                    {selectedItem.caption}
                  </p>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(selectedItem.id)}
                    className="flex items-center gap-2 transition-colors"
                    aria-label="Like"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        likedItems.has(selectedItem.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white hover:text-red-400'
                      }`}
                    />
                    <span className="text-white/70 text-sm font-medium">
                      {(likedItems.has(selectedItem.id) ? selectedItem.likes + 1 : selectedItem.likes).toLocaleString()}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toast('Comments coming soon! 💬')}
                    className="flex items-center gap-2 transition-colors"
                    aria-label="Comment"
                  >
                    <MessageCircle className="w-6 h-6 text-white hover:text-white/70 transition-colors" />
                    <span className="text-white/70 text-sm font-medium">
                      {selectedItem.comments.toLocaleString()}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toast('Shared to your story! 📤')}
                    className="flex items-center gap-2 transition-colors ml-auto"
                    aria-label="Share"
                  >
                    <Share2 className="w-6 h-6 text-white hover:text-white/70 transition-colors" />
                  </motion.button>
                </div>

                {/* Timestamp */}
                <p className="text-white/30 text-xs mt-4">
                  2 hours ago
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}