'use client';

import { useState, useMemo } from 'react';
import { useCafeStore, MenuItem } from '@/store/cafe-store';
import { menuItems, categories } from '@/lib/cafe-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, Plus, Search, Filter } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';

const ITEMS_PER_PAGE = 6;

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popularity', label: 'Most Popular' },
];

export default function MenuSection() {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    favorites,
    toggleFavorite,
    addToCart,
  } = useCafeStore();

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        items.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return items;
  }, [activeCategory, searchQuery, sortBy]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="menu" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Menu
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#c49a2a]/30" />
          <span className="h-1.5 w-16 rounded-full bg-gradient-to-r from-[#c49a2a] to-[#d4a843]" />
          <span className="h-px w-12 bg-[#c49a2a]/30" />
        </div>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
          Crafted with passion, served with love. Explore our curated selection of premium beverages and artisan treats.
        </p>
      </motion.div>

      {/* Search Bar & Sort */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl input-skeuomorphic text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-300"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none pl-11 pr-10 py-3 rounded-xl input-skeuomorphic text-sm font-body text-foreground focus:outline-none cursor-pointer transition-all duration-300 bg-white min-w-[180px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Category Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-thin -mx-2 px-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all duration-300 shrink-0 ${
                isActive
                  ? 'bg-[#c49a2a] text-white shadow-soft'
                  : 'bg-white text-muted-foreground hover:bg-coffee-50 border border-border hover:border-[#c49a2a]/40'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              {category.name}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Product Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${searchQuery}-${sortBy}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visibleItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              variants={cardVariants}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onAddToCart={() => addToCart(item)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">☕</div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            No items found
          </h3>
          <p className="text-muted-foreground font-body">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </motion.div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border-2 border-[#c49a2a] text-[#c49a2a] font-semibold text-sm font-body hover:bg-[#c49a2a] hover:text-white transition-all duration-300 shadow-soft hover:shadow-float"
          >
            <Plus className="h-4 w-4" />
            Load More
            <span className="text-xs opacity-70 ml-1">
              ({filteredItems.length - visibleCount} remaining)
            </span>
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}

/* ===================== Product Card Sub-Component ===================== */

interface ProductCardProps {
  item: MenuItem;
  variants: {
    hidden: { opacity: number; y: number; scale: number };
    visible: { opacity: number; y: number; scale: number; transition: { duration: number; ease: number[] } };
    exit: { opacity: number; y: number; scale: number; transition: { duration: number } };
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
}

function ProductCard({ item, variants, isFavorite, onToggleFavorite, onAddToCart }: ProductCardProps) {
  const badge = item.isBestseller
    ? { label: 'Bestseller', className: 'bg-[#c49a2a] text-white' }
    : item.isLimited
    ? { label: 'Limited', className: 'bg-red-500 text-white' }
    : item.isNew
    ? { label: 'New', className: 'bg-emerald-500 text-white' }
    : null;

  return (
    <motion.div
      variants={variants}
      layout
      className="group relative rounded-2xl overflow-hidden bg-white shadow-soft transition-all duration-300 hover:shadow-float hover:-translate-y-2 shine-effect"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold z-10 ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleFavorite}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft transition-all duration-300 hover:bg-white"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-foreground/60 hover:text-red-400'
            }`}
          />
        </motion.button>

        {/* Add to Cart Button (appears on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-foreground font-semibold text-sm font-body shadow-soft hover:bg-white hover:shadow-float transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Category Label */}
        <span className="text-xs font-semibold uppercase tracking-wider text-[#c49a2a]/80 font-body">
          {categories.find((c) => c.id === item.category)?.name || item.category}
        </span>

        {/* Name */}
        <h3
          className="font-display text-lg font-bold text-foreground mt-1 mb-1.5 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground font-body line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Rating & Price Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#c49a2a] text-[#c49a2a]" />
            <span className="text-sm font-bold text-foreground font-body">{item.rating}</span>
            <span className="text-xs text-muted-foreground font-body">
              ({item.reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <span className="text-xl font-bold text-[#c49a2a] font-body">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Popularity Bar */}
        <div className="w-full h-1 rounded-full bg-coffee-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${item.popularity}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#c49a2a] to-[#d4a843]"
          />
        </div>
      </div>
    </motion.div>
  );
}