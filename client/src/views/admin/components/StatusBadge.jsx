import React from 'react';
import {
  Clock,
  Flame,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  XCircle,
} from 'lucide-react';

const STATUS_CONFIGS = {
  Received: {
    label: 'Received',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: Clock,
  },
  Baking: {
    label: 'Baking',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
    icon: Flame,
  },
  Decorating: {
    label: 'Decorating',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    icon: Sparkles,
  },
  'Ready for Delivery/Pickup': {
    label: 'Ready for Dispatch',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: PackageCheck,
  },
  Completed: {
    label: 'Completed',
    bg: 'bg-gray-100 text-gray-700 border-gray-300',
    dot: 'bg-gray-500',
    icon: CheckCircle2,
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
};

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const config = STATUS_CONFIGS[status] || {
    label: status || 'Unknown',
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    icon: Clock,
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-montserrat font-semibold rounded-full border shadow-xs transition-colors ${config.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {showIcon && <IconComponent size={size === 'sm' ? 12 : 14} className="shrink-0" />}
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
}

