'use client';

import { useCafeStore } from '@/store/cafe-store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  Smartphone,
  Wallet,
  ChevronRight,
  ChevronLeft,
  Check,
  Download,
  Truck,
  Clock,
  Award,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const AVAILABLE_COUPONS = [
  { code: 'WELCOME10', discount: 10 },
  { code: 'COFFEE20', discount: 20 },
  { code: 'FIRST15', discount: 15 },
];

type CheckoutStep = 'delivery' | 'payment' | 'processing' | 'success';

export default function CartAndCheckout() {
  const {
    cart,
    isCartOpen,
    isCheckoutOpen,
    setCartOpen,
    setCheckoutOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    addToast,
    addRewardPoints,
    cartTotal,
    cartCount,
  } = useCafeStore();

  const [couponInput, setCouponInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [orderId, setOrderId] = useState('');
  const [chipRotation, setChipRotation] = useState(0);

  // Delivery form state
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const prevCheckoutOpenRef = useRef(isCheckoutOpen);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const discountAmount = couponDiscount > 0 ? (subtotal * couponDiscount) / 100 : 0;
  const total = Math.max(0, subtotal + tax - discountAmount);
  const itemCount = cartCount();

  // Animate chip rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setChipRotation((prev) => (prev + 360) % 360);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Reset checkout state when checkout opens (false → true transition)
  useEffect(() => {
    const wasOpen = prevCheckoutOpenRef.current;
    prevCheckoutOpenRef.current = isCheckoutOpen;
    if (!wasOpen && isCheckoutOpen) {
      // Schedule state resets for next render to avoid synchronous setState in effect
      const id = requestAnimationFrame(() => {
        setCheckoutStep('delivery');
        setPaymentMethod('card');
        setOrderId('');
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isCheckoutOpen]);

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCouponChipClick = (code: string) => {
    applyCoupon(code);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }
    setCartOpen(false);
    setTimeout(() => {
      setCheckoutOpen(true);
    }, 200);
  };

  const handleBackToCart = () => {
    setCheckoutOpen(false);
    setTimeout(() => {
      setCartOpen(true);
    }, 200);
  };

  const handleDeliveryNext = () => {
    if (!deliveryName.trim() || !deliveryAddress.trim() || !deliveryPhone.trim()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePaymentConfirm = () => {
    setCheckoutStep('processing');
    // Simulate processing delay
    setTimeout(() => {
      const newOrderId = 'CF' + Math.random().toString(36).substring(2, 10).toUpperCase();
      setOrderId(newOrderId);
      addRewardPoints(50);
      setCheckoutStep('success');
    }, 2500);
  };

  const handleDownloadReceipt = () => {
    addToast('Receipt download started!', 'info');
  };

  const handleBackToMenu = () => {
    setCheckoutOpen(false);
    clearCart();
    setDeliveryName('');
    setDeliveryAddress('');
    setDeliveryPhone('');
    setDeliveryNotes('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setCartOpen(false);
    }
  };

  return (
    <>
      {/* ========== SHOPPING CART DRAWER ========== */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={handleOverlayClick}
            />

            {/* Cart Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 glass shadow-premium flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-coffee-200/50">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold font-display text-espresso">Your Cart</h2>
                  {itemCount > 0 && (
                    <span className="gradient-gold text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="h-9 w-9 rounded-full border border-coffee-200 flex items-center justify-center hover:bg-coffee-100 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4 text-espresso" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-coffee-100 flex items-center justify-center mb-4">
                      <ShoppingCartEmptyIcon />
                    </div>
                    <p className="text-muted-foreground font-medium mb-1">Your cart is empty</p>
                    <p className="text-sm text-coffee-400">Add some delicious items to get started</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="p-6 space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          className="flex gap-4 p-3 rounded-xl bg-white/60 border border-coffee-100/50"
                        >
                          {/* Thumbnail */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover shadow-soft"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-semibold text-espresso truncate">
                                {item.name}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center hover:bg-red-50 text-coffee-400 hover:text-red-500 transition-colors"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <p className="text-sm font-bold text-gold-600 mt-0.5">
                              ₹{(item.price * item.quantity)}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 rounded-full border border-coffee-200 flex items-center justify-center hover:bg-coffee-100 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center text-espresso">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 rounded-full border border-coffee-200 flex items-center justify-center hover:bg-coffee-100 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <span className="text-xs text-muted-foreground ml-auto">
                                @ ₹{item.price} each
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Coupon Section */}
                    <div className="px-6 pb-4">
                      <div className="p-4 rounded-xl bg-white/40 border border-coffee-100/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="h-4 w-4 text-gold-600" />
                          <span className="text-sm font-semibold text-espresso">Coupon Code</span>
                        </div>

                        {/* Applied Coupon */}
                        {appliedCoupon && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/30"
                          >
                            <div className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-gold-600" />
                              <span className="text-sm font-semibold text-gold-600">{appliedCoupon}</span>
                              <span className="text-xs text-gold-600/70">({couponDiscount}% off)</span>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-xs text-coffee-400 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </motion.div>
                        )}

                        {/* Coupon Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Enter code"
                            className="flex-1 input-skeuomorphic rounded-lg px-3 py-2 text-sm outline-none"
                            disabled={!!appliedCoupon}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={!!appliedCoupon}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-espresso text-cream hover:bg-coffee-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Available Coupons */}
                        {!appliedCoupon && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {AVAILABLE_COUPONS.map((coupon) => (
                              <button
                                key={coupon.code}
                                onClick={() => handleCouponChipClick(coupon.code)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium border border-gold-400/30 text-gold-600 bg-gold-400/5 hover:bg-gold-400/15 transition-colors"
                              >
                                {coupon.code} — {coupon.discount}% off
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 pb-4">
                      <div className="p-4 rounded-xl bg-white/40 border border-coffee-100/50 space-y-2.5">
                        <h3 className="text-sm font-semibold text-espresso mb-3">Order Summary</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium text-espresso">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax (8%)</span>
                          <span className="font-medium text-espresso">₹{Math.round(tax)}</span>
                        </div>
                        {couponDiscount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-green-600 font-medium">
                              Discount ({couponDiscount}%)
                            </span>
                            <span className="font-medium text-green-600">
                              -₹{Math.round(discountAmount)}
                            </span>
                          </motion.div>
                        )}
                        <div className="border-t border-coffee-200/50 pt-2.5 flex justify-between">
                          <span className="text-base font-bold text-espresso">Total</span>
                          <span className="text-base font-bold text-gold-600">
                            ₹{Math.round(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Estimate & Rewards */}
                    <div className="px-6 pb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4 text-coffee-400" />
                        <span>Estimated delivery: 25-35 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gold-600">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">Earn 50 points with this order</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-coffee-200/50 space-y-3">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 rounded-xl gradient-gold text-white font-bold text-sm tracking-wide shadow-float hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== CHECKOUT PANEL ========== */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-cream rounded-2xl shadow-premium overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Progress Indicator */}
              {checkoutStep !== 'success' && checkoutStep !== 'processing' && (
                <div className="px-6 pt-6">
                  <div className="flex items-center gap-2">
                    {['Delivery', 'Payment', 'Confirm'].map((label, i) => {
                      const steps: CheckoutStep[] = ['delivery', 'payment', 'success'];
                      const currentIdx = steps.indexOf(checkoutStep);
                      const isActive = i === currentIdx;
                      const isCompleted = i < currentIdx;
                      return (
                        <div key={label} className="flex items-center flex-1">
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                isCompleted
                                  ? 'gradient-gold text-white'
                                  : isActive
                                    ? 'gradient-gold text-white animate-pulse-glow'
                                    : 'bg-coffee-100 text-coffee-400'
                              }`}
                            >
                              {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                            </div>
                            <span
                              className={`text-xs font-medium hidden sm:block transition-colors ${
                                isActive || isCompleted ? 'text-espresso' : 'text-coffee-400'
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                          {i < 2 && (
                            <div
                              className={`h-px flex-1 mx-2 transition-colors ${
                                isCompleted ? 'bg-gold-500' : 'bg-coffee-200'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Step 1: Delivery Details */}
                {checkoutStep === 'delivery' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 space-y-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={handleBackToCart}
                        className="h-8 w-8 rounded-full border border-coffee-200 flex items-center justify-center hover:bg-coffee-100 transition-colors"
                        aria-label="Back to cart"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h2 className="text-lg font-bold font-display text-espresso">
                        Delivery Details
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-espresso mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryName}
                          onChange={(e) => setDeliveryName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full input-skeuomorphic rounded-lg px-4 py-2.5 text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-espresso mb-1.5">
                          Delivery Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="123 Coffee Street, Suite 4"
                          className="w-full input-skeuomorphic rounded-lg px-4 py-2.5 text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-espresso mb-1.5">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={deliveryPhone}
                          onChange={(e) => setDeliveryPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full input-skeuomorphic rounded-lg px-4 py-2.5 text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-espresso mb-1.5">
                          Delivery Notes
                        </label>
                        <textarea
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Any special instructions for delivery..."
                          rows={3}
                          className="w-full input-skeuomorphic rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Order Summary Mini */}
                    <div className="p-4 rounded-xl bg-white/60 border border-coffee-100/50">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{itemCount} items</span>
                        <span className="font-medium text-espresso">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium text-espresso">₹{Math.round(tax)}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-600 font-medium">Discount</span>
                          <span className="font-medium text-green-600">
                            -₹{Math.round(discountAmount)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-coffee-200/50 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-espresso">Total</span>
                        <span className="font-bold text-gold-600">₹{Math.round(total)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDeliveryNext}
                      className="w-full py-3.5 rounded-xl gradient-gold text-white font-bold text-sm tracking-wide shadow-float hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {checkoutStep === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 space-y-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => setCheckoutStep('delivery')}
                        className="h-8 w-8 rounded-full border border-coffee-200 flex items-center justify-center hover:bg-coffee-100 transition-colors"
                        aria-label="Back to delivery"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h2 className="text-lg font-bold font-display text-espresso">
                        Payment Method
                      </h2>
                    </div>

                    {/* Credit/Debit Card Option */}
                    <div className="space-y-3">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === 'card'
                            ? 'border-gold-500 bg-gold-400/5 shadow-float'
                            : 'border-coffee-200/50 bg-white/60 hover:border-coffee-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === 'card' ? 'gradient-gold' : 'bg-coffee-100'
                            }`}
                          >
                            <CreditCard
                              className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-white' : 'text-coffee-500'}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-espresso">Credit/Debit Card</p>
                            <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                          </div>
                          {paymentMethod === 'card' && (
                            <Check className="h-5 w-5 text-gold-600" />
                          )}
                        </div>
                      </button>

                      {/* Animated Card Visual */}
                      {paymentMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                          <div className="relative rounded-2xl overflow-hidden gradient-coffee text-white p-6 shadow-float shine-effect">
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold-400/30 -translate-y-1/2 translate-x-1/2" />
                              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gold-400/20 translate-y-1/2 -translate-x-1/2" />
                            </div>
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-8">
                                <div className="text-xs font-medium opacity-70 uppercase tracking-wider">
                                  Café Noir
                                </div>
                                <motion.div
                                  animate={{ rotate: chipRotation }}
                                  transition={{ duration: 2, ease: 'easeInOut' }}
                                  className="w-10 h-7 rounded-md bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 shadow-inner-soft flex items-center justify-center"
                                >
                                  <div className="w-6 h-4 border border-gold-300/40 rounded-sm" />
                                </motion.div>
                              </div>
                              <div className="text-lg tracking-[0.25em] font-mono mb-6 opacity-90">
                                •••• •••• •••• 4242
                              </div>
                              <div className="flex justify-between items-end">
                                <div>
                                  <div className="text-[10px] opacity-50 uppercase tracking-wider">
                                    Card Holder
                                  </div>
                                  <div className="text-sm font-medium">
                                    {deliveryName || 'YOUR NAME'}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] opacity-50 uppercase tracking-wider">
                                    Expires
                                  </div>
                                  <div className="text-sm font-medium">12/28</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* UPI Payment Option */}
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === 'upi'
                            ? 'border-gold-500 bg-gold-400/5 shadow-float'
                            : 'border-coffee-200/50 bg-white/60 hover:border-coffee-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === 'upi' ? 'gradient-gold' : 'bg-coffee-100'
                            }`}
                          >
                            <Smartphone
                              className={`h-5 w-5 ${paymentMethod === 'upi' ? 'text-white' : 'text-coffee-500'}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-espresso">UPI Payment</p>
                            <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                          </div>
                          {paymentMethod === 'upi' && (
                            <Check className="h-5 w-5 text-gold-600" />
                          )}
                        </div>
                      </button>

                      {/* Wallet Option */}
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === 'wallet'
                            ? 'border-gold-500 bg-gold-400/5 shadow-float'
                            : 'border-coffee-200/50 bg-white/60 hover:border-coffee-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === 'wallet' ? 'gradient-gold' : 'bg-coffee-100'
                            }`}
                          >
                            <Wallet
                              className={`h-5 w-5 ${paymentMethod === 'wallet' ? 'text-white' : 'text-coffee-500'}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-espresso">Wallet</p>
                            <p className="text-xs text-muted-foreground">PayPal, Apple Pay</p>
                          </div>
                          {paymentMethod === 'wallet' && (
                            <Check className="h-5 w-5 text-gold-600" />
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Total Display */}
                    <div className="p-4 rounded-xl bg-white/60 border border-coffee-100/50 flex items-center justify-between">
                      <span className="font-semibold text-espresso">Amount to Pay</span>
                      <span className="text-xl font-bold text-gold-600">₹{Math.round(total)}</span>
                    </div>

                    <button
                      onClick={handlePaymentConfirm}
                      className="w-full py-3.5 rounded-xl gradient-gold text-white font-bold text-sm tracking-wide shadow-float hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <LockIcon />
                      Pay ₹{Math.round(total)}
                    </button>

                    <p className="text-center text-xs text-coffee-400">
                      This is a demo. No real payment will be processed.
                    </p>
                  </motion.div>
                )}

                {/* Processing State */}
                {checkoutStep === 'processing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 px-6 text-center"
                  >
                    <div className="relative mb-8">
                      {/* Spinning coffee cup */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 rounded-full border-4 border-coffee-100 border-t-gold-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <CoffeeCupIcon />
                        </motion.div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold font-display text-espresso mb-2">
                      Processing your order...
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Please wait while we prepare your order for delivery
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm text-coffee-400">
                      <Clock className="h-4 w-4" />
                      <span>Estimating delivery time...</span>
                    </div>
                  </motion.div>
                )}

                {/* Success State */}
                {checkoutStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center py-12 px-6 text-center"
                  >
                    {/* Animated Checkmark */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 200,
                        delay: 0.2,
                      }}
                      className="relative mb-6"
                    >
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: 'spring',
                            damping: 12,
                            stiffness: 200,
                            delay: 0.4,
                          }}
                          className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-float"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring', damping: 10 }}
                          >
                            <Check className="h-8 w-8 text-white" strokeWidth={3} />
                          </motion.div>
                        </motion.div>
                      </div>
                      {/* Confetti dots */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            x: Math.cos((i * Math.PI) / 4) * 50,
                            y: Math.sin((i * Math.PI) / 4) * 50,
                          }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ['#c49a2a', '#946b3a', '#22c55e', '#d4a843'][i % 4],
                          }}
                        />
                      ))}
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-2xl font-bold font-display text-espresso mb-2"
                    >
                      Order Confirmed!
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="text-sm text-muted-foreground mb-1"
                    >
                      Your order has been placed successfully
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="flex items-center gap-2 text-sm text-gold-600 font-semibold mb-1"
                    >
                      <Award className="h-4 w-4" />
                      <span>+50 reward points earned!</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="my-4 px-4 py-2 rounded-lg bg-coffee-100/60 border border-coffee-200/50"
                    >
                      <p className="text-xs text-muted-foreground">Order ID</p>
                      <p className="text-sm font-mono font-bold text-espresso">{orderId}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
                    >
                      <Truck className="h-4 w-4 text-coffee-400" />
                      <span>
                        Estimated delivery:{' '}
                        <span className="font-semibold text-espresso">25-35 minutes</span>
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 }}
                      className="w-full space-y-3"
                    >
                      <button
                        onClick={handleDownloadReceipt}
                        className="w-full py-3.5 rounded-xl border-2 border-coffee-200 text-espresso font-bold text-sm tracking-wide hover:bg-coffee-100/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Receipt
                      </button>
                      <button
                        onClick={handleBackToMenu}
                        className="w-full py-3.5 rounded-xl gradient-gold text-white font-bold text-sm tracking-wide shadow-float hover:opacity-90 transition-opacity"
                      >
                        Back to Menu
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== Inline SVG Sub-Components ===== */

function ShoppingCartEmptyIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-coffee-400"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CoffeeCupIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold-600"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}