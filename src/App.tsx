import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthSync } from './hooks/useAuthSync';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load pages for faster initial load
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Collections = lazy(() => import('./pages/Collections').then(m => ({ default: m.Collections })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Editorial = lazy(() => import('./pages/Editorial').then(m => ({ default: m.Editorial })));
const Collective = lazy(() => import('./pages/Collective').then(m => ({ default: m.Collective })));
const Shipping = lazy(() => import('./pages/Shipping').then(m => ({ default: m.Shipping })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 3, // 3 min
      gcTime: 1000 * 60 * 10,   // 10 min
      refetchOnWindowFocus: false,
    },
  },
});

// Minimal loading spinner
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bgPrimary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-accentColor border-t-transparent rounded-full animate-spin" />
        <span className="font-body text-[11px] uppercase tracking-[0.3em] text-brand-textMuted">Loading</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <div className="bg-brand-bgPrimary min-h-screen text-brand-textPrimary font-body">
            <AuthSync />
            <Nav />
            <CartDrawer />
            <Suspense fallback={<PageLoader />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/editorial" element={<Editorial />} />
                  <Route path="/collective" element={<Collective />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
