import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import CartSidebar from '../common/CartSidebar';
import heroLogo from '../../../assets/HeroLogo.jpg';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Custom Order', path: '/custom-order' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, logout, setIsLoginOpen } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass shadow-sm' : 'navbar-glass'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-playfair italic font-semibold text-2xl text-caramel-600 shrink-0 hover:text-caramel-700 transition-colors"
          >
            <img src={heroLogo} alt="Cake of Paradise Logo" className="w-8 h-8 object-contain" />
            Cake of Paradise
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-xs uppercase ${isActive(link.path)
                    ? 'nav-link-active border-b-2 border-caramel-600 pb-0.5'
                    : ''
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-chocolate-800/70 hover:text-caramel-600 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="badge animate-scale-in">{itemCount}</span>
              )}
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 p-2 text-chocolate-800/70 hover:text-caramel-600 transition-colors"
                  aria-label="User menu"
                >
                  <User size={20} strokeWidth={1.8} />
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-scale-in z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="font-montserrat text-xs font-semibold text-chocolate-900 truncate">{user.name}</p>
                      <p className="font-montserrat text-xs text-chocolate-800/50 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm font-montserrat text-chocolate-800 hover:bg-cream-50 hover:text-caramel-600 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm font-montserrat text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={() => setIsLoginOpen(true)}
                className="p-2 text-chocolate-800/70 hover:text-caramel-600 transition-colors"
                aria-label="Sign in"
              >
                <User size={20} strokeWidth={1.8} />
              </button>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-chocolate-800/70"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} strokeWidth={1.8} />
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-chocolate-800/70"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-cream-50/95 backdrop-blur-lg border-t border-caramel-600/10 animate-fade-in">
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-3 font-montserrat font-semibold text-sm tracking-wide border-b border-gray-100 last:border-0 ${isActive(link.path) ? 'text-caramel-600' : 'text-chocolate-800/70'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex gap-3">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex-1 btn-secondary text-center py-2.5"
                    >
                      My Profile
                    </button>
                    <button onClick={logout} className="flex-1 py-2.5 text-sm font-montserrat font-semibold text-red-500 border border-red-200 rounded">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsLoginOpen(true)} className="flex-1 btn-primary py-2.5">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
