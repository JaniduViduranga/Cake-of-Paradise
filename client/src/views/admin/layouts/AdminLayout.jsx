import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Clock,
  Calendar,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { getAllOrders } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Keep live time ticking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch count of active orders (Baking, Decorating, Received)
  useEffect(() => {
    const loadActiveCount = async () => {
      try {
        const res = await getAllOrders();
        const orders = res.data?.data || res.data?.orders || [];
        const active = orders.filter((o) =>
          ['Received', 'Baking', 'Decorating'].includes(o.orderStatus)
        ).length;
        setActiveOrdersCount(active);
      } catch (err) {
        // Silently fallback
      }
    };
    loadActiveCount();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CP';

  return (
    <div className="min-h-screen bg-brand-bg-hero/50 flex font-montserrat antialiased text-brand-text-dark">
      {/* Sidebar */}
      <AdminSidebar
        activeOrdersCount={activeOrdersCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header - Rearranged with Live Date & Time on Left */}
        <header className="sticky top-0 z-30 bg-brand-surface/95 backdrop-blur-md border-b border-brand-border px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
          {/* Left: Mobile Menu Button + Live Date & Real-time Clock */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-brand-text-dark hover:text-brand-accent hover:bg-brand-bg-hero rounded-xl transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            {/* Live Date & Time Badge */}
            <div className="flex items-center gap-2.5 text-xs font-montserrat bg-brand-bg-hero text-brand-text-body px-3.5 py-1.5 rounded-xl border border-brand-border">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-brand-accent" />
                <span className="font-semibold text-brand-text-dark">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <span className="text-brand-border">|</span>
              <div className="flex items-center gap-1.5 font-mono text-brand-text-body">
                <Clock size={13} className="text-brand-accent" />
                <span>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Utilities: View Store + Profile + Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* View public store shortcut */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-text-dark hover:text-brand-accent px-3.5 py-1.5 rounded-xl border border-brand-border hover:border-brand-accent hover:bg-brand-bg-hero transition-all shadow-2xs"
            >
              <span>View Store</span>
              <ExternalLink size={13} />
            </Link>

            {/* Profile Avatar / Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-brand-border">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <p className="font-bold text-brand-text-dark truncate max-w-[120px]">
                  {user?.fullName || 'Head Baker'}
                </p>
                <p className="text-[10px] text-brand-text-muted capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>

              {/* Explicit Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out of Admin Portal"
                className="p-1.5 text-brand-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-1"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ setActiveOrdersCount }} />
        </main>
      </div>
    </div>
  );
}
