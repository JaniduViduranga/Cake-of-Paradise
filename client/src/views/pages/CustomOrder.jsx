import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CalendarDays, Clock4, ChevronRight } from 'lucide-react';
import WeightSelector from '../components/customizer/WeightSelector';
import FlavorDropdown, { FLAVORS } from '../components/customizer/FlavorDropdown';
import ImageUploader from '../components/customizer/ImageUploader';
import { useCustomOrderController } from '../../controllers/useCustomOrderController';

export default function CustomOrder() {
  const navigate = useNavigate();
  const {
    selectedCake,
    activeImage,
    setActiveImage,
    cakeImages,
    selectedSize,
    handleSizeChange,
    selectedFlavor,
    handleFlavorChange,
    isEggless,
    setIsEggless,
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
    sizeModifier,
    flavorModifier,
    egglessModifier,
    submitCustomOrder,
    added,
    relatedCakes,
  } = useCustomOrderController();

  const handleAddToCart = () => {
    const flavorLabel = FLAVORS.find((f) => f.value === selectedFlavor)?.label || selectedFlavor;
    submitCustomOrder(flavorLabel);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-montserrat text-xs text-chocolate-800/50 mb-8">
          <button onClick={() => navigate('/menu')} className="hover:text-caramel-600 transition-colors">Menu</button>
          <ChevronRight size={12} />
          <span>Signature Cakes</span>
          <ChevronRight size={12} />
          <span className="text-chocolate-900 font-semibold">{selectedCake.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Left: Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-cream-100 aspect-[4/3]">
              {selectedCake.badge && (
                <span className="absolute top-4 left-4 z-10 bg-chocolate-900 text-white font-montserrat font-semibold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {selectedCake.badge}
                </span>
              )}
              <img
                src={cakeImages[activeImage]}
                alt={selectedCake.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {cakeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i ? 'border-caramel-600 shadow-md' : 'border-transparent hover:border-caramel-600/30'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Customizer ── */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-50 space-y-6">
            {/* Title */}
            <div>
              <h1 className="font-playfair font-bold text-3xl text-chocolate-900">{selectedCake.name}</h1>
              <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed mt-3">
                {selectedCake.description}
              </p>
            </div>

            {/* Price */}
            <div>
              <span className="font-playfair font-bold text-3xl text-chocolate-900">${totalPrice.toFixed(2)}</span>
              {(sizeModifier > 0 || flavorModifier > 0 || egglessModifier > 0) && (
                <span className="font-montserrat text-xs text-chocolate-800/40 ml-2">
                  (Base ${selectedCake.basePrice}{sizeModifier > 0 ? ` + $${sizeModifier} size` : ''}{flavorModifier > 0 ? ` + $${flavorModifier} flavor` : ''}{egglessModifier > 0 ? ` + $${egglessModifier} eggless` : ''})
                </span>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Cake Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-montserrat font-semibold text-sm text-chocolate-900">Cake Size</label>
                <button className="font-montserrat text-xs text-caramel-600 hover:underline">Size Guide</button>
              </div>
              <WeightSelector selected={selectedSize} onChange={handleSizeChange} />
            </div>

            {/* Flavor */}
            <div>
              <label className="block font-montserrat font-semibold text-sm text-chocolate-900 mb-3">
                Flavor Profile
              </label>
              <FlavorDropdown selected={selectedFlavor} onChange={handleFlavorChange} />
            </div>

            {/* Eggless Toggle */}
            <div className="bg-cream-50 rounded-xl p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-montserrat font-semibold text-sm text-chocolate-900">Eggless Preparation</p>
                <p className="font-montserrat text-xs text-chocolate-800/50 mt-0.5">
                  Suitable for vegetarians {isEggless ? '(+$5)' : ''}
                </p>
              </div>
              <button
                id="eggless-toggle"
                onClick={() => setIsEggless((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
                  isEggless ? 'bg-caramel-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={isEggless}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                    isEggless ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Message on Cake */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-montserrat font-semibold text-sm text-chocolate-900">
                  Message on Cake
                </label>
                <span className="font-montserrat text-xs text-chocolate-800/40">{message.length}/30</span>
              </div>
              <input
                type="text"
                id="cake-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 30))}
                placeholder="e.g. Happy Birthday Sarah!"
                className="input-field"
              />
            </div>

            {/* Design Reference */}
            <div>
              <label className="block font-montserrat font-semibold text-sm text-chocolate-900 mb-2">
                Design Reference{' '}
                <span className="text-chocolate-800/40 font-normal">(Optional)</span>
              </label>
              <ImageUploader
                preview={designPreview}
                onUpload={(src) => setDesignPreview(src)}
                onClear={() => setDesignPreview(null)}
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat font-semibold text-sm text-chocolate-900 mb-2 flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="pickup-date"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-montserrat font-semibold text-sm text-chocolate-900 mb-2 flex items-center gap-1.5">
                  <Clock4 size={14} />
                  Time Slot
                </label>
                <select
                  id="time-slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="input-field"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base"
            >
              🛒 {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {/* Secure checkout note */}
            <p className="text-center font-montserrat text-xs text-chocolate-800/40 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} />
              Secure checkout
            </p>
          </div>
        </div>

        {/* Related Cakes */}
        <div className="mt-16">
          <h2 className="font-playfair font-bold text-2xl text-chocolate-900 mb-6">You Might Also Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedCakes.map((cake) => (
              <button
                key={cake.id}
                onClick={() => navigate(`/custom-order?cake=${cake.id}`)}
                className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50"
              >
                <div className="h-36 overflow-hidden">
                  <img src={cake.image} alt={cake.name} className="w-full h-full object-cover img-zoom" />
                </div>
                <div className="p-3">
                  <p className="font-playfair font-semibold text-sm text-chocolate-900 group-hover:text-caramel-600 transition-colors">{cake.name}</p>
                  <p className="font-montserrat text-xs text-caramel-600 font-bold mt-0.5">from ${cake.basePrice}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
