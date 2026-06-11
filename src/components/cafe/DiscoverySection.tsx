'use client';

import { useCafeStore, MenuItem } from '@/store/cafe-store';
import { menuItems, trendingItems, chefPicks, seasonalSpecials } from '@/lib/cafe-data';
import { motion, useInView } from 'framer-motion';
import { Star, Heart, Plus, TrendingUp, ChefHat, Sparkles, Clock, Flame } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// ─────────────────────────────────────────────
// Mood-to-item mappings
// ─────────────────────────────────────────────
const moodItemMap: Record<string, string[]> = {
  'Energize ☀️': ['4', '6', '1', '7'],
  'Relax 🌿': ['3', '6', '8', '5'],
  'Celebrate 🎉': ['10', '5', '2', '8'],
  'Focus 🎯': ['4', '6', '3', '9'],
};

const moodLabels: { key: string; label: string; emoji: string }[] = [
  { key: 'Energize ☀️', label: 'Energize', emoji: '☀️' },
  { key: 'Relax 🌿', label: 'Relax', emoji: '🌿' },
  { key: 'Celebrate 🎉', label: 'Celebrate', emoji: '🎉' },
  { key: 'Focus 🎯', label: 'Focus', emoji: '🎯' },
];

// ─────────────────────────────────────────────
// Helper: get item by id
// ─────────────────────────────────────────────
function getItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

// ─────────────────────────────────────────────
// Section Title Component
// ─────────────────────────────────────────────
function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center gap-4 mb-8"
    >
      {icon && <span className="text-gold-500">{icon}</span>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso tracking-tight">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-gold-400/60 to-transparent" />
      <div className="w-2 h-2 rounded-full bg-gold-400" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Scroll Container Wrapper (horizontal on mobile, grid on desktop)
// ─────────────────────────────────────────────
function DiscoveryScrollGrid({
  children,
  columns = 4,
}: {
  children: React.ReactNode;
  columns?: number;
}) {
  const colClass =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 3
        ? 'md:grid-cols-3'
        : 'md:grid-cols-4';

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 md:grid ${colClass} md:overflow-x-visible md:pb-0`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// 1. Trending Today Card
// ─────────────────────────────────────────────
function TrendingCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const addToCart = useCafeStore((s) => s.addToCart);
  const favorites = useCafeStore((s) => s.favorites);
  const toggleFavorite = useCafeStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(item.id);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group min-w-[280px] md:min-w-0 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-soft hover:shadow-float transition-shadow duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-espresso shadow-sm">
          <Flame className="w-3 h-3 text-orange-500" />
          #{index + 1} Trending
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleFavorite(item.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-coffee-400'}`}
          />
        </motion.button>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-espresso truncate">{item.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
              <span className="text-sm font-medium text-coffee-600">{item.rating}</span>
              <span className="text-xs text-coffee-300">({item.reviews.toLocaleString()})</span>
            </div>
          </div>
          <span className="text-lg font-bold text-gold-600">${item.price.toFixed(2)}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addToCart(item)}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-espresso text-cream py-2.5 text-sm font-semibold hover:bg-coffee-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Quick Add
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 2. Chef's Recommendation Card (larger, featured style)
// ─────────────────────────────────────────────
function ChefCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const addToCart = useCafeStore((s) => s.addToCart);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden bg-white shadow-soft hover:shadow-float transition-shadow duration-500 min-w-[280px] md:min-w-0 flex-shrink-0"
    >
      <div className="absolute top-0 left-0 right-0 h-1 gradient-gold z-10" />
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gold-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">
            <ChefHat className="w-3 h-3" />
            Chef&apos;s Pick
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-center">
          <h3 className="font-display text-xl font-bold text-espresso mb-1">{item.name}</h3>
          <p className="text-sm text-coffee-500 leading-relaxed mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
            <span className="text-sm font-semibold text-coffee-700">{item.rating}</span>
            <span className="text-xs text-coffee-300">({item.reviews.toLocaleString()} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gold-600">${item.price.toFixed(2)}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(item)}
              className="flex items-center gap-2 rounded-full bg-espresso text-cream px-5 py-2.5 text-sm font-semibold hover:bg-coffee-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Quick Add
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 3. Seasonal Special Card (autumn/warm theme)
// ─────────────────────────────────────────────
function SeasonalCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const addToCart = useCafeStore((s) => s.addToCart);
  const favorites = useCafeStore((s) => s.favorites);
  const toggleFavorite = useCafeStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(item.id);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateY: -5 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      className="group relative min-w-[280px] md:min-w-0 flex-shrink-0 rounded-xl overflow-hidden shadow-soft hover:shadow-float transition-shadow duration-500"
      style={{
        background: 'linear-gradient(145deg, #fefcf7 0%, #faf3e6 40%, #f5e6d0 100%)',
      }}
    >
      {/* Warm autumn border accent */}
      <div className="absolute inset-0 rounded-xl border border-amber-200/60 pointer-events-none z-10" />

      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-amber-600/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">
          <Flame className="w-3 h-3" />
          Seasonal
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleFavorite(item.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-amber-600'}`}
          />
        </motion.button>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-espresso truncate">{item.name}</h3>
        <p className="text-xs text-coffee-500 mt-1 line-clamp-1">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-amber-700">${item.price.toFixed(2)}</span>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <SeasonalCountdown />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addToCart(item)}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-amber-700 text-white py-2.5 text-sm font-semibold hover:bg-amber-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Quick Add
        </motion.button>
      </div>
    </motion.div>
  );
}

function SeasonalCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 3, h: 14, m: 27, s: 53 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { d, h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        if (d < 0) return { d: 0, h: 0, m: 0, s: 0 };
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>Ends in {timeLeft.d}d {timeLeft.h}h</span>;
}

// ─────────────────────────────────────────────
// 4. Customer Favorite Card (with heart counts)
// ─────────────────────────────────────────────
function FavoriteCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const addToCart = useCafeStore((s) => s.addToCart);
  const favorites = useCafeStore((s) => s.favorites);
  const toggleFavorite = useCafeStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(item.id);

  // Simulated heart count based on reviews
  const heartCount = Math.round(item.reviews * 0.62);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative min-w-[280px] md:min-w-0 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-soft hover:shadow-float transition-shadow duration-500"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
          <span className="text-xs font-bold text-espresso">{item.rating}</span>
        </div>
        {/* Heart count */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
          <span className="text-xs font-semibold text-espresso">{heartCount.toLocaleString()}</span>
        </div>
        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="font-display text-lg font-bold text-white drop-shadow-md">{item.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-white/90 font-medium">{item.reviews.toLocaleString()} reviews</span>
            <span className="text-lg font-bold text-gold-400">${item.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addToCart(item)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-espresso text-cream py-2.5 text-sm font-semibold hover:bg-coffee-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Quick Add
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleFavorite(item.id)}
          className="w-10 h-10 rounded-lg border border-coffee-200 flex items-center justify-center hover:bg-coffee-50 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-coffee-400'}`}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 5. New Arrival Card (with "NEW" badge and sparkle)
// ─────────────────────────────────────────────
function NewArrivalCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const addToCart = useCafeStore((s) => s.addToCart);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      className="group relative min-w-[280px] md:min-w-0 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-soft hover:shadow-float transition-shadow duration-500 shine-effect"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* NEW badge */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-3 left-3 rounded-full gradient-gold px-3.5 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          NEW
        </motion.div>
        {/* Sparkle effects */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ rotate: 360, opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-gold-400" />
          </motion.div>
        </div>
        <div className="absolute bottom-3 right-4">
          <motion.div
            animate={{ rotate: -360, opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-4 h-4 text-gold-300" />
          </motion.div>
        </div>
        <div className="absolute top-1/2 right-8">
          <motion.div
            animate={{ y: [-3, 3, -3], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-3 h-3 text-gold-500" />
          </motion.div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold-500">Just Added</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-espresso truncate">{item.name}</h3>
        <p className="text-xs text-coffee-400 mt-1 line-clamp-1">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            <span className="text-sm font-medium text-coffee-600">{item.rating}</span>
            <span className="text-xs text-coffee-300">({item.reviews.toLocaleString()})</span>
          </div>
          <span className="text-lg font-bold text-gold-600">${item.price.toFixed(2)}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addToCart(item)}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg gradient-gold text-white py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Quick Add
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 6. Mood Recommendation Mini Card
// ─────────────────────────────────────────────
function MoodMiniCard({ item, index }: { item: MenuItem; index: number }) {
  const addToCart = useCafeStore((s) => s.addToCart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="group relative min-w-[240px] md:min-w-0 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-soft hover:shadow-float transition-shadow duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-3">
        <h4 className="font-display text-base font-semibold text-espresso truncate">{item.name}</h4>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-bold text-gold-600">${item.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
            <span className="text-xs text-coffee-500">{item.rating}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addToCart(item)}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-espresso text-cream py-2 text-sm font-semibold hover:bg-coffee-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Quick Add
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function DiscoverySection() {
  // Resolve trending items
  const trending = trendingItems.map(getItemById).filter(Boolean) as MenuItem[];

  // Resolve chef's picks
  const chef = chefPicks.map(getItemById).filter(Boolean) as MenuItem[];

  // Resolve seasonal specials
  const seasonal = seasonalSpecials.map(getItemById).filter(Boolean) as MenuItem[];

  // Customer favorites: top-rated items sorted by rating then reviews
  const customerFavorites = [...menuItems]
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 4);

  // New arrivals
  const newArrivals = menuItems.filter((item) => item.isNew);

  // Mood state
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const moodRef = useRef(null);
  const isMoodInView = useInView(moodRef, { once: true, margin: '-60px' });

  const moodItems = activeMood
    ? (moodItemMap[activeMood] ?? []).map(getItemById).filter(Boolean) as MenuItem[]
    : [];

  // Section refs for scroll animation
  const trendingRef = useRef(null);
  const chefRef = useRef(null);
  const seasonalRef = useRef(null);
  const favoritesRef = useRef(null);
  const newArrivalsRef = useRef(null);

  const trendingInView = useInView(trendingRef, { once: true, margin: '-60px' });
  const chefInView = useInView(chefRef, { once: true, margin: '-60px' });
  const seasonalInView = useInView(seasonalRef, { once: true, margin: '-60px' });
  const favoritesInView = useInView(favoritesRef, { once: true, margin: '-60px' });
  const newArrivalsInView = useInView(newArrivalsRef, { once: true, margin: '-60px' });

  return (
    <section className="py-12 bg-cream" aria-label="Personalized Discovery">
      {/* ─────── 1. TRENDING TODAY ─────── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div ref={trendingRef}>
          <SectionTitle icon={<TrendingUp className="w-7 h-7" />}>
            Trending Today
          </SectionTitle>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={trendingInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DiscoveryScrollGrid columns={4}>
            {trending.map((item, i) => (
              <TrendingCard key={item.id} item={item} index={i} />
            ))}
          </DiscoveryScrollGrid>
        </motion.div>
      </div>

      {/* ─────── 2. CHEF&apos;S RECOMMENDATIONS ─────── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div ref={chefRef}>
          <SectionTitle icon={<ChefHat className="w-7 h-7" />}>
            Chef&apos;s Recommendations
          </SectionTitle>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={chefInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {chef.map((item, i) => (
            <ChefCard key={item.id} item={item} index={i} />
          ))}
        </motion.div>
      </div>

      {/* ─────── 3. SEASONAL SPECIALS ─────── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div ref={seasonalRef}>
          <SectionTitle icon={<Flame className="w-7 h-7" />}>
            Seasonal Specials
          </SectionTitle>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={seasonalInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DiscoveryScrollGrid columns={4}>
            {seasonal.map((item, i) => (
              <SeasonalCard key={item.id} item={item} index={i} />
            ))}
          </DiscoveryScrollGrid>
        </motion.div>
      </div>

      {/* ─────── 4. CUSTOMER FAVORITES ─────── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div ref={favoritesRef}>
          <SectionTitle icon={<Heart className="w-7 h-7" />}>
            Customer Favorites
          </SectionTitle>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={favoritesInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DiscoveryScrollGrid columns={4}>
            {customerFavorites.map((item, i) => (
              <FavoriteCard key={item.id} item={item} index={i} />
            ))}
          </DiscoveryScrollGrid>
        </motion.div>
      </div>

      {/* ─────── 5. NEW ARRIVALS ─────── */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div ref={newArrivalsRef}>
          <SectionTitle icon={<Sparkles className="w-7 h-7" />}>
            New Arrivals
          </SectionTitle>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={newArrivalsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DiscoveryScrollGrid columns={newArrivals.length > 2 ? 3 : newArrivals.length}>
            {newArrivals.map((item, i) => (
              <NewArrivalCard key={item.id} item={item} index={i} />
            ))}
          </DiscoveryScrollGrid>
        </motion.div>
      </div>

      {/* ─────── 6. MOOD-BASED RECOMMENDATION ─────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div ref={moodRef}>
          <SectionTitle icon={<span className="text-2xl">✨</span>}>
            Mood-Based Recommendation
          </SectionTitle>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isMoodInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {moodLabels.map((mood) => (
            <motion.button
              key={mood.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveMood(activeMood === mood.key ? null : mood.key)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${
                activeMood === mood.key
                  ? 'bg-gold-500 text-white border-2 border-gold-500 shadow-lg shadow-gold-500/20'
                  : 'glass border-2 border-transparent hover:border-gold-400 text-coffee-700'
              }`}
            >
              {mood.key}
            </motion.button>
          ))}
        </motion.div>

        {/* Mood Results */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={activeMood ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {moodItems.map((item, i) => (
              <MoodMiniCard key={item.id} item={item} index={i} />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-coffee-400 mt-4 italic"
          >
            Curated picks for your {activeMood?.split(' ')[0]?.toLowerCase() || ''} mood
          </motion.p>
        </motion.div>

        {/* Placeholder when no mood selected */}
        {!activeMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12 rounded-2xl border-2 border-dashed border-coffee-200 bg-white/40"
          >
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-coffee-500 font-medium">Select your mood above to discover personalized picks</p>
            <p className="text-sm text-coffee-300 mt-1">We&apos;ll curate the perfect items for how you&apos;re feeling</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}