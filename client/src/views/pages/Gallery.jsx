import { ArrowRight, ChevronDown } from 'lucide-react';
import GalleryCard from '../components/common/GalleryCard';
import SectionHeading from '../components/common/SectionHeading';
import Modal from '../components/common/Modal';
import { useGalleryController } from '../../controllers/useGalleryController';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const {
    category,
    setCategory,
    categories,
    visibleItems,
    hasMore,
    loadMore,
    lightboxItem,
    setLightboxItem,
    requestModalOpen,
    setRequestModalOpen,
  } = useGalleryController();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
        <SectionHeading
          title="Inspiration Gallery"
          subtitle="Explore our portfolio of artisanal creations. Each cake is custom-designed to bring a touch of elegance and indulgence to your special moments."
          centered={false}
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setCategory(cat)}
              className={`category-pill text-xs ${
                category === cat ? 'category-pill-active' : 'category-pill-inactive'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-8">
        {visibleItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-3">🎨</div>
            <p className="font-playfair font-semibold text-xl text-chocolate-900">No items in this category</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {visibleItems.map((item) => (
              <GalleryCard key={item.id} item={item} onOpen={setLightboxItem} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              id="load-more-gallery"
              onClick={loadMore}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-chocolate-800 font-montserrat font-semibold text-sm px-7 py-3 rounded-full hover:border-caramel-600 hover:text-caramel-600 transition-all duration-200 shadow-sm"
            >
              Load More Inspirations
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Request CTA */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 text-center">
          <h3 className="font-playfair font-bold text-3xl text-chocolate-900 mb-3">
            Love what you see?
          </h3>
          <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed max-w-lg mx-auto mb-6">
            Request a similar design or share your own inspiration — we'll create a bespoke cake tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="request-design-btn"
              onClick={() => setRequestModalOpen(true)}
              className="btn-primary flex items-center gap-2 justify-center"
            >
              Request This Design
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/custom-order')}
              className="btn-secondary"
            >
              Start Custom Order
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <Modal isOpen={!!lightboxItem} onClose={() => setLightboxItem(null)} maxWidth="max-w-3xl">
          <div>
            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="px-6 py-5">
              <h3 className="font-playfair font-bold text-xl text-chocolate-900">{lightboxItem.title}</h3>
              <p className="font-montserrat text-sm text-caramel-600 mt-1">{lightboxItem.category}</p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setLightboxItem(null); setRequestModalOpen(true); }}
                  className="btn-primary flex-1 text-center py-2.5"
                >
                  Request Similar Design
                </button>
                <button onClick={() => setLightboxItem(null)} className="btn-secondary px-5 py-2.5">
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Request Modal */}
      <Modal isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} title="Request a Design" maxWidth="max-w-lg">
        <form
          onSubmit={(e) => { e.preventDefault(); alert('Design request submitted! We\'ll contact you within 24 hours.'); setRequestModalOpen(false); }}
          className="px-6 py-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Name</label>
              <input type="text" required placeholder="Jane Doe" className="input-field" />
            </div>
            <div>
              <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" required placeholder="jane@example.com" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Event Date</label>
            <input type="date" className="input-field" />
          </div>
          <div>
            <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">Additional Notes</label>
            <textarea
              rows={4}
              placeholder="Describe your vision, cake size, flavor preferences..."
              className="input-field resize-none"
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3">
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );
}
