'use client';

import { useCafeStore } from '@/store/cafe-store';
import { motion, AnimatePresence } from 'framer-motion';
import { timeSlots, seatingOptions } from '@/lib/cafe-data';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  Armchair,
  Check,
  Award,
  Star,
  ShoppingBag,
  Heart,
  Gift,
  Crown,
  Gem,
  Edit,
  Plus,
  Minus,
} from 'lucide-react';
import { useState, useMemo } from 'react';

// ─── Coffee Bean Confetti Particle ───────────────────────────────────────────
function CoffeeBean({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: '-20px' }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: [0, 300, 600],
        rotate: [0, 360, 720],
        opacity: [1, 1, 0],
        x: [0, Math.sin(delay) * 60, Math.sin(delay * 2) * 40],
      }}
      transition={{ duration: 3, delay, ease: 'easeOut' }}
    >
      <span style={{ fontSize: size }} className="select-none">☕</span>
    </motion.div>
  );
}

// ─── Generate next 14 days ───────────────────────────────────────────────────
function getNext14Days() {
  const days: { date: Date; dayName: string; dayNum: number; month: string; full: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    });
  }
  return days;
}

// ─── Step labels ─────────────────────────────────────────────────────────────
const STEPS = ['Date', 'Time', 'Guests', 'Seating', 'Contact', 'Confirm'];

// ─── Sample orders for profile ───────────────────────────────────────────────
const sampleOrders = [
  {
    id: '#ORD-7842',
    date: 'Dec 18, 2024',
    items: ['Caramel Macchiato', 'Artisan Croissant Trio'],
    total: 15.48,
    status: 'Completed',
  },
  {
    id: '#ORD-7856',
    date: 'Dec 20, 2024',
    items: ['Iced Matcha Latte', 'Berry Cheesecake', 'Avocado Toast'],
    total: 24.47,
    status: 'In Progress',
  },
  {
    id: '#ORD-7871',
    date: 'Dec 22, 2024',
    items: ['Espresso Doppio', 'Chocolate Lava Cake'],
    total: 15.48,
    status: 'Completed',
  },
];

// ─── Sample upcoming reservations ────────────────────────────────────────────
const sampleReservations = [
  {
    date: 'Dec 28, 2024',
    time: '2:00 PM',
    guests: 4,
    seating: 'Window Seat',
    status: 'Confirmed',
  },
  {
    date: 'Jan 3, 2025',
    time: '10:30 AM',
    guests: 2,
    seating: 'Outdoor Patio',
    status: 'Pending',
  },
];

// ─── Favorite items ──────────────────────────────────────────────────────────
const favoriteItems = [
  { id: '1', name: 'Caramel Macchiato', emoji: '☕' },
  { id: '5', name: 'Affogato', emoji: '🍨' },
  { id: '8', name: 'Berry Cheesecake', emoji: '🍰' },
  { id: '9', name: 'Avocado Toast', emoji: '🥑' },
];

