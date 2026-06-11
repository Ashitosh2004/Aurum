import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isBestseller: boolean;
  isLimited: boolean;
  isNew: boolean;
  popularity: number;
  tags: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface ReservationData {
  date: string;
  time: string;
  guests: number;
  seating: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  loyaltyLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  totalOrders: number;
  favorites: string[];
  reservations: ReservationData[];
  orderHistory: { id: string; items: CartItem[]; total: number; date: string; status: string }[];
}

interface CafeState {
  // Loading
  isLoading: boolean;
  loadingProgress: number;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // UI State
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setReservationOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;

  // Coupon
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  rewardPoints: number;
  addRewardPoints: (points: number) => void;

  // Toast
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useCafeStore = create<CafeState>((set, get) => ({
  // Loading
  isLoading: true,
  loadingProgress: 0,
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  // Cart
  cart: [],
  addToCart: (item) => {
    const { cart } = get();
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      set({
        cart: cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)),
      });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] });
    }
    get().addToast(`${item.name} added to cart!`, 'success');
  },
  removeFromCart: (id) => {
    set({ cart: get().cart.filter((c) => c.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id);
    } else {
      set({ cart: get().cart.map((c) => (c.id === id ? { ...c, quantity } : c)) });
    }
  },
  clearCart: () => set({ cart: [], appliedCoupon: null, couponDiscount: 0 }),
  cartTotal: () => {
    const { cart, couponDiscount } = get();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    return Math.max(0, subtotal + tax - couponDiscount);
  },
  cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

  // Favorites
  favorites: [],
  toggleFavorite: (id) => {
    const { favorites } = get();
    if (favorites.includes(id)) {
      set({ favorites: favorites.filter((f) => f !== id) });
    } else {
      set({ favorites: [...favorites, id] });
    }
  },

  // UI State
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  isReservationOpen: false,
  setReservationOpen: (open) => set({ isReservationOpen: open }),
  isProfileOpen: false,
  setProfileOpen: (open) => set({ isProfileOpen: open }),
  isCheckoutOpen: false,
  setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  activeCategory: 'all',
  setActiveCategory: (category) => set({ activeCategory: category }),

  // Coupon
  appliedCoupon: null,
  couponDiscount: 0,
  applyCoupon: (code) => {
    const coupons: Record<string, number> = {
      WELCOME10: 10,
      COFFEE20: 20,
      VIP30: 30,
      FIRST15: 15,
    };
    const discount = coupons[code.toUpperCase()];
    if (discount) {
      set({ appliedCoupon: code.toUpperCase(), couponDiscount: discount });
      get().addToast(`Coupon ${code.toUpperCase()} applied! ${discount}% off`, 'success');
      return true;
    }
    get().addToast('Invalid coupon code', 'error');
    return false;
  },
  removeCoupon: () => set({ appliedCoupon: null, couponDiscount: 0 }),

  // User
  user: null,
  setUser: (user) => set({ user }),
  rewardPoints: 250,
  addRewardPoints: (points) => set({ rewardPoints: get().rewardPoints + points }),

  // Toast
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
