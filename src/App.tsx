import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Checkout } from './pages/Checkout';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderTracking } from './pages/OrderTracking';
import { Admin } from './pages/Admin';
import { Cart } from './pages/Cart';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <div className="bg-brand-bgPrimary min-h-screen text-brand-textPrimary font-body">
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
