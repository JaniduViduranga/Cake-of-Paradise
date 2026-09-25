import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useState } from 'react';

export default function CakeCard({ cake }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const {
    id,
    name,
    image,
    price,
    rating = 4.5,
    reviewCount = 0,
    tags = [],
    description,
    badge,
    badgeColor = 'bg-chocolate-900',
  } = cake;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      cartItemId: `${id}-${Date.now()}`,
      id,
      name,
      image,
      price,
      size: '1kg',
      flavor: 'Standard',
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCustomize = () => navigate(`/custom-order?cake=${id}`);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      return (
        <span key={i} className={filled || half ? 'text-amber-400' : 'text-gray-200'}>
          ★
        </span>
      );
    });
  };

  return (
    <div
      className="card cursor-pointer group animate-fade-in"
      onClick={handleCustomize}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCustomize()}
      aria-label={`View ${name}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-52 sm:h-60 bg-cream-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover img-zoom"
          loading="lazy"
        />
        {badge && (
          <span className={`absolute top-3 left-3 ${badgeColor} text-white font-montserrat font-semibold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full`}>
            {badge}
          </span>
        )}
        {/* Quick Add overlay */}
        <div className="absolute inset-0 bg-chocolate-900/0 group-hover:bg-chocolate-900/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-white text-chocolate-900 font-montserrat font-semibold text-xs tracking-wide px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <ShoppingCart size={14} />
            {added ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Name + Price Row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-playfair font-bold text-lg text-chocolate-900 leading-tight group-hover:text-caramel-600 transition-colors">
            {name}
          </h3>
          <div className="text-right shrink-0">
            <p className="font-montserrat text-xs text-chocolate-800/50">from</p>
            <p className="font-montserrat font-bold text-caramel-600 text-lg">${price}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-base leading-none">{renderStars(rating)}</div>
          <span className="font-montserrat text-xs text-chocolate-800/50">({reviewCount})</span>
        </div>

        {/* Description */}
        {description && (
          <p className="font-montserrat text-xs text-chocolate-800/60 leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="tag-pill bg-cream-100 text-chocolate-800/60">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          id={`customize-btn-${id}`}
          onClick={handleCustomize}
          className="w-full bg-cream-100 hover:bg-caramel-600 text-chocolate-800 hover:text-white font-montserrat font-semibold text-sm tracking-wide py-2.5 rounded-lg transition-all duration-200 mt-1 border border-transparent hover:border-caramel-600"
        >
          Customize &amp; Order
        </button>
      </div>
    </div>
  );
}
