'use client';

import { Coffee, Instagram, Facebook, Twitter, ArrowUp, Send, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    if (email.trim()) {
      setEmail('');
    }
  };

  const quickLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Reservations', href: '#reservations' },
    { label: 'Our Story', href: '#story' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Gift Cards', href: '#giftcards' },
    { label: 'Careers', href: '#careers' },
  ];

  const supportLinks = [
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Delivery Policy', href: '#delivery' },
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="relative mt-auto">
      {/* ===== Marquee Banner ===== */}
      <div className="bg-[#c49a2a] text-espresso font-semibold overflow-hidden py-2.5">
        <div className="animate-marquee whitespace-nowrap flex">
          <span className="mx-8 text-sm tracking-wide">
            FREE DELIVERY ON ORDERS OVER $30 &nbsp;&nbsp;✦&nbsp;&nbsp; USE CODE WELCOME10 FOR 10% OFF &nbsp;&nbsp;✦&nbsp;&nbsp; NEW: ICED MATCHA LATTE NOW AVAILABLE &nbsp;&nbsp;✦&nbsp;&nbsp;
            FREE DELIVERY ON ORDERS OVER $30 &nbsp;&nbsp;✦&nbsp;&nbsp; USE CODE WELCOME10 FOR 10% OFF &nbsp;&nbsp;✦&nbsp;&nbsp; NEW: ICED MATCHA LATTE NOW AVAILABLE &nbsp;&nbsp;✦&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* ===== Main Footer Area ===== */}
      <div className="gradient-coffee">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Column 1: Logo & Brand */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-lg">
                  <Coffee className="w-5 h-5 text-espresso" />
                </div>
                <span className="font-display text-2xl font-bold text-cream tracking-wide">
                  AURUM COFFEE
                </span>
              </div>
              <p className="text-coffee-300 text-sm leading-relaxed max-w-xs">
                Where every cup tells a story. Handcrafted excellence since 2018,
                bringing the world&apos;s finest beans to your table.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-coffee-200 hover:bg-gold-500/20 hover:text-gold-400 transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-cream font-display text-lg font-semibold mb-5 tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-coffee-300 text-sm hover:text-gold-400 transition-colors duration-300 relative group inline-block"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h3 className="text-cream font-display text-lg font-semibold mb-5 tracking-wide">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-coffee-300 text-sm hover:text-gold-400 transition-colors duration-300 relative group inline-block"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="text-cream font-display text-lg font-semibold mb-5 tracking-wide">
                Newsletter
              </h3>
              <p className="text-coffee-300 text-sm leading-relaxed mb-5">
                Join our community for exclusive offers, new blend launches, and
                brewing tips delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-cream placeholder-coffee-400 focus:outline-none focus:border-gold-500/50 focus:bg-white/15 transition-all duration-300"
                  aria-label="Email address"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubscribe}
                  className="gradient-gold rounded-xl px-4 py-2.5 text-espresso font-semibold text-sm flex items-center gap-1.5 hover:shadow-lg hover:shadow-gold-500/25 transition-shadow duration-300"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="gradient-coffee border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-coffee-400 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Aurum Coffee. All rights reserved.
            </p>
            <p className="text-coffee-400 text-xs flex items-center gap-1.5">
              Crafted with <Heart className="w-3 h-3 text-gold-500 fill-gold-500" /> and
              coffee beans
            </p>
          </div>
        </div>
      </div>

      {/* ===== Back to Top Button ===== */}
      <motion.button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 left-6 z-20 w-11 h-11 rounded-full gradient-gold flex items-center justify-center shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="w-5 h-5 text-espresso" />
      </motion.button>
    </footer>
  );
}
