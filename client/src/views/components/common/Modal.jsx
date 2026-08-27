import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-chocolate-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className={`relative z-10 bg-white rounded-2xl shadow-2xl w-full ${maxWidth} animate-scale-in`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-playfair font-bold text-xl text-chocolate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-cream-100 text-chocolate-800/50 hover:text-chocolate-900 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-chocolate-800/50 hover:text-chocolate-900 transition-colors shadow"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}
        {/* Content */}
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
