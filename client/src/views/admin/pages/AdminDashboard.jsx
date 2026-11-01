import React, { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  Flame,
  AlertTriangle,
  Cake,
  TrendingUp,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import MetricCards from '../components/MetricCards';
import StatusBadge from '../components/StatusBadge';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { getAllOrders, updateOrderStatus } from '../../../services/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const outletContext = useOutletContext();

  // Load orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllOrders();
      const list = res.data?.data || res.data?.orders || [];
      setOrders(list);

      if (outletContext?.setActiveOrdersCount) {
        const active = list.filter((o) =>
          ['Received', 'Baking', 'Decorating'].includes(o.orderStatus)
        ).length;
        outletContext.setActiveOrdersCount(active);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Unable to load orders from database. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Show auto-dismissing toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Real-time status change handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          (o._id === orderId || o.orderNumber === orderId)
            ? { ...o, orderStatus: newStatus }
            : o
        )
      );
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
      showToast(`Order status updated to "${newStatus}"!`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update status. Please try again.');
    }
  };

  // Compute Metrics
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('en-US');

    let todayDeliveries = 0;
    let bakingCount = 0;
    let decoratingCount = 0;
    let totalRevenue = 0;
    let paidCount = 0;

    orders.forEach((order) => {
      // Check if scheduled today
      const hasTodayItem = order.items?.some((item) => {
        if (!item.deliveryDate) return false;
        return (
          item.deliveryDate === todayStr ||
          item.deliveryDate.includes(todayStr) ||
          new Date(item.deliveryDate).toLocaleDateString('en-US') === todayFormatted
        );
      });

      // Or order placed today and deliveryMethod is immediate
      const createdToday =
        new Date(order.createdAt).toLocaleDateString('en-US') === todayFormatted;

      if (hasTodayItem || (createdToday && order.orderStatus !== 'Completed')) {
        todayDeliveries += 1;
      }

      if (order.orderStatus === 'Baking') bakingCount += 1;
      if (order.orderStatus === 'Decorating') decoratingCount += 1;

      // Revenue: paid orders
      const isPaid =
        order.paymentInfo?.paymentStatus === 'Paid' ||
        order.orderStatus === 'Completed';

      if (isPaid) {
        totalRevenue += order.financials?.finalTotal || order.totalPrice || 0;
        paidCount += 1;
      }
    });

    const activeInKitchen = bakingCount + decoratingCount;

    return {
      todayDeliveries,
      activeInKitchen,
      bakingCount,
      decoratingCount,
      totalRevenue,
      paidCount,
      totalOrders: orders.length,
    };
  }, [orders]);

  // Urgent Orders: 5 closest upcoming cake deliveries with quick status indicators
  const urgentOrders = useMemo(() => {
    // Filter active orders that are not Completed or Cancelled
    const pending = orders.filter(
      (o) => o.orderStatus !== 'Completed' && o.orderStatus !== 'Cancelled'
    );

    // Sort by delivery date (earliest first), fallback to creation date
    return pending
      .sort((a, b) => {
        const dateA = a.items?.[0]?.deliveryDate
          ? new Date(a.items[0].deliveryDate).getTime()
          : new Date(a.createdAt).getTime();
        const dateB = b.items?.[0]?.deliveryDate
          ? new Date(b.items[0].deliveryDate).getTime()
          : new Date(b.createdAt).getTime();
        return dateA - dateB;
      })
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-chocolate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-caramel-600/40 animate-slide-up text-xs font-montserrat font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-caramel-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Cake size={15} />
            <span>Master Bakery Dashboard</span>
          </div>
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-chocolate-900">
            Welcome back, Chef!
          </h1>
          <p className="font-montserrat text-xs sm:text-sm text-chocolate-800/60 mt-1">
            Here's an overview of today's kitchen operations, active orders, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-chocolate-800 hover:text-caramel-600 hover:border-caramel-600 hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/orders"
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <span>Manage Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchOrders}
            className="underline font-semibold hover:text-rose-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <section>
        <MetricCards
          todayDeliveries={metrics.todayDeliveries}
          activeInKitchen={metrics.activeInKitchen}
          bakingCount={metrics.bakingCount}
          decoratingCount={metrics.decoratingCount}
          totalRevenue={metrics.totalRevenue}
          totalOrders={metrics.totalOrders}
          paidCount={metrics.paidCount}
          loading={loading}
        />
      </section>

      {/* Urgent Orders Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <h2 className="font-playfair font-bold text-xl sm:text-2xl text-chocolate-900">
                Urgent Cake Deliveries
              </h2>
            </div>
            <p className="font-montserrat text-xs text-chocolate-800/60 mt-0.5">
              The 5 closest upcoming orders that need immediate kitchen & dispatch attention.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-caramel-600 hover:text-caramel-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Table of 5 closest upcoming */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {urgentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
              <p className="font-playfair font-bold text-base text-chocolate-900">
                Kitchen Queue Clear!
              </p>
              <p className="font-montserrat text-xs text-chocolate-800/60 mt-0.5">
                No pending or urgent orders at this moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-cream-50/70 text-[11px] font-montserrat font-bold text-chocolate-800/70 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Cake Design</th>
                    <th className="py-3.5 px-4">Target Date</th>
                    <th className="py-3.5 px-4">Status Indicator</th>
                    <th className="py-3.5 px-4">Quick Selector</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-montserrat text-chocolate-900">
                  {urgentOrders.map((order) => {
                    const customer = order.customerDetails || {};
                    const primaryItem = order.items?.[0] || {};
                    const targetDate = primaryItem.deliveryDate || 'Scheduled ASAP';

                    return (
                      <tr
                        key={order._id || order.orderNumber}
                        className="hover:bg-cream-50/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-chocolate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold">{customer.firstName} {customer.lastName}</div>
                          <div className="text-[10px] text-gray-500 capitalize">
                            {order.deliveryMethod === 'delivery' ? 'Local Delivery' : 'Pickup'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-[180px] truncate">
                          <span className="font-medium text-chocolate-900">{primaryItem.name}</span>
                          <span className="text-[10px] text-gray-500 block">
                            {primaryItem.flavor || primaryItem.orderType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                            <Clock size={11} />
                            {targetDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.orderStatus} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order._id || order.orderNumber, e.target.value)
                            }
                            className="text-[11px] font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-caramel-600 focus:outline-none cursor-pointer"
                          >
                            <option value="Received">Received</option>
                            <option value="Baking">Baking</option>
                            <option value="Decorating">Decorating</option>
                            <option value="Ready for Delivery/Pickup">Ready for Dispatch</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 text-xs text-caramel-600 hover:text-caramel-700 font-semibold px-2 py-1 rounded hover:bg-cream-100 transition-colors"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Quick Kitchen Workflow Pipeline Overview */}
      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
        <h3 className="font-playfair font-bold text-lg text-chocolate-900">
          Kitchen Production Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              label: 'Received',
              count: orders.filter((o) => o.orderStatus === 'Received').length,
              color: 'border-blue-200 bg-blue-50/50 text-blue-900',
            },
            {
              label: 'Baking',
              count: orders.filter((o) => o.orderStatus === 'Baking').length,
              color: 'border-amber-200 bg-amber-50/50 text-amber-900',
            },
            {
              label: 'Decorating',
              count: orders.filter((o) => o.orderStatus === 'Decorating').length,
              color: 'border-purple-200 bg-purple-50/50 text-purple-900',
            },
            {
              label: 'Ready for Dispatch',
              count: orders.filter((o) => o.orderStatus === 'Ready for Delivery/Pickup').length,
              color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
            },
            {
              label: 'Completed',
              count: orders.filter((o) => o.orderStatus === 'Completed').length,
              color: 'border-gray-200 bg-gray-50/50 text-gray-800',
            },
          ].map((stage) => (
            <div
              key={stage.label}
              className={`p-3.5 rounded-xl border ${stage.color} flex flex-col justify-between`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider">{stage.label}</span>
              <p className="font-playfair font-bold text-2xl mt-1">{stage.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

