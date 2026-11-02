import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import heroLogo from '../../../assets/HeroLogo.jpg';

const NAV_ITEMS = [
  {
    path: '/admin',
    exact: true,
    aliases: ['/admin/dashboard'],
    label: 'Overview',
  },
  {
    path: '/admin/orders',
    label: 'Orders Management',
  },
  {
    path: '/admin/gallery',
    label: 'Gallery Manager',
  },
  {
    path: '/admin/pricing',
    label: 'Pricing Manager',
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
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container - Light Color according to Color Palette */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-brand-surface text-brand-text-dark flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } shadow-lg border-r border-brand-border`}
      >
        {/* Header / Brand */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-3 group"
            onClick={onCloseMobile}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-bg-hero p-0.5 border border-brand-border shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={heroLogo}
                alt="Cake of Paradise"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-lg text-brand-text-dark leading-tight">
                Cake of Paradise
              </h1>
              <p className="font-montserrat text-[11px] text-brand-accent tracking-wider uppercase font-semibold">
                Admin Portal
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-dark hover:bg-brand-bg-hero"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 font-montserrat">

          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm ${active
                  ? 'bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/25 translate-x-1'
                  : 'text-brand-text-body font-medium hover:bg-brand-bg-hero hover:text-brand-accent'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="leading-snug">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active
                        ? 'bg-white text-brand-primary'
                        : 'bg-brand-bg-hero text-brand-accent border border-brand-border'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.path === '/admin/orders' && activeOrdersCount > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-brand-primary' : 'bg-brand-primary text-white'
                        }`}
                    >
                      {activeOrdersCount}
                    </span>
                  )}
                </div>

                <ChevronRight
                  size={15}
                  className={`transition-transform ${active ? 'opacity-100 translate-x-0.5 text-white' : 'opacity-0 group-hover:opacity-100 text-brand-text-muted'
                    }`}
                />
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
}
