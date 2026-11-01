import React from 'react';
import {
  Truck,
  Store,
  Eye,
  Calendar,
  Phone,
  Cake,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS = [
  'Received',
  'Baking',
  'Decorating',
  'Ready for Delivery/Pickup',
  'Completed',
  'Cancelled',
];

export default function OrderTable({
  orders = [],
  loading = false,
  onViewOrder,
  onStatusChange,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-100 rounded-lg w-full" />
          <div className="h-16 bg-gray-50 rounded-lg w-full" />
          <div className="h-16 bg-gray-50 rounded-lg w-full" />
          <div className="h-16 bg-gray-50 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-cream-100 text-caramel-600 flex items-center justify-center mx-auto mb-4">
          <Cake size={32} />
        </div>
        <h3 className="font-playfair font-bold text-xl text-chocolate-900 mb-1">
          No Orders Found
        </h3>
        <p className="font-montserrat text-xs text-chocolate-800/60 max-w-sm mx-auto">
          No matching orders in this view. Try adjusting your search query or status filter.
        </p>
      </div>
    );
  }

  // Format date helper
  const formatOrderDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-cream-50/70 text-[11px] font-montserrat font-bold text-chocolate-800/70 uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6">Order ID & Date</th>
              <th className="py-4 px-4">Customer</th>
              <th className="py-4 px-4">Cake Summary</th>
              <th className="py-4 px-4">Total & Payment</th>
              <th className="py-4 px-4">Status Selector</th>
              <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-montserrat text-chocolate-900">
            {orders.map((order) => {
              const customer = order.customerDetails || {};
              const items = order.items || [];
              const primaryItem = items[0] || {};
              const isDelivery = order.deliveryMethod === 'delivery';
              const finalAmount = order.financials?.finalTotal || order.totalPrice || 0;

              return (
                <tr
                  key={order._id || order.orderNumber}
                  className="hover:bg-cream-50/40 transition-colors group"
                >
                  {/* Column 1: Order ID & Date */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => onViewOrder(order)}
                        className="font-playfair font-bold text-sm text-chocolate-900 hover:text-caramel-600 transition-colors text-left flex items-center gap-1 group/id"
                      >
                        <span>{order.orderNumber || 'ORD-UNKNOWN'}</span>
                      </button>
                      <span className="text-[11px] text-chocolate-800/60 mt-0.5 flex items-center gap-1">
                        <Calendar size={11} className="text-gray-400" />
                        {formatOrderDate(order.createdAt)}
                      </span>
                      {primaryItem.deliveryDate && (
                        <span className="text-[10px] text-caramel-600 font-semibold mt-0.5">
                          Target: {primaryItem.deliveryDate}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Customer */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-chocolate-900">
                        {customer.firstName} {customer.lastName}
                      </span>
                      {customer.phone ? (
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-[11px] text-chocolate-800/70 hover:text-caramel-600 flex items-center gap-1"
                        >
                          <Phone size={11} className="text-gray-400" />
                          {customer.phone}
                        </a>
                      ) : (
                        <span className="text-[11px] text-chocolate-800/50 truncate max-w-[140px]">
                          {customer.email}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                          isDelivery
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {isDelivery ? (
                          <>
                            <Truck size={10} /> Local Delivery
                          </>
                        ) : (
                          <>
                            <Store size={10} /> Bakery Pickup
                          </>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Column 3: Cake Summary */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-0.5 max-w-[200px]">
                      <span className="font-semibold text-chocolate-900 truncate">
                        {primaryItem.name || 'Custom Cake'}
                        {items.length > 1 && (
                          <span className="text-[10px] text-caramel-600 ml-1 font-normal">
                            (+{items.length - 1} more)
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-chocolate-800/70 truncate">
                        {primaryItem.orderType || 'Standard'}
                        {primaryItem.flavor ? ` • ${primaryItem.flavor}` : ''}
                      </span>
                      <span className="text-[10px] text-chocolate-800/50">
                        {primaryItem.weight ||
                          (primaryItem.cupcakeQuantity
                            ? `${primaryItem.cupcakeQuantity} pack`
                            : 'Standard size')}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Total & Payment */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <span className="font-playfair font-bold text-sm text-chocolate-900">
                        Rs. {finalAmount.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
                        <CheckCircle2 size={10} />
                        Paid via Stripe
                      </span>
                    </div>
                  </td>

                  {/* Column 5: Status Selector (One-click Dropdown) */}
                  <td className="py-4 px-4">
                    <div className="relative inline-block w-full max-w-[170px]">
                      <select
                        value={order.orderStatus || 'Received'}
                        onChange={(e) =>
                          onStatusChange(order._id || order.orderNumber, e.target.value)
                        }
                        className={`w-full text-xs font-montserrat font-semibold rounded-lg px-2.5 py-1.5 border shadow-2xs focus:outline-none focus:ring-2 focus:ring-caramel-600/30 cursor-pointer transition-colors ${
                          order.orderStatus === 'Baking'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.orderStatus === 'Decorating'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : order.orderStatus === 'Ready for Delivery/Pickup'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.orderStatus === 'Completed'
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status} className="bg-white text-chocolate-900 font-medium">
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Column 6: Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      type="button"
                      onClick={() => onViewOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-chocolate-800 hover:text-caramel-600 hover:border-caramel-600 hover:bg-cream-50 transition-all shadow-2xs"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

