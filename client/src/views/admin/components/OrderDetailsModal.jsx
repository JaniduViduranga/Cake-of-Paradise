import React, { useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Store,
  CreditCard,
  CheckCircle2,
  Cake,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  Sparkles,
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

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen || !order) return null;

  const customer = order.customerDetails || {};
  const financials = order.financials || {};
  const payment = order.paymentInfo || {};
  const items = order.items || [];
  const isDelivery = order.deliveryMethod === 'delivery';

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:border-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-cream-50/70 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair font-bold text-xl sm:text-2xl text-chocolate-900">
                  {order.orderNumber || 'ORD-UNKNOWN'}
                </span>
                <StatusBadge status={order.orderStatus} size="sm" />
              </div>
              <p className="font-montserrat text-xs text-chocolate-800/60 mt-0.5 flex items-center gap-2">
                <span>Placed on {formatDate(order.createdAt)}</span>
                <span>•</span>
                <span className="capitalize">{order.deliveryMethod} Order</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {/* Quick Status Dropdown in Modal */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <label className="text-xs font-montserrat font-semibold text-chocolate-800/60 uppercase">
                Status:
              </label>
              <select
                value={order.orderStatus}
                onChange={(e) => onStatusChange?.(order._id || order.orderNumber, e.target.value)}
                className="text-xs font-montserrat font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-caramel-600/30 cursor-pointer"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              title="Print Kitchen Slip"
              className="p-2 text-chocolate-800/70 hover:text-caramel-600 hover:bg-cream-100 rounded-lg transition-colors border border-gray-200"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-chocolate-800/70 hover:text-chocolate-900 hover:bg-cream-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-chocolate-900 font-montserrat">
          
          {/* Top Row: Customer & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Details */}
            <div className="p-4 rounded-xl border border-gray-100 bg-cream-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                <h4 className="font-playfair font-bold text-base text-chocolate-900 flex items-center gap-2">
                  <User size={16} className="text-caramel-600" />
                  Customer Information
                </h4>
                <span className="text-xs text-caramel-600 font-semibold bg-caramel-600/10 px-2 py-0.5 rounded-full">
                  Verified Contact
                </span>
              </div>

              <div className="text-xs space-y-2">
                <p className="font-semibold text-sm text-chocolate-900">
                  {customer.firstName} {customer.lastName}
                </p>
                <div className="flex items-center gap-2 text-chocolate-800/80">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <a href={`mailto:${customer.email}`} className="hover:underline text-caramel-600">
                    {customer.email || 'No email provided'}
                  </a>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-chocolate-800/80">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <a href={`tel:${customer.phone}`} className="hover:underline font-medium">
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery / Dispatch Details */}
            <div className="p-4 rounded-xl border border-gray-100 bg-cream-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                <h4 className="font-playfair font-bold text-base text-chocolate-900 flex items-center gap-2">
                  {isDelivery ? <Truck size={16} className="text-caramel-600" /> : <Store size={16} className="text-caramel-600" />}
                  Dispatch Method & Address
                </h4>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isDelivery ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isDelivery ? 'Local Delivery' : 'Bakery Pickup'}
                </span>
              </div>

              <div className="text-xs space-y-2">
                {isDelivery ? (
                  <div className="space-y-1">
                    <p className="font-medium text-chocolate-900 flex items-start gap-1.5">
                      <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {customer.address || 'Address line missing'}
                        {customer.city ? `, ${customer.city}` : ''}
                        {customer.state ? `, ${customer.state}` : ''}
                        {customer.zip ? ` - ${customer.zip}` : ''}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-blue-900">
                    <p className="font-medium">Direct In-Store Pickup</p>
                    <p className="text-[11px] text-blue-800/80 mt-0.5">
                      Customer will collect order at the main Cake of Paradise counter.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Baker Instructions & Custom Cake Specifications */}
          <div className="p-5 rounded-xl border border-caramel-600/20 bg-[#fffdfb] space-y-4">
            <div className="flex items-center justify-between border-b border-caramel-600/15 pb-2.5">
              <h4 className="font-playfair font-bold text-lg text-chocolate-900 flex items-center gap-2">
                <Cake size={18} className="text-caramel-600" />
                Baker Instructions & Custom Specifications
              </h4>
              <span className="text-xs font-semibold text-caramel-600 bg-cream-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Kitchen Work Order
              </span>
            </div>

            {items.map((item, idx) => (
              <div
                key={item.cartItemId || idx}
                className="p-4 rounded-xl border border-gray-100 bg-white shadow-xs space-y-4"
              >
                {/* Item title and basic specs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="font-playfair font-bold text-base text-chocolate-900">
                      {item.name}
                    </h5>
                    <p className="text-xs text-chocolate-800/70 mt-0.5">
                      <span className="font-semibold text-caramel-600">{item.orderType || 'Cake'}</span>
                      {item.flavor && <> • Flavor: <strong className="text-chocolate-900">{item.flavor}</strong></>}
                      {item.weight && <> • Size: <strong className="text-chocolate-900">{item.weight}</strong></>}
                      {item.cupcakeQuantity && <> • Quantity: <strong className="text-chocolate-900">{item.cupcakeQuantity} pack</strong></>}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-montserrat font-bold text-base text-chocolate-900">
                      Rs. {(item.price || 0).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-chocolate-800/60">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Scheduled delivery / pickup date */}
                {(item.deliveryDate || item.timeSlot) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs bg-cream-50 p-2.5 rounded-lg border border-cream-200">
                    {item.deliveryDate && (
                      <span className="flex items-center gap-1.5 font-medium text-chocolate-800">
                        <Calendar size={14} className="text-caramel-600" />
                        Target Date: <strong>{item.deliveryDate}</strong>
                      </span>
                    )}
                    {item.timeSlot && (
                      <span className="flex items-center gap-1.5 font-medium text-chocolate-800">
                        <Clock size={14} className="text-caramel-600" />
                        Time Slot: <strong>{item.timeSlot}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Custom Message to pipe on cake */}
                <div className="p-3.5 rounded-lg bg-rose-soft/20 border border-rose-blush/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-chocolate-900 mb-1">
                    <FileText size={14} className="text-caramel-600" />
                    <span>Custom Message to Pipe on Cake:</span>
                  </div>
                  {item.customMessage ? (
                    <blockquote className="italic font-playfair font-semibold text-base sm:text-lg text-chocolate-900 px-3 py-1.5 border-l-4 border-caramel-600 bg-white/70 rounded-r">
                      "{item.customMessage}"
                    </blockquote>
                  ) : (
                    <p className="text-xs text-chocolate-800/50 italic">
                      None requested by customer (plain decorative finish).
                    </p>
                  )}
                </div>

                {/* Wedding Tier Config (if any) */}
                {item.weddingConfig && (
                  <div className="p-3 rounded-lg bg-cream-50 border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-chocolate-900">
                      <Layers size={14} className="text-caramel-600" />
                      <span>Wedding Cake Structure & Tier Specifications:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-chocolate-800">
                      <div>
                        <span className="text-gray-500">Tiers:</span>{' '}
                        <strong>{item.weddingConfig.tiers || item.weddingConfig.structureTiers || 'Standard'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">Structure:</span>{' '}
                        <strong>{item.weddingConfig.packageType || 'Cake only'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">Fresh Flowers:</span>{' '}
                        <strong>{item.weddingConfig.includeFreshFlowers ? 'Yes' : 'No'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reference Image */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-chocolate-800 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-caramel-600" />
                      Design Reference Image:
                    </span>
                  </div>

                  {item.referenceImage ? (
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setSelectedImage(item.referenceImage)}
                        className="relative group cursor-pointer w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-xs hover:border-caramel-600 transition-colors"
                      >
                        <img
                          src={item.referenceImage}
                          alt="Customer Reference"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-semibold">
                          View
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedImage(item.referenceImage)}
                          className="inline-flex items-center gap-1 text-caramel-600 hover:text-caramel-700 font-semibold"
                        >
                          <ExternalLink size={13} />
                          Enlarge Reference Photo
                        </button>
                        <p className="text-[11px] text-gray-500">
                          Uploaded by client as custom design guide.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No custom reference photo uploaded.
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Financials & Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Payment Summary */}
            <div className="p-4 rounded-xl border border-gray-100 bg-cream-50/40 space-y-2.5">
              <h4 className="font-playfair font-bold text-sm text-chocolate-900 flex items-center gap-2 border-b border-gray-200/60 pb-2">
                <CreditCard size={15} className="text-caramel-600" />
                Payment Record
              </h4>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Method:</span>
                  <span className="font-semibold uppercase">{payment.paymentMethod || 'Credit Card'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    <CheckCircle2 size={12} />
                    {payment.paymentStatus || 'Paid'} (via Stripe)
                  </span>
                </div>
                {payment.paymentIntentId && (
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono text-[10px] text-gray-600 truncate max-w-[170px]" title={payment.paymentIntentId}>
                      {payment.paymentIntentId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Totals */}
            <div className="p-4 rounded-xl border border-gray-100 bg-cream-50/40 space-y-2">
              <h4 className="font-playfair font-bold text-sm text-chocolate-900 border-b border-gray-200/60 pb-2">
                Financial Summary
              </h4>
              <div className="text-xs space-y-1 text-chocolate-800">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>Rs. {(financials.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <span>{financials.shipping ? `Rs. ${financials.shipping.toLocaleString()}` : 'Free / Pickup'}</span>
                </div>
                {financials.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span>Rs. {financials.tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-chocolate-900">
                  <span>Final Total:</span>
                  <span className="text-caramel-600">
                    Rs. {(financials.finalTotal || order.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-cream-50/50 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-chocolate-800/60">
            Order Reference: <strong className="font-mono">{order.orderNumber}</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Printer size={14} />
              Print Production Slip
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary text-xs py-2 px-5"
            >
              Done
            </button>
          </div>
        </div>

      </div>

      {/* Image Lightbox Preview if selected */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl p-2 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/90 transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={selectedImage}
              alt="Reference Preview"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

