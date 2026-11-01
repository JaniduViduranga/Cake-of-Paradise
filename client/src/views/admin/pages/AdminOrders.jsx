import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
  X,
  ArrowUpDown,
} from 'lucide-react';
import OrderTable from '../components/OrderTable';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { getAllOrders, updateOrderStatus } from '../../../services/api';

const STATUS_FILTERS = [
  'All',
  'Received',
  'Baking',
  'Decorating',
  'Ready for Delivery/Pickup',
  'Completed',
  'Cancelled',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const outletContext = useOutletContext();

  // Fetch orders from API
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
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders from server. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Real-time status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId
            ? { ...o, orderStatus: newStatus }
            : o
        )
      );

      if (
        selectedOrder &&
        (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)
      ) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }

      showToast(`Order status updated to "${newStatus}"!`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Could not update status. Please try again.');
    }
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((o) => o.orderStatus === selectedStatus);
    }

    // Delivery filter
    if (deliveryFilter !== 'All') {
      result = result.filter((o) => o.deliveryMethod === deliveryFilter);
    }

    // Search query filter (customer name, email, order number)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((o) => {
        const orderNum = (o.orderNumber || '').toLowerCase();
        const firstName = (o.customerDetails?.firstName || '').toLowerCase();
        const lastName = (o.customerDetails?.lastName || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const email = (o.customerDetails?.email || '').toLowerCase();
        const phone = (o.customerDetails?.phone || '').toLowerCase();
        const itemName = (o.items?.[0]?.name || '').toLowerCase();

        return (
          orderNum.includes(query) ||
          firstName.includes(query) ||
          lastName.includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          itemName.includes(query)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'highest-total') {
        const totalA = a.financials?.finalTotal || a.totalPrice || 0;
        const totalB = b.financials?.finalTotal || b.totalPrice || 0;
        return totalB - totalA;
      }
      if (sortBy === 'delivery-date') {
        const dateA = a.items?.[0]?.deliveryDate ? new Date(a.items[0].deliveryDate).getTime() : 0;
        const dateB = b.items?.[0]?.deliveryDate ? new Date(b.items[0].deliveryDate).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [orders, selectedStatus, deliveryFilter, searchQuery, sortBy]);

  // Compute status counts for filter pills
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_FILTERS.forEach((st) => {
      if (st !== 'All') {
        counts[st] = orders.filter((o) => o.orderStatus === st).length;
      }
    });
    return counts;
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in font-montserrat">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-chocolate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-caramel-600/40 animate-slide-up text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-chocolate-900">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-800/60 mt-1">
            Real-time control center for kitchen orders, customer specifications, and dispatch statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-chocolate-800 hover:text-caramel-600 hover:border-caramel-600 hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
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

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Top line: Search and Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, or order number (ORD-XXXXXX)..."
              className="w-full pl-10 pr-9 py-2.5 bg-cream-50/50 border border-gray-200 rounded-xl text-xs sm:text-sm text-chocolate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel-600/30 focus:border-caramel-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-chocolate-800"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Delivery Method Filter */}
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-chocolate-800 focus:outline-none focus:ring-2 focus:ring-caramel-600/30 cursor-pointer shadow-2xs"
            >
              <option value="All">All Dispatch Methods</option>
              <option value="delivery">Local Delivery</option>
              <option value="pickup">Bakery Pickup</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-chocolate-800 focus:outline-none focus:ring-2 focus:ring-caramel-600/30 cursor-pointer shadow-2xs"
            >
              <option value="newest">Sort: Newest Placed</option>
              <option value="oldest">Sort: Oldest Placed</option>
              <option value="delivery-date">Sort: Target Delivery Date</option>
              <option value="highest-total">Sort: Highest Amount</option>
            </select>
          </div>
        </div>

        {/* Filter Bar: Status Pills */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-chocolate-800/60 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} />
            Filter Status:
          </span>

          {STATUS_FILTERS.map((status) => {
            const count = statusCounts[status] || 0;
            const active = selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
                  active
                    ? 'bg-chocolate-900 text-white shadow-sm'
                    : 'bg-gray-50 text-chocolate-800 hover:bg-cream-100 border border-gray-200'
                }`}
              >
                <span>{status === 'Ready for Delivery/Pickup' ? 'Ready for Dispatch' : status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-gray-200 text-chocolate-900'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Count and Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-chocolate-800/60 px-1">
        <p>
          Showing <strong className="text-chocolate-900 font-semibold">{filteredOrders.length}</strong> of{' '}
          <strong className="text-chocolate-900 font-semibold">{orders.length}</strong> total orders
          {selectedStatus !== 'All' && ` • Filtered by "${selectedStatus}"`}
          {deliveryFilter !== 'All' && ` • ${deliveryFilter === 'delivery' ? 'Local Delivery' : 'Pickup'}`}
          {searchQuery && ` • Matching "${searchQuery}"`}
        </p>

        {(selectedStatus !== 'All' || deliveryFilter !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedStatus('All');
              setDeliveryFilter('All');
              setSearchQuery('');
            }}
            className="text-caramel-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Order Table */}
      <OrderTable
        orders={filteredOrders}
        loading={loading}
        onViewOrder={(order) => setSelectedOrder(order)}
        onStatusChange={handleStatusChange}
      />

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

