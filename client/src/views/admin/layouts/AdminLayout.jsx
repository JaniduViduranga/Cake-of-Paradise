import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { getAllOrders } from '../../../services/api';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const location = useLocation();

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

  // Determine title from path
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/admin' || p === '/admin/dashboard') {
      return {
        title: 'Executive Overview',
        subtitle: 'Daily dispatch schedule, metrics, and kitchen urgency queue',
        tab: 'Tab 1: Overview',
      };
    }
    if (p.startsWith('/admin/orders')) {
      return {
        title: 'Orders Management',
        subtitle: 'Real-time kitchen order tracking, filtering, and dispatch control',
        tab: 'Tab 2: Orders',
      };
    }
    if (p.startsWith('/admin/gallery')) {
      return {
        title: 'Gallery Manager',
        subtitle: 'Publish, showcase, and curate cake portfolio photos',
        tab: 'Tab 3: Gallery Manager',
      };
    }
    if (p.startsWith('/admin/pricing')) {
      return {
        title: 'Pricing Manager',
        subtitle: 'Dynamically configure base rates, pack prices, and flavor premiums',
        tab: 'Tab 4: Pricing Manager',
      };
    }
    return {
      title: 'Admin Dashboard',
      subtitle: 'Cake of Paradise Management Portal',
      tab: 'Portal',
    };
  };

  const pageInfo = getPageTitle();

  return (
    <div className="min-h-screen bg-[#fcf9f7] flex font-montserrat antialiased text-chocolate-900">
      {/* Sidebar */}
      <AdminSidebar
        activeOrdersCount={activeOrdersCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/70 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-chocolate-800 hover:text-caramel-600 hover:bg-cream-100 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-caramel-600 bg-caramel-600/10 px-2 py-0.5 rounded-full">
                  {pageInfo.tab}
                </span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  {pageInfo.title}
                </span>
              </div>
              <h2 className="font-playfair font-bold text-lg sm:text-xl text-chocolate-900 leading-tight">
                {pageInfo.title}
              </h2>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-chocolate-800/70 bg-cream-50 px-3 py-1.5 rounded-lg border border-cream-200">
              <Clock size={14} className="text-caramel-600" />
              <span className="font-mono font-medium">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            {/* View public store shortcut */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-chocolate-800 hover:text-caramel-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-caramel-600 hover:bg-cream-50 transition-all shadow-2xs"
            >
              <span>View Store</span>
              <ExternalLink size={13} />
            </Link>

            {/* Profile Avatar / Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-caramel-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                CP
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <p className="font-bold text-chocolate-900">Head Baker</p>
                <p className="text-[10px] text-gray-400">Admin</p>
              </div>
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

