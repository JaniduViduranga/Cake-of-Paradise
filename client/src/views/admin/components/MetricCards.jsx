import React from 'react';
import {
  Truck,
  Flame,
  Banknote,
  ShoppingBag,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function MetricCards({
  todayDeliveries = 0,
  activeInKitchen = 0,
  bakingCount = 0,
  decoratingCount = 0,
  totalRevenue = 0,
  totalOrders = 0,
  paidCount = 0,
  loading = false,
}) {
  const metrics = [
    {
      id: 'today-dispatches',
      title: "Today's Deliveries / Pickups",
      value: todayDeliveries,
      subtext: 'Scheduled for dispatch today',
      icon: Truck,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      badge: 'Daily Goal',
      badgeBg: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'active-kitchen',
      title: 'Active in Kitchen',
      value: activeInKitchen,
      subtext: `${bakingCount} Baking • ${decoratingCount} Decorating`,
      icon: Flame,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      badge: 'Live Oven',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: `Rs. ${(totalRevenue || 0).toLocaleString()}`,
      subtext: `From ${paidCount} paid transactions`,
      icon: Banknote,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      badge: 'Stripe Verified',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: totalOrders,
      subtext: 'Orders placed to date',
      icon: ShoppingBag,
      color: 'text-caramel-600',
      bgColor: 'bg-cream-100',
      borderColor: 'border-cream-200',
      badge: 'All-Time',
      badgeBg: 'bg-cream-200/80 text-chocolate-900',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs animate-pulse space-y-3"
          >
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className={`bg-white rounded-2xl p-5 sm:p-6 border ${m.borderColor} shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden group`}
          >
            {/* Top decorative gradient blur */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cream-100/50 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-montserrat font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${m.badgeBg}`}>
                {m.badge}
              </span>
              <div
                className={`w-10 h-10 rounded-xl ${m.bgColor} ${m.color} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon size={20} />
              </div>
            </div>

            <h3 className="font-montserrat text-xs font-semibold text-chocolate-800/70">
              {m.title}
            </h3>

            <div className="mt-2 mb-1">
              <p className="font-playfair font-bold text-2xl sm:text-3xl text-chocolate-900 tracking-tight">
                {m.value}
              </p>
            </div>

            <p className="font-montserrat text-[11px] text-chocolate-800/60 truncate">
              {m.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}

