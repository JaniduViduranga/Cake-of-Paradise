import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

export default function GalleryCard({ item, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="masonry-item relative overflow-hidden rounded-2xl cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
      aria-label={`View ${item.title}`}
    >
      <img
        src={item.image}
        alt={item.title}
        className={`w-full h-auto block transition-transform duration-500 ${
          hovered ? 'scale-110' : 'scale-100'
        }`}
        loading="lazy"
      />
      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-chocolate-900/70 via-chocolate-900/20 to-transparent transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ZoomIn size={15} className="text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-playfair font-semibold text-white text-sm leading-tight">
            {item.title}
          </p>
          {item.category && (
            <span className="font-montserrat text-xs text-cream-200/80 mt-1 block">
              {item.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