// ─── Loyalty benefits ────────────────────────────────────────────────────────
const loyaltyBenefits = [
  'Priority Seating',
  'Free Birthday Drink',
  '10% Off Special Items',
  'Exclusive Access',
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ReservationAndProfile() {
  const { isReservationOpen, setReservationOpen, isProfileOpen, setProfileOpen, addToast } =
    useCafeStore();

  // ── Reservation state ──────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateFull, setSelectedDateFull] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedSeating, setSelectedSeating] = useState<string>('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const dates = useMemo(() => getNext14Days(), []);

  const resetReservation = () => {
    setStep(0);
    setSelectedDate('');
    setSelectedDateFull('');
    setSelectedTime('');
    setGuestCount(2);
    setSelectedSeating('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setIsConfirmed(false);
    setBookingRef('');
    setShowConfetti(false);
  };

  const closeReservation = () => {
    setReservationOpen(false);
    setTimeout(resetReservation, 300);
  };

  const handleConfirm = () => {
    const ref = 'CFE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingRef(ref);
    setIsConfirmed(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const canGoNext = () => {
    switch (step) {
      case 0: return !!selectedDate;
      case 1: return !!selectedTime;
      case 2: return guestCount >= 1;
      case 3: return !!selectedSeating;
      case 4: return !!contactName && !!contactEmail && !!contactPhone;
      default: return true;
    }
  };

  const goNext = () => {
    if (canGoNext() && step < 5) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // ─── Confetti beans ────────────────────────────────────────────────────────
  const confettiBeans = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1.5,
      x: Math.random() * 100,
      size: 14 + Math.random() * 16,
    }));
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RESERVATION MODAL
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ─── RESERVATION MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isReservationOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
              onClick={closeReservation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-2xl glass rounded-3xl shadow-premium overflow-hidden"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={closeReservation}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/90 transition-colors shadow-soft"
                aria-label="Close reservation"
              >
                <X className="w-4 h-4 text-coffee-700" />
              </button>

              {/* Confetti overlay */}
              {showConfetti && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  {confettiBeans.map((bean) => (
                    <CoffeeBean key={bean.id} delay={bean.delay} x={bean.x} size={bean.size} />
                  ))}
                </div>
              )}

              <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                {/* ── Header ─────────────────────────────────────────────── */}
                {!isConfirmed && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-coffee-900">
                        Reserve Your Table
                      </h2>
                      <p className="text-coffee-500 mt-1 font-body text-sm">
                        Experience luxury dining at its finest
                      </p>
                    </div>

                    {/* ── Progress Stepper ───────────────────────────────── */}
                    <div className="flex items-center justify-center mb-8 px-2">
                      {STEPS.map((label, i) => (
                        <div key={label} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <motion.div
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                                i < step
                                  ? 'gradient-gold text-white'
                                  : i === step
                                    ? 'bg-gold-500 text-white shadow-lg'
                                    : 'bg-coffee-100 text-coffee-400'
                              }`}
                              animate={i === step ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 0.4 }}
                            >
                              {i < step ? <Check className="w-4 h-4" /> : i + 1}
                            </motion.div>
                            <span
                              className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
                                i <= step ? 'text-coffee-700' : 'text-coffee-300'
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div
                              className={`w-6 sm:w-10 h-0.5 mx-1 sm:mx-2 rounded transition-colors duration-300 ${
                                i < step ? 'bg-gold-500' : 'bg-coffee-200'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Step Content ───────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                  {/* ── STEP 0: Date ──────────────────────────────────────── */}
                  {step === 0 && !isConfirmed && (
                    <motion.div
                      key="step-date"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-gold-500" />
                        <h3 className="font-display text-lg font-semibold text-coffee-800">
                          Select a Date
                        </h3>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth-custom snap-x snap-mandatory">
                        {dates.map((d) => {
                          const isSelected = selectedDate === d.full;
                          const isToday = d.date.toDateString() === new Date().toDateString();
                          return (
                            <button
                              key={d.full}
                              onClick={() => {
                                setSelectedDate(d.full);
                                setSelectedDateFull(d.full);
                              }}
                              className={`flex-shrink-0 snap-center flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 min-w-[72px] ${
                                isSelected
                                  ? 'border-gold-500 bg-gold-500/10 shadow-lg'
                                  : 'border-coffee-200 hover:border-gold-400 hover:bg-gold-400/5'
                              }`}
                            >
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-coffee-500">
                                {d.dayName}
                              </span>
                              <span
                                className={`text-xl font-bold ${
                                  isSelected ? 'text-gold-600' : 'text-coffee-800'
                                }`}
                              >
                                {d.dayNum}
                              </span>
                              <span className="text-[10px] text-coffee-400">{d.month}</span>
                              {isToday && (
                                <span className="text-[8px] font-bold uppercase tracking-widest text-gold-500">
                                  Today
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 1: Time ──────────────────────────────────────── */}
                  {step === 1 && !isConfirmed && (
                    <motion.div
                      key="step-time"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-gold-500" />
                        <h3 className="font-display text-lg font-semibold text-coffee-800">
                          Select a Time
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                        {timeSlots.map((t) => {
                          const isSelected = selectedTime === t;
                          return (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'gradient-gold text-white shadow-lg'
                                  : 'bg-coffee-50 text-coffee-700 hover:bg-gold-400/10 hover:text-gold-600 border border-coffee-200 hover:border-gold-400'
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Guest Count ───────────────────────────────── */}
                  {step === 2 && !isConfirmed && (
                    <motion.div
                      key="step-guests"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-gold-500" />
                        <h3 className="font-display text-lg font-semibold text-coffee-800">
                          Number of Guests
                        </h3>
                      </div>
                      <div className="flex items-center justify-center gap-8">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                          disabled={guestCount <= 1}
                          className="w-14 h-14 rounded-2xl bg-coffee-50 border-2 border-coffee-200 flex items-center justify-center text-coffee-600 hover:border-gold-400 hover:text-gold-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
                        >
                          <Minus className="w-5 h-5" />
                        </motion.button>
                        <div className="text-center min-w-[80px]">
                          <motion.span
                            key={guestCount}
                            initial={{ scale: 1.3, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="block text-5xl font-bold font-display text-coffee-900"
                          >
                            {guestCount}
                          </motion.span>
                          <span className="text-sm text-coffee-400 font-medium">
                            {guestCount === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setGuestCount((g) => Math.min(10, g + 1))}
                          disabled={guestCount >= 10}
                          className="w-14 h-14 rounded-2xl bg-coffee-50 border-2 border-coffee-200 flex items-center justify-center text-coffee-600 hover:border-gold-400 hover:text-gold-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: Seating ───────────────────────────────────── */}
                  {step === 3 && !isConfirmed && (
                    <motion.div
                      key="step-seating"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Armchair className="w-5 h-5 text-gold-500" />
                        <h3 className="font-display text-lg font-semibold text-coffee-800">
                          Seating Preference
                        </h3>
                      </div>
                      <div className="grid gap-3">
                        {seatingOptions.map((opt) => {
                          const isSelected = selectedSeating === opt.id;
                          return (
                            <motion.button
                              key={opt.id}
                              whileHover={{ y: -2 }}
                              onClick={() => setSelectedSeating(opt.id)}
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                isSelected
                                  ? 'border-gold-500 bg-gold-500/10 shadow-lg'
                                  : 'border-coffee-200 bg-white hover:border-gold-400 hover:shadow-soft'
                              }`}
                            >
                              <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-semibold text-sm ${
                                    isSelected ? 'text-gold-600' : 'text-coffee-800'
                                  }`}
                                >
                                  {opt.name}
                                </p>
                                <p className="text-xs text-coffee-400 mt-0.5">{opt.description}</p>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center flex-shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: Contact Info ──────────────────────────────── */}
                  {step === 4 && !isConfirmed && (
                    <motion.div
                      key="step-contact"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-gold-500" />
                        <h3 className="font-display text-lg font-semibold text-coffee-800">
                          Contact Information
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wider mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl input-skeuomorphic text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wider mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl input-skeuomorphic text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wider mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl input-skeuomorphic text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 5: Confirmation ──────────────────────────────── */}
                  {step === 5 && !isConfirmed && (
                    <motion.div
                      key="step-confirm"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Check className="w-5 h-5 text-gold-500" />
                        <h3 className="font-display text-lg font-semibold text-coffee-800">
                          Booking Summary
                        </h3>
                      </div>
                      <div className="bg-coffee-50 rounded-2xl p-5 space-y-4 border border-coffee-100">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">
                              Date
                            </p>
                            <p className="text-sm font-semibold text-coffee-800">{selectedDateFull}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">
                              Time
                            </p>
                            <p className="text-sm font-semibold text-coffee-800">{selectedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">
                              Guests
                            </p>
                            <p className="text-sm font-semibold text-coffee-800">
                              {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Armchair className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">
                              Seating
                            </p>
                            <p className="text-sm font-semibold text-coffee-800">
                              {seatingOptions.find((s) => s.id === selectedSeating)?.name}
                            </p>
                          </div>
                        </div>
                        <hr className="border-coffee-200" />
                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold">
                              Contact
                            </p>
                            <p className="text-sm font-semibold text-coffee-800">{contactName}</p>
                            <p className="text-xs text-coffee-500">{contactEmail}</p>
                            <p className="text-xs text-coffee-500">{contactPhone}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── CONFIRMED SCREEN ──────────────────────────────────── */}
                  {isConfirmed && (
                    <motion.div
                      key="confirmed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                        className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg"
                      >
                        <Check className="w-10 h-10 text-white" />
                      </motion.div>
                      <h2 className="font-display text-3xl font-bold text-coffee-900 mb-2">
                        Reservation Confirmed!
                      </h2>
                      <p className="text-coffee-500 mb-6">
                        We look forward to welcoming you
                      </p>
                      <div className="bg-coffee-50 rounded-xl p-4 inline-block border border-coffee-100 mb-6">
                        <p className="text-xs text-coffee-400 uppercase tracking-wider font-semibold mb-1">
                          Booking Reference
                        </p>
                        <p className="text-2xl font-mono font-bold text-gold-600">{bookingRef}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => addToast('Calendar event created!', 'success')}
                          className="px-6 py-3 rounded-xl border-2 border-gold-500 text-gold-600 font-semibold text-sm hover:bg-gold-500/10 transition-colors duration-200"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Add to Calendar
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={closeReservation}
                          className="px-6 py-3 rounded-xl gradient-gold text-white font-semibold text-sm shadow-lg"
                        >
                          Done
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Navigation Buttons ──────────────────────────────────── */}
                {!isConfirmed && (
                  <div className="flex items-center justify-between mt-8">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={goBack}
                      disabled={step === 0}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        step === 0
                          ? 'opacity-0 pointer-events-none'
                          : 'text-coffee-600 hover:bg-coffee-100'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>

                    {step < 5 ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={goNext}
                        disabled={!canGoNext()}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          canGoNext()
                            ? 'gradient-gold text-white shadow-lg'
                            : 'bg-coffee-200 text-coffee-400 cursor-not-allowed'
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirm}
                        disabled={!canGoNext()}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          canGoNext()
                            ? 'gradient-gold text-white shadow-lg'
                            : 'bg-coffee-200 text-coffee-400 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        Confirm Reservation
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PROFILE DRAWER ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-espresso/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass shadow-float overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-6 sm:p-8">
                {/* Close button */}
                <button
                  onClick={() => setProfileOpen(false)}
                  className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/90 transition-colors shadow-soft"
                  aria-label="Close profile"
                >
                  <X className="w-4 h-4 text-coffee-700" />
                </button>

                {/* ── Profile Header ──────────────────────────────────────── */}
                <div className="text-center mb-6 pt-2">
                  <div className="w-20 h-20 rounded-full gradient-coffee mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold font-display shadow-lg">
                    AM
                  </div>
                  <h2 className="font-display text-xl font-bold text-coffee-900">Alexandra M.</h2>
                  <p className="text-sm text-coffee-500">alexandra.m@email.com</p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full glass-gold text-xs font-semibold text-gold-600">
                    <Crown className="w-3.5 h-3.5" />
                    Gold Member
                  </div>
                </div>

                {/* ── Stats Row ───────────────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-coffee-50 rounded-2xl p-3 text-center border border-coffee-100">
                    <ShoppingBag className="w-4 h-4 text-gold-500 mx-auto mb-1" />
                    <p className="text-xl font-bold font-display text-coffee-900">47</p>
                    <p className="text-[10px] text-coffee-400 font-semibold uppercase tracking-wider">
                      Total Orders
                    </p>
                  </div>
                  <div className="bg-coffee-50 rounded-2xl p-3 text-center border border-coffee-100">
                    <Star className="w-4 h-4 text-gold-500 mx-auto mb-1" />
                    <p className="text-xl font-bold font-display text-coffee-900">2,450</p>
                    <p className="text-[10px] text-coffee-400 font-semibold uppercase tracking-wider">
                      Reward Pts
                    </p>
                  </div>
                  <div className="bg-coffee-50 rounded-2xl p-3 text-center border border-coffee-100">
                    <Calendar className="w-4 h-4 text-gold-500 mx-auto mb-1" />
                    <p className="text-xl font-bold font-display text-coffee-900">12</p>
                    <p className="text-[10px] text-coffee-400 font-semibold uppercase tracking-wider">
                      Reservations
                    </p>
                  </div>
                </div>

                {/* ── Loyalty Progress ────────────────────────────────────── */}
                <div className="bg-coffee-50 rounded-2xl p-5 border border-coffee-100 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold-500" />
                      <span className="text-sm font-bold text-coffee-800">Loyalty Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gold-600">Gold</span>
                      <ChevronRight className="w-3 h-3 text-coffee-300" />
                      <span className="text-xs font-semibold text-coffee-400">Platinum</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-coffee-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #c49a2a, #d4a843, #e6c36a)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: '49%' }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-coffee-500 text-right">
                    2,450 / 5,000 pts to Platinum
                  </p>

                  {/* Benefits */}
                  <div className="mt-4 pt-4 border-t border-coffee-200">
                    <p className="text-[10px] text-coffee-400 uppercase tracking-wider font-bold mb-2">
                      Gold Benefits
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {loyaltyBenefits.map((b) => (
                        <div key={b} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-xs text-coffee-700 font-medium">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Recent Orders ───────────────────────────────────────── */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-4 h-4 text-gold-500" />
                    <h3 className="font-display text-base font-bold text-coffee-800">Recent Orders</h3>
                  </div>
                  <div className="space-y-3">
                    {sampleOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl p-4 border border-coffee-100 shadow-soft"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-coffee-800 font-mono">{order.id}</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              order.status === 'Completed'
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-coffee-400 mb-1.5">{order.date}</p>
                        <p className="text-xs text-coffee-600 mb-2 line-clamp-1">
                          {order.items.join(' • ')}
                        </p>
                        <p className="text-sm font-bold text-coffee-900">₹{order.total}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Upcoming Reservations ───────────────────────────────── */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <h3 className="font-display text-base font-bold text-coffee-800">
                      Upcoming Reservations
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {sampleReservations.map((res, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 border border-coffee-100 shadow-soft"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-coffee-800">{res.date}</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              res.status === 'Confirmed'
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-coffee-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {res.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {res.guests} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Armchair className="w-3 h-3" />
                            {res.seating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Favorites ───────────────────────────────────────────── */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-gold-500" />
                    <h3 className="font-display text-base font-bold text-coffee-800">Favorites</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {favoriteItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-white rounded-xl p-3 border border-coffee-100 shadow-soft hover:border-gold-400 transition-colors duration-200"
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-coffee-800 truncate">{item.name}</p>
                        </div>
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Edit Profile Button ─────────────────────────────────── */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-coffee-200 text-coffee-700 font-semibold text-sm hover:border-gold-500 hover:text-gold-600 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}