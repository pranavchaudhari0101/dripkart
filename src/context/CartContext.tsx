import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useUser } from '@clerk/react';
import { api } from '../lib/api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeFromCart: (id: string, size: string) => Promise<void>;
  updateQuantity: (id: string, size: string, quantity: number) => Promise<void>;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadLocalCart(): CartItem[] {
  try {
    const saved = localStorage.getItem('dripkart-cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load cart from storage', e);
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  localStorage.setItem('dripkart-cart', JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>(loadLocalCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine if we should use backend or localStorage
  const useBackend = !!isSignedIn;

  // Sync backend cart on login
  useEffect(() => {
    if (isSignedIn) {
      syncBackendCart();
    }
  }, [isSignedIn]);

  // Persist to localStorage for guests
  useEffect(() => {
    if (!useBackend) {
      saveLocalCart(cartItems);
    }
  }, [cartItems, useBackend]);

  const syncBackendCart = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cart');
      // Map backend cart items to frontend CartItem shape
      const backendItems: CartItem[] = res.data.items.map((item: any) => ({
        id: item.product?.id || item.productId,
        name: item.product?.name || 'Unknown',
        price: Number(item.product?.price) || 0,
        image: item.product?.image || '',
        size: item.size,
        quantity: item.quantity,
      }));
      setCartItems(backendItems);
    } catch (err) {
      console.warn('Failed to sync cart from backend', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);

    if (useBackend) {
      try {
        await api.post('/cart/add', { productId: item.id, size: item.size, quantity });
      } catch (err) {
        console.error('Failed to sync add to cart', err);
      }
    }
  }, [useBackend]);

  const removeFromCart = useCallback(async (id: string, size: string) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)));

    if (useBackend) {
      try {
        await api.delete(`/cart/remove?productId=${encodeURIComponent(id)}&size=${encodeURIComponent(size)}`);
      } catch (err) {
        console.error('Failed to sync remove from cart', err);
      }
    }
  }, [useBackend]);

  const updateQuantity = useCallback(async (id: string, size: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id, size);
    setCartItems(prev => prev.map(i =>
      i.id === id && i.size === size ? { ...i, quantity } : i
    ));

    if (useBackend) {
      try {
        await api.put('/cart/update', { productId: id, size, quantity });
      } catch (err) {
        console.error('Failed to sync cart update', err);
      }
    }
  }, [useBackend, removeFromCart]);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    if (useBackend) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.error('Failed to sync clear cart', err);
      }
    }
  }, [useBackend]);

  return (
    <CartContext.Provider value={{
      cartItems, isCartOpen, isLoading, addToCart, removeFromCart,
      updateQuantity, toggleCart, cartTotal, cartCount, clearCart,
      refreshCart: syncBackendCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
