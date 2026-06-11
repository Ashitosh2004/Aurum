'use client';

import { reviews } from '@/lib/cafe-data';
import { motion, useInView } from 'framer-motion';
import { Star, ThumbsUp, Camera, Play, Sparkles, Quote } from 'lucide-react';
import { useRef, useState } from 'react';

const ratingBreakdown = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const mentionedKeywords = [
  'Amazing Coffee',
  'Great Atmosphere',
  'Friendly Staff',
  'Best Latte',
  'Fresh Pastries',
  'Cozy Vibes',
  'Premium Quality',
  'Beautiful Decor',
];

const photoImages = [
  '/images/cafe/product-1.png',
  '/images/cafe/product-2.png',
  '/images/cafe/product-3.png',
  '/images/cafe/product-5.png',
  '/images/cafe/product-7.png',
  '/images/cafe/product-8.png',
];

function RatingStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i <= rating
              ? 'fill-[#c49a2a] text-[#c49a2a]'
              : 'fill-transparent text-[#c49a2a]/30'
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({
  stars,
  percent,
  isInView,
  delay,
}: {
  stars: number;
  percent: number;
  isInView: boolean;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-coffee-700 w-14 text-right">
        {stars} star
      </span>
      <div className="flex-1 h-2.5 bg-coffee-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-gold"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10">{percent}%</span>
    </div>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: (typeof reviews)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const isLong = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className={`break-inside-avoid mb-4 rounded-xl bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-float ${
        isLong ? '' : ''
      }`}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-[#c49a2a]/20 mb-3" />

      {/* Avatar + Name + Date */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full gradient-coffee flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {review.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-coffee-900 text-sm">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-3">
        <RatingStars rating={review.rating} />
      </div>

      {/* Review text */}
      <p className="text-sm text-coffee-800 leading-relaxed mb-4">
        {review.text}
      </p>

      {/* Item badge */}
      <div className="inline-flex items-center gap-1.5 bg-coffee-50 border border-coffee-200/60 rounded-full px-3 py-1 mb-4">
        <Camera className="w-3 h-3 text-[#c49a2a]" />
        <span className="text-xs font-medium text-coffee-700">
          {review.item}
        </span>
      </div>

      {/* Helpful */}
      <div className="flex items-center gap-2 pt-3 border-t border-coffee-100">
        <button
          onClick={() => {
            if (!hasVoted) {
              setHelpfulCount((c) => c + 1);
              setHasVoted(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            hasVoted
              ? 'bg-[#c49a2a]/10 text-[#c49a2a] border border-[#c49a2a]/30'
              : 'bg-coffee-50 text-muted-foreground border border-coffee-200/60 hover:bg-[#c49a2a]/10 hover:text-[#c49a2a] hover:border-[#c49a2a]/30'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-[#c49a2a]' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const ratingCardRef = useRef<HTMLDivElement>(null);
  const isRatingInView = useInView(ratingCardRef, { once: true, margin: '-50px' });
  const photoRef = useRef<HTMLDivElement>(null);
  const isPhotoInView = useInView(photoRef, { once: true, margin: '-50px' });
  const videoRef = useRef<HTMLDivElement>(null);
  const isVideoInView = useInView(videoRef, { once: true, margin: '-50px' });

  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 max-w-7xl mx-auto"
      aria-label="Customer Reviews"
    >
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center mb-14"
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-coffee-900 mb-4">
          What Our Guests Say
        </h2>
        <div className="w-20 h-1 gradient-gold rounded-full mx-auto" />
      </motion.div>

      {/* ===== Rating Overview Card ===== */}
      <motion.div
        ref={ratingCardRef}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={
          isRatingInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 40, scale: 0.96 }
        }
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 shadow-premium max-w-2xl mx-auto mb-16"
      >
        <div className="text-center mb-6">
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isRatingInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut', type: 'spring', stiffness: 120 }}
            className="text-6xl font-bold text-coffee-900 font-[family-name:var(--font-playfair)]"
          >
            4.8
          </motion.p>
          <div className="flex justify-center my-3">
            <RatingStars rating={5} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">
            Based on <span className="font-semibold text-coffee-700">2,847</span> reviews
          </p>
        </div>

        {/* Rating breakdown bars */}
        <div className="space-y-2.5 mt-6">
          {ratingBreakdown.map((item, i) => (
            <RatingBar
              key={item.stars}
              stars={item.stars}
              percent={item.percent}
              isInView={isRatingInView}
              delay={0.4 + i * 0.12}
            />
          ))}
        </div>
      </motion.div>

      {/* ===== Review Stats Row: Most Mentioned ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="mb-12"
      >
        <p className="text-sm font-semibold text-coffee-700 uppercase tracking-wider mb-4 text-center">
          Most Mentioned
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {mentionedKeywords.map((keyword, i) => (
            <motion.span
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 bg-white border border-coffee-200/60 rounded-full px-4 py-2 text-sm font-medium text-coffee-700 shadow-soft hover:shadow-float hover:border-[#c49a2a]/40 transition-all duration-300 cursor-default"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c49a2a]" />
              {keyword}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ===== Review Cards (Masonry) ===== */}
      <div className="masonry-grid md:columns-2 columns-1 gap-4 mb-10">
        {reviews.slice(0, visibleCount).map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </div>

      {/* ===== Load More Button ===== */}
      {visibleCount < reviews.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <button
            onClick={() => setVisibleCount((c) => c + 4)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-coffee-200 text-coffee-700 font-semibold text-sm shadow-soft hover:shadow-float hover:border-[#c49a2a]/40 transition-all duration-300"
          >
            Load More Reviews
          </button>
        </motion.div>
      )}

      {/* ===== Photo Review Gallery ===== */}
      <motion.div
        ref={photoRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isPhotoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-16"
      >
        <div className="flex items-center gap-2 mb-6">
          <Camera className="w-5 h-5 text-[#c49a2a]" />
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-coffee-900">
            Photo Reviews
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg overflow-hidden">
          {photoImages.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isPhotoInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            >
              <img
                src={src}
                alt={`Customer photo review ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-coffee-900/0 group-hover:bg-coffee-900/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== Video Review Teaser ===== */}
      <motion.div
        ref={videoRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isVideoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-16"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-premium group cursor-pointer">
          <img
            src="/images/cafe/atmosphere.png"
            alt="Café atmosphere"
            className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 via-coffee-900/30 to-coffee-900/10" />

          {/* Play button + text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isVideoInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut', type: 'spring', stiffness: 150 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mb-4 group-hover:bg-[#c49a2a]/80 group-hover:border-[#c49a2a] transition-all duration-300"
            >
              <Play className="w-7 h-7 md:w-9 md:h-9 text-white fill-white ml-1" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isVideoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
              className="text-white text-xl md:text-2xl font-[family-name:var(--font-playfair)] font-bold"
            >
              Watch Our Story
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isVideoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
              className="text-white/70 text-sm mt-1"
            >
              2 min behind the scenes
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* ===== Write a Review CTA ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full gradient-coffee text-white font-semibold text-sm shadow-premium hover:shadow-float transition-all duration-300 group">
          <Sparkles className="w-5 h-5 text-[#d4a843] group-hover:rotate-12 transition-transform duration-300" />
          Write a Review
        </button>
      </motion.div>
    </section>
  );
}