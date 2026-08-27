import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './views/components/layout/Navbar';
import Footer from './views/components/layout/Footer';
import LoginModal from './views/components/common/LoginModal';
import Home from './views/pages/Home';
import Menu from './views/pages/Menu';
import Gallery from './views/pages/Gallery';
import CustomOrder from './views/pages/CustomOrder';
import About from './views/pages/About';
import Contact from './views/pages/Contact';
import Checkout from './views/pages/Checkout';
import Profile from './views/pages/Profile';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 px-6 text-center">
                <div className="text-8xl mb-6">🎂</div>
                <h1 className="font-playfair font-bold text-5xl text-chocolate-900 mb-4">404</h1>
                <p className="font-montserrat text-lg text-chocolate-800/60 mb-8">
                  Oops! This page seems to have crumbled away.
                </p>
                <a href="/" className="btn-primary">
                  Back to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}