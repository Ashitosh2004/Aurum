'use client';

import LoadingScreen from '@/components/cafe/LoadingScreen';
import Navigation from '@/components/cafe/Navigation';
import HeroSection from '@/components/cafe/HeroSection';
import MenuSection from '@/components/cafe/MenuSection';
import DiscoverySection from '@/components/cafe/DiscoverySection';
import ReviewsSection from '@/components/cafe/ReviewsSection';
import StorySection from '@/components/cafe/StorySection';
import SocialGallery from '@/components/cafe/SocialGallery';
import ContactSection from '@/components/cafe/ContactSection';
import Footer from '@/components/cafe/Footer';
import CartAndCheckout from '@/components/cafe/CartAndCheckout';
import ReservationAndProfile from '@/components/cafe/ReservationAndProfile';
import SearchOverlay from '@/components/cafe/SearchOverlay';
import ToastContainer from '@/components/cafe/ToastContainer';
import { useCafeStore } from '@/store/cafe-store';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const isLoading = useCafeStore((s) => s.isLoading);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Loading Experience */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero */}
        <section id="home">
          <HeroSection />
        </section>

        {/* Discovery & Personalized */}
        <DiscoverySection />

        {/* Menu */}
        <section id="menu">
          <MenuSection />
        </section>

        {/* Reviews & Social Proof */}
        <section id="reviews">
          <ReviewsSection />
        </section>

        {/* Our Story */}
        <section id="story">
          <StorySection />
        </section>

        {/* Social Gallery */}
        <section id="gallery">
          <SocialGallery />
        </section>

        {/* Contact */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Panels */}
      <SearchOverlay />
      <CartAndCheckout />
      <ReservationAndProfile />
    </div>
  );
}
