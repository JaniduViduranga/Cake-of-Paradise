import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Image,
  DollarSign,
  Store,
  ExternalLink,
  ChevronRight,
  Flame,
  X,
  Cake,
} from 'lucide-react';
import heroLogo from '../../../assets/HeroLogo.jpg';

const NAV_ITEMS = [
  {
    path: '/admin',
    exact: true,
    aliases: ['/admin/dashboard'],
    label: 'Overview',
    description: 'Daily metrics & urgent dispatches',
    icon: LayoutDashboard,
    tabNum: 'Tab 1',
  },
  {
    path: '/admin/orders',
    label: 'Orders Management',
    description: 'Live kitchen & dispatch queue',
    icon: ShoppingBag,
    tabNum: 'Tab 2',
  },
  {
    path: '/admin/gallery',
    label: 'Gallery Manager',
    description: 'Upload & showcase cake designs',
    icon: Image,
    badge: 'NEW',
    tabNum: 'Tab 3',
  },
  {
    path: '/admin/pricing',
    label: 'Pricing Manager',
    description: 'Base rates, packs & flavor fees',
    icon: DollarSign,
    tabNum: 'Tab 4',
  },
];

export default function AdminSidebar({
  activeOrdersCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.exact) {
      return (
        location.pathname === item.path ||
        (item.aliases && item.aliases.includes(location.pathname))
      );
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#2b1613] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl border-r border-chocolate-800`}
      >
        {/* Header / Brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-3 group"
            onClick={onCloseMobile}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={heroLogo}
                alt="Cake of Paradise"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-lg text-cream-50 leading-tight">
                Cake of Paradise
              </h1>
              <p className="font-montserrat text-[11px] text-rose-blush tracking-wider uppercase font-semibold">
                Kitchen & Admin Portal
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="px-6 py-3 bg-black/20 border-b border-white/5 flex items-center justify-between text-xs font-montserrat">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Kitchen Live</span>
          </div>
          <span className="text-[10px] font-mono text-caramel-400 bg-caramel-600/20 px-2 py-0.5 rounded">
            Atlas MongoDB
          </span>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 font-montserrat">
          <div className="px-3 pb-2 text-[10px] font-bold text-rose-blush/60 uppercase tracking-widest">
            Main Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-sm ${
                  active
                    ? 'bg-gradient-to-r from-caramel-600 to-caramel-500 text-white font-semibold shadow-md shadow-caramel-700/20 translate-x-1'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-caramel-400 group-hover:bg-white/10 group-hover:text-caramel-300'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="leading-snug">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-chocolate-950">
                          {item.badge}
                        </span>
                      )}
                      {item.path === '/admin/orders' && activeOrdersCount > 0 && (
                        <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                          {activeOrdersCount}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[10px] mt-0.5 truncate max-w-[150px] ${
                        active ? 'text-cream-100/90' : 'text-gray-400'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={15}
                  className={`transition-transform opacity-0 group-hover:opacity-100 ${
                    active ? 'opacity-100 translate-x-0.5' : ''
                  }`}
                />
              </NavLink>
            );
          })}
        </div>

        {/* Footer Quick Links */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2 font-montserrat">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Store size={15} className="text-caramel-400 group-hover:text-caramel-300" />
              View Customer Storefront
            </span>
            <ExternalLink size={13} className="text-gray-400" />
          </Link>

          <Link
            to="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Cake size={15} className="text-caramel-400 group-hover:text-caramel-300" />
              Public Gallery Showcase
            </span>
            <ExternalLink size={13} className="text-gray-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}

