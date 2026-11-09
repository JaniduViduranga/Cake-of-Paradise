import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Home,
  Images,
  Cake,
  Info,
  MapPin,
  Clock,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import CartSidebar from '../common/CartSidebar';
import heroLogo from '../../../assets/HeroLogo.jpg';

const NAV_LINKS = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Gallery', path: '/gallery', icon: Images },
  { label: 'Custom Order', path: '/custom-order', icon: Cake },
  { label: 'About & Contact', path: '/about', icon: Info },
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/about') return location.pathname === '/about' || location.pathname === '/contact';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${mobileOpen
            ? 'bg-white border-b border-brand-border shadow-md'
            : scrolled
              ? 'navbar-glass shadow-sm'
              : 'navbar-glass'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-playfair font-semibold text-xl sm:text-2xl text-brand-accent shrink-0 hover:text-brand-primary-hover transition-colors min-h-[44px] min-w-[44px] py-1"
            aria-label="Cake of Paradise Home"
          >
            <img
              src={heroLogo}
              alt="Cake of Paradise Logo"
              className="w-8 h-8 rounded-full object-cover border border-brand-border/60 shadow-xs"
            />
            <span className="tracking-tight">Cake of Paradise</span>
          </Link>

          {/* Desktop Nav (md:flex) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-xs uppercase tracking-wider py-2 transition-colors ${isActive(link.path)
                    ? 'nav-link-active border-b-2 border-brand-accent text-brand-accent font-bold'
                    : 'text-chocolate-800/80 hover:text-brand-accent'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions (md:flex) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Cart */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-chocolate-800/70 hover:text-brand-accent transition-colors rounded-lg"
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
                  className="flex items-center gap-1.5 min-w-[44px] min-h-[44px] p-2 text-chocolate-800/70 hover:text-brand-accent transition-colors rounded-lg"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <User size={20} strokeWidth={1.8} />
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-brand-border py-2 animate-scale-in z-50">
                    <div className="px-4 py-2 border-b border-brand-border/60 mb-1">
                      <p className="font-montserrat text-xs font-semibold text-chocolate-900 truncate">
                        {user.name || user.fullName}
                      </p>
                      <p className="font-montserrat text-xs text-chocolate-800/50 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-montserrat text-chocolate-800 hover:bg-cream-50 hover:text-brand-accent transition-colors"
                    >
                      My Profile
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-montserrat text-brand-accent font-semibold hover:bg-cream-50 transition-colors flex items-center justify-between"
                      >
                        <span>Admin Portal</span>
                        <span className="text-[10px] bg-brand-primary-light text-brand-accent px-1.5 py-0.5 rounded font-bold">
                          Staff
                        </span>
                      </button>
                    )}
                    <div className="border-t border-brand-border/60 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-montserrat text-red-500 hover:bg-red-50 transition-colors"
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
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-chocolate-800/70 hover:text-brand-accent transition-colors rounded-lg"
                aria-label="Sign in"
              >
                <User size={20} strokeWidth={1.8} />
              </button>
            )}
          </div>

          {/* Mobile: Cart + Profile/User + Hamburger (md:hidden) */}
          <div className="md:hidden flex items-center gap-1">
            {/* Mobile Cart Trigger with 44px min touch target */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-chocolate-800/80 hover:text-brand-accent transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} strokeWidth={1.8} />
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </button>

            {/* Mobile Profile / Sign In trigger with 44px touch target */}
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/profile')}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-chocolate-800/80 hover:text-brand-accent transition-colors"
                aria-label="Open profile"
              >
                <User size={22} strokeWidth={1.8} />
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-chocolate-800/80 hover:text-brand-accent transition-colors"
                aria-label="Sign in"
              >
                <User size={22} strokeWidth={1.8} />
              </button>
            )}

            {/* Mobile Hamburger menu toggle with 44px min touch target */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-chocolate-800/80 hover:text-brand-accent transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sliding Drawer & Backdrop Overlay */}
        {mobileOpen && (
          <>
            {/* Solid dark backdrop to dim page content underneath */}
            <div
              className="fixed inset-0 top-16 bg-black/60 z-40 md:hidden animate-fade-in"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Drawer with 100% Solid Opaque Background (cannot see through) */}
            <div className="md:hidden fixed top-16 left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white border-b border-brand-border shadow-2xl z-50 animate-fade-in">
              <div className="p-4 sm:p-6 flex flex-col gap-3">
                {/* Navigation items styled like a modern mobile app */}
                <div className="space-y-1.5">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.path);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-montserrat font-medium text-base transition-all ${active
                            ? 'bg-brand-bg-hero text-brand-accent font-bold border border-brand-border shadow-xs'
                            : 'text-brand-text-dark hover:bg-cream-50 hover:text-brand-accent border border-transparent'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${active
                                ? 'bg-brand-primary text-white shadow-xs'
                                : 'bg-brand-bg-hero text-brand-text-dark'
                              }`}
                          >
                            <Icon size={18} />
                          </div>
                          <span className="text-sm sm:text-base">{link.label}</span>
                        </div>
                        <ChevronRight
                          size={18}
                          className={active ? 'text-brand-accent' : 'text-brand-text-muted/60'}
                        />
                      </Link>
                    );
                  })}

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-2xl font-montserrat font-semibold text-base text-brand-accent bg-brand-bg-hero/80 border border-brand-border hover:bg-brand-bg-hero transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-accent text-white flex items-center justify-center shadow-xs">
                          <ShieldCheck size={18} />
                        </div>
                        <span className="text-sm sm:text-base">Admin Portal</span>
                      </div>
                      <span className="text-[11px] bg-brand-accent text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Staff
                      </span>
                    </Link>
                  )}
                </div>

                {/* Authentication / User Section */}
                <div className="pt-3 mt-1 border-t border-brand-border">
                  {isLoggedIn ? (
                    <div className="space-y-2.5">
                      <div className="p-3 bg-brand-bg-hero rounded-2xl border border-brand-border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                          {(user.name || user.fullName || 'U')
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-montserrat text-sm font-semibold text-brand-text-dark truncate">
                            {user.name || user.fullName}
                          </p>
                          <p className="font-montserrat text-xs text-brand-text-muted truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/profile');
                            setMobileOpen(false);
                          }}
                          className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-brand-border font-montserrat font-semibold text-sm text-brand-text-dark bg-white hover:bg-cream-50 transition-colors"
                        >
                          My Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setMobileOpen(false);
                          }}
                          className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl font-montserrat font-semibold text-sm text-red-600 bg-red-50/50 border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-montserrat font-semibold text-base shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <User size={18} />
                      <span>Sign In / Sign Up</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Click outside to close desktop user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
