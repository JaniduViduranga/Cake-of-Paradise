import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CalendarDays, Clock4, ChevronRight, ChevronDown } from 'lucide-react';
import WeightSelector from '../components/customizer/WeightSelector';
import ImageUploader from '../components/customizer/ImageUploader';
import { useCustomOrderController } from '../../controllers/useCustomOrderController';

export default function CustomOrder() {
  const navigate = useNavigate();
  const {
    orderType,
    setOrderType,
    orderTypes,
    selectedSize,
    setSelectedSize,
    cupcakeQuantity,
    setCupcakeQuantity,
    cupcakeQuantities,
    selectedFlavor,
    setSelectedFlavor,
    activeFlavors,
    message,
    setMessage,
    designPreview,
    setDesignPreview,
    pickupDate,
    setPickupDate,
    timeSlot,
    setTimeSlot,
    timeSlots,
    totalPrice,
    submitCustomOrder,
    added,
  } = useCustomOrderController();

  const handleAddToCart = () => {
    submitCustomOrder();
  };

  const today = new Date().toISOString().split('T')[0];
  const isCakeWithDesign = orderType === 'Birthday Cakes' || orderType === 'Wedding Cakes';

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-montserrat text-xs text-chocolate-800/50 mb-8">
          <button onClick={() => navigate('/gallery')} className="hover:text-caramel-600 transition-colors">Gallery</button>
          <ChevronRight size={12} />
          <span className="text-chocolate-900 font-semibold">Custom Order</span>
        </nav>

        {/* Customizer Form */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-50 space-y-8">
          {/* Header */}
          <div className="text-center pb-6 border-b border-gray-100">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl text-chocolate-900">Custom Order</h1>
            <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed mt-3 max-w-lg mx-auto">
              Configure your perfect cake step by step. We'll bake it fresh and have it ready for your special occasion.
            </p>
          </div>

          {/* Step 1: Order Type */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-caramel-600 text-white flex items-center justify-center font-montserrat font-bold text-xs">1</div>
              <label className="font-playfair font-bold text-lg text-chocolate-900">
                Select Order Type
              </label>
            </div>
            <div className="relative">
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="input-field w-full appearance-none pr-10 bg-white"
              >
                {orderTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-800/50 pointer-events-none" />
            </div>
          </div>

          {/* Step 2: Flavor */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-caramel-600 text-white flex items-center justify-center font-montserrat font-bold text-xs">2</div>
              <label className="font-playfair font-bold text-lg text-chocolate-900">
                Choose Flavor
              </label>
            </div>
            <div className="relative">
              <select
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
                className="input-field w-full appearance-none pr-10 bg-white"
              >
                {activeFlavors.map((flavor) => (
                  <option key={flavor.value} value={flavor.value}>
                    {flavor.label}{flavor.modifier > 0 ? ` (+$${flavor.modifier})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-800/50 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Size / Quantity */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-caramel-600 text-white flex items-center justify-center font-montserrat font-bold text-xs">3</div>
              <label className="font-playfair font-bold text-lg text-chocolate-900">
                {orderType === 'Cupcakes' ? 'Select Quantity' : 'Select Cake Size'}
              </label>
            </div>
            
            {orderType === 'Cupcakes' ? (
              <div className="relative">
                <select
                  value={cupcakeQuantity}
                  onChange={(e) => setCupcakeQuantity(Number(e.target.value))}
                  className="input-field w-full appearance-none pr-10 bg-white"
                >
                  {cupcakeQuantities.map((qty) => (
                    <option key={qty} value={qty}>{qty} Pack</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-800/50 pointer-events-none" />
              </div>
            ) : (
              <WeightSelector selected={selectedSize} onChange={(size) => setSelectedSize(size)} />
            )}
          </div>

          {/* Conditional Steps: Message & Image */}
          {isCakeWithDesign && (
            <div className="space-y-8 pt-4 border-t border-gray-100">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-caramel-600 text-white flex items-center justify-center font-montserrat font-bold text-xs">A</div>
                  <label className="font-playfair font-bold text-lg text-chocolate-900">
                    Custom Message <span className="font-montserrat font-normal text-sm text-chocolate-800/40 ml-2">(Optional)</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 40))}
                  placeholder="e.g. Happy Birthday Sarah!"
                  className="input-field w-full"
                />
                <div className="text-right mt-1.5">
                  <span className="font-montserrat text-xs text-chocolate-800/40">{message.length}/40 characters</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-caramel-600 text-white flex items-center justify-center font-montserrat font-bold text-xs">B</div>
                  <label className="font-playfair font-bold text-lg text-chocolate-900">
                    Design Reference <span className="font-montserrat font-normal text-sm text-chocolate-800/40 ml-2">(Optional)</span>
                  </label>
                </div>
                <ImageUploader
                  preview={designPreview}
                  onUpload={(src) => setDesignPreview(src)}
                  onClear={() => setDesignPreview(null)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Delivery / Pickup */}
          <div className="pt-4 border-t border-gray-100 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-caramel-600 text-white flex items-center justify-center font-montserrat font-bold text-xs">4</div>
              <label className="font-playfair font-bold text-lg text-chocolate-900">
                Delivery & Pickup Date
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat font-semibold text-xs text-chocolate-900 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <CalendarDays size={14} />
                  Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="input-field w-full bg-white"
                />
              </div>
              <div>
                <label className="block font-montserrat font-semibold text-xs text-chocolate-900 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Clock4 size={14} />
                  Time Slot
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="input-field w-full appearance-none pr-10 bg-white"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate-800/50 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Summary & Checkout */}
          <div className="pt-8 border-t-2 border-dashed border-gray-200 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-montserrat font-semibold text-sm text-chocolate-800/60 uppercase tracking-wider mb-1">Estimated Total</p>
                <p className="font-playfair font-bold text-4xl text-chocolate-900">${totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto min-w-[240px] btn-primary py-4 flex items-center justify-center gap-2 text-base shadow-lg shadow-caramel-600/20"
              >
                🛒 {added ? 'Added to Cart!' : 'Add to Cart / Place Order'}
              </button>
            </div>
            
            <p className="text-center sm:text-right font-montserrat text-xs text-chocolate-800/40 mt-4 flex items-center justify-center sm:justify-end gap-1.5">
              <ShieldCheck size={13} />
              Secure configuration
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
