'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCafeStore } from '@/store/cafe-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Calendar, Menu, X, Coffee } from 'lucide-react';

const navLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'Story', href: '#story' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.2 },
  },
};

const badgePopVariants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 15 },
  },
  exit: {
    scale: 0,
    transition: { duration: 0.2 },
  },
};

export default function Navigation() {
  const {
    cartCount,
    isSearchOpen,
    setSearchOpen,
    isProfileOpen,
    setProfileOpen,
    isReservationOpen,
    setReservationOpen,
    setCartOpen,
    activeSection,
  } = useCafeStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  const count = cartCount();

  return (
    <>
      {/* ===== DESKTOP / MAIN NAV BAR ===== */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 rounded-b-2xl transition-all duration-500 ease-out ${
          isScrolled
            ? 'shadow-premium py-2 px-6'
            : 'py-3 px-6'
        }`}
        style={{
          background: isScrolled
            ? 'rgba(255, 255, 255, 0.88)'
            : 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Main navigation">
          {/* ===== LOGO ===== */}
          <motion.a
            href="#home"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={handleNavClick}
          >
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-full gradient-gold"
              whileHover={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <Coffee className="h-4 w-4 text-white" />
            </motion.div>
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-wider text-[#c49a2a] select-none">
              AURUM
            </span>
          </motion.a>

          {/* ===== DESKTOP NAV LINKS ===== */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#c49a2a]'
                    : 'text-coffee-700 hover:text-[#c49a2a]'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={handleNavClick}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#c49a2a]"
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* ===== RIGHT ACTIONS ===== */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Button */}
            <motion.button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-coffee-600 transition-colors hover:bg-coffee-100 hover:text-[#c49a2a]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => setSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <Search className="h-[18px] w-[18px]" />
            </motion.button>

            {/* Cart Button */}
            <motion.button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-coffee-600 transition-colors hover:bg-coffee-100 hover:text-[#c49a2a]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              aria-label="Shopping cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="cart-badge"
                    variants={badgePopVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#c49a2a] px-1 text-[10px] font-bold leading-none text-white shadow-sm"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Reserve Button — Desktop */}
            <motion.button
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 gradient-gold text-white shadow-soft hover:shadow-premium"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => setReservationOpen(!isReservationOpen)}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Reserve</span>
            </motion.button>

            {/* User Avatar Button */}
            <motion.button
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-coffee-100 text-coffee-600 transition-colors hover:bg-[#c49a2a]/10 hover:text-[#c49a2a]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => setProfileOpen(!isProfileOpen)}
              aria-label="User profile"
            >
              <User className="h-4 w-4" />
            </motion.button>

            {/* Mobile Hamburger */}
            <motion.button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-coffee-600 transition-colors hover:bg-coffee-100 lg:hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* ===== MOBILE FULL-SCREEN MENU OVERLAY ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-espresso/40"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />

            {/* Glass Panel */}
            <motion.div
              className="absolute inset-x-0 top-0 bottom-0 glass flex flex-col"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-coffee-200/50">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-gold">
                    <Coffee className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-[family-name:var(--font-playfair)] text-lg font-bold tracking-wider text-[#c49a2a]">
                    AURUM
                  </span>
                </div>
                <motion.button
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-coffee-600 transition-colors hover:bg-coffee-100"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex-1 flex flex-col justify-center px-6">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      variants={mobileLinkVariants}
                      custom={index}
                      className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-medium transition-colors duration-300 ${
                        activeSection === link.href.slice(1)
                          ? 'bg-[#c49a2a]/10 text-[#c49a2a]'
                          : 'text-coffee-700 hover:bg-coffee-100 hover:text-[#c49a2a]'
                      }`}
                      whileHover={{ x: 8, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      onClick={handleNavClick}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                          activeSection === link.href.slice(1)
                            ? 'bg-[#c49a2a] text-white'
                            : 'bg-coffee-100 text-coffee-500'
                        } transition-colors duration-300`}
                      >
                        {link.label.charAt(0)}
                      </span>
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Footer CTA */}
              <div className="px-6 pb-8 space-y-3">
                <motion.button
                  className="flex w-full items-center justify-center gap-2 h-12 rounded-2xl text-sm font-semibold tracking-wide gradient-gold text-white shadow-premium"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  onClick={() => {
                    setReservationOpen(true);
                    closeMobileMenu();
                  }}
                >
                  <Calendar className="h-4 w-4" />
                  Reserve a Table
                </motion.button>

                <div className="flex gap-3">
                  <motion.button
                    className="flex flex-1 items-center justify-center gap-2 h-12 rounded-2xl text-sm font-medium tracking-wide bg-coffee-100 text-coffee-700 transition-colors hover:bg-coffee-200"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => {
                      setProfileOpen(true);
                      closeMobileMenu();
                    }}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </motion.button>

                  <motion.div
                    className="relative flex flex-1 items-center justify-center gap-2 h-12 rounded-2xl text-sm font-medium tracking-wide bg-coffee-100 text-coffee-700 transition-colors hover:bg-coffee-200 cursor-pointer"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => {
                      setSearchOpen(true);
                      closeMobileMenu();
                    }}
                  >
                    <Search className="h-4 w-4" />
                    Search
                    {count > 0 && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c49a2a] px-1.5 text-[10px] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}