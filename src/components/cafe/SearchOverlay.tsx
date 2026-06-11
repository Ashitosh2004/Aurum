'use client';

import { useCafeStore } from '@/store/cafe-store';
import { menuItems, categories, popularSearches } from '@/lib/cafe-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star, Plus, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function SearchOverlay() {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery, addToCart } = useCafeStore();
  const [localQuery, setLocalQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const handleClose = () => {
    setSearchOpen(false);
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== query.toLowerCase());
        return [query, ...filtered].slice(0, 5);
      });
    }
  };

  const handlePopularSearchClick = (term: string) => {
    handleSearch(term);
  };

  const handleCategoryClick = (categoryId: string) => {
    const categoryName = categories.find((c) => c.id === categoryId)?.name || '';
    handleSearch(categoryName);
  };

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addToCart(item);
  };

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, handleClose]);

  // Pick 4 random items for "Recommended for You" when overlay opens
  // Use a seeded random based on isSearchOpen state to get stable recommendations per session
  const recommendedItems = useMemo(() => {
    const shuffled = [...menuItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [isSearchOpen]);

  // Sync localQuery with store searchQuery when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setLocalQuery(searchQuery);
    }
  }, [isSearchOpen, searchQuery]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Search results
  const searchResults = useMemo(() => {
    if (!localQuery.trim()) return [];
    const query = localQuery.toLowerCase().trim();

    return menuItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(query));
      const categoryMatch = item.category.toLowerCase().includes(query);
      return nameMatch || descMatch || tagMatch || categoryMatch;
    });
  }, [localQuery]);

  const hasQuery = localQuery.trim().length > 0;

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const searchBarVariants = {
    hidden: { opacity: 0, y: -40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 },
    },
    exit: {
      opacity: 0,
      y: -40,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', delay: 0.15 },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.15 },
    },
  };

  const resultItemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut', delay: 0.05 * i },
    }),
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
    exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: 'easeOut', delay: 0.03 * i },
    }),
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Content */}
          <div className="relative z-10 min-h-screen px-4 pb-12">
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              onClick={handleClose}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Search Bar */}
            <motion.div
              className="mx-auto mt-24 max-w-2xl"
              variants={searchBarVariants}
            >
              <div className="input-skeuomorphic relative rounded-2xl p-1">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <Search className="h-6 w-6 shrink-0 text-white/50" />
                  <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search our menu..."
                    className="flex-1 bg-transparent text-xl text-white placeholder-white/40 outline-none"
                    autoFocus
                    autoComplete="off"
                  />
                  {localQuery && (
                    <motion.button
                      className="shrink-0 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                      onClick={() => handleSearch('')}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Keyboard hint */}
              <motion.p
                className="mt-3 text-center text-sm text-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
              >
                Press <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-xs font-medium text-white/50">ESC</kbd> to close
              </motion.p>
            </motion.div>

            {/* Results / Suggestions Area */}
            <motion.div
              className="mx-auto mt-8 max-w-3xl"
              variants={contentVariants}
            >
              <AnimatePresence mode="wait">
                {hasQuery ? (
                  /* ========== SEARCH RESULTS ========== */
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Result count */}
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-white/50">
                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}{' '}
                        for &ldquo;<span className="text-white/80">{localQuery}</span>&rdquo;
                      </p>
                    </div>

                    {searchResults.length > 0 ? (
                      <motion.div
                        className="max-h-[60vh] space-y-2 overflow-y-auto pr-1 custom-scrollbar"
                        variants={staggerContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {searchResults.map((item, i) => (
                          <motion.div
                            key={item.id}
                            custom={i}
                            variants={resultItemVariants}
                            className="group flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-colors hover:bg-white/10"
                            onClick={() => handleAddToCart(item)}
                          >
                            {/* Image Thumbnail */}
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                              {item.isNew && (
                                <span className="absolute top-0.5 left-0.5 rounded bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                  New
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-semibold text-white">
                                    {item.name}
                                  </h4>
                                  <p className="mt-0.5 truncate text-xs text-white/40">
                                    {item.category.replace('-', ' ')} ·{' '}
                                    {item.tags[0]}
                                  </p>
                                </div>
                                <span className="shrink-0 text-sm font-bold text-amber-400">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                              {/* Rating row */}
                              <div className="mt-1 flex items-center gap-1.5">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-medium text-white/60">
                                  {item.rating}
                                </span>
                                <span className="text-xs text-white/30">
                                  ({item.reviews.toLocaleString()})
                                </span>
                              </div>
                            </div>

                            {/* Add to cart */}
                            <motion.button
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors group-hover:bg-amber-500/80 group-hover:text-white"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Add ${item.name} to cart`}
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      /* No results empty state */
                      <motion.div
                        className="flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                          <span className="text-4xl">☕</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white/80">
                          No results found
                        </h3>
                        <p className="mt-1 max-w-xs text-sm text-white/40">
                          We couldn&apos;t find anything matching &ldquo;{localQuery}&rdquo;. 
                          Try searching for something else or browse our categories.
                        </p>
                        <button
                          className="mt-5 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                          onClick={() => handleSearch('')}
                        >
                          Browse Categories
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* ========== DEFAULT SUGGESTIONS ========== */
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white/40" />
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                            Recent Searches
                          </h3>
                        </div>
                        <motion.div
                          className="flex flex-wrap gap-2"
                          variants={staggerContainerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {recentSearches.map((term, i) => (
                            <motion.button
                              key={term}
                              custom={i}
                              variants={pillVariants}
                              className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                              onClick={() => handlePopularSearchClick(term)}
                            >
                              <Clock className="h-3.5 w-3.5 text-white/30" />
                              {term}
                              <X
                                className="ml-1 h-3 w-3 text-white/30 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRecentSearches((prev) => prev.filter((s) => s !== term));
                                }}
                              />
                            </motion.button>
                          ))}
                        </motion.div>
                      </section>
                    )}

                    {/* Popular Searches */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                          Popular Searches
                        </h3>
                      </div>
                      <motion.div
                        className="flex flex-wrap gap-2"
                        variants={staggerContainerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {popularSearches.map((term, i) => (
                          <motion.button
                            key={term}
                            custom={i}
                            variants={pillVariants}
                            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-amber-500/20 hover:text-amber-300"
                            onClick={() => handlePopularSearchClick(term)}
                          >
                            {term}
                          </motion.button>
                        ))}
                      </motion.div>
                    </section>

                    {/* Category Quick Links */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                          Browse Categories
                        </h3>
                      </div>
                      <motion.div
                        className="grid grid-cols-2 gap-3 md:grid-cols-4"
                        variants={staggerContainerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {categories.map((category, i) => (
                          <motion.button
                            key={category.id}
                            custom={i}
                            variants={resultItemVariants}
                            className="group flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                            onClick={() => handleCategoryClick(category.id)}
                          >
                            <span className="text-3xl transition-transform group-hover:scale-110">
                              {category.icon}
                            </span>
                            <span className="text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                              {category.name}
                            </span>
                          </motion.button>
                        ))}
                      </motion.div>
                    </section>

                    {/* Recommended For You */}
                    {recommendedItems.length > 0 && (
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                            Recommended for You
                          </h3>
                        </div>
                        <motion.div
                          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                          variants={staggerContainerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {recommendedItems.map((item, i) => (
                            <motion.div
                              key={item.id}
                              custom={i}
                              variants={resultItemVariants}
                              className="group flex cursor-pointer items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                              onClick={() => handleAddToCart(item)}
                            >
                              {/* Image */}
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                                {item.isBestseller && (
                                  <span className="absolute top-0 left-0 rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
                                    Best
                                  </span>
                                )}
                              </div>

                              {/* Info */}
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate text-sm font-semibold text-white/90">
                                  {item.name}
                                </h4>
                                <div className="mt-1 flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs text-white/60">{item.rating}</span>
                                  </div>
                                  <span className="text-xs font-semibold text-amber-400">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Add button */}
                              <motion.div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors group-hover:bg-amber-500/80 group-hover:text-white"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus className="h-4 w-4" />
                              </motion.div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </section>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
