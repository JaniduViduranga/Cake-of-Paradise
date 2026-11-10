import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ArrowRight,
  ZoomIn,
  X,
  Sparkles,
  Loader2,
  Calendar,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const CATEGORIES = ['All', 'Standard', 'Birthday', 'Wedding Cake', 'Cupcake', 'Custom'];

export default function InspirationGallery() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [lightboxItem, setLightboxItem] = useState(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Dynamic Data Fetching: GET /api/gallery?page=${page}&limit=8&category=${category}
  useEffect(() => {
    let isCancelled = false;

    const fetchGallery = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: '8',
        });
        if (category && category !== 'All') {
          queryParams.append('category', category);
        }

        const res = await fetch(`${apiUrl}/gallery?${queryParams.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load gallery images.');
        }

        if (!isCancelled) {
          const fetchedImages = data.images || data.data || [];
          if (page === 1) {
            setImages(fetchedImages);
          } else {
            setImages((prev) => [...prev, ...fetchedImages]);
          }
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('[InspirationGallery] Fetch error:', err);
        if (!isCancelled) {
          setError(err.message || 'Unable to connect to live gallery.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchGallery();

    return () => {
      isCancelled = true;
    };
  }, [category, page, apiUrl]);

  // Tab switching resets pagination to page 1
  const handleCategoryChange = (newCat) => {
    if (newCat === category) return;
    setCategory(newCat);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-hero pt-16">
      {/* Header & Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <SectionHeading
          title="Inspiration Gallery"
          subtitle="Explore our live portfolio of artisanal creations. Each masterpiece is custom-crafted to bring warmth and celebration to your sweetest moments."
          centered={false}
        />

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 justify-start md:justify-center mt-6 sm:mt-8 w-full">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                id={`gallery-filter-${cat.toLowerCase()}`}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-full font-montserrat text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs shrink-0 whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  active
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105'
                    : 'bg-brand-surface text-brand-text-body border border-brand-border hover:border-brand-accent hover:text-brand-accent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Loading Skeleton on initial fetch */}
        {loading && images.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-8 sm:py-12">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-2xl bg-brand-surface border border-brand-border animate-pulse flex flex-col justify-end p-4"
              >
                <div className="h-4 bg-brand-border/60 rounded-md w-3/4 mb-2" />
                <div className="h-3 bg-brand-border/40 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : error && images.length === 0 ? (
          /* Error State */
          <div className="py-20 text-center bg-brand-surface rounded-2xl border border-brand-border p-8">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-playfair font-bold text-xl text-brand-text-dark mb-2">
              Could not load gallery creations
            </h3>
            <p className="font-montserrat text-xs sm:text-sm text-brand-text-muted mb-6">
              {error}
            </p>
            <button
              onClick={() => {
                setPage(1);
                setCategory('All');
              }}
              className="btn-primary text-xs px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              Retry Connection
            </button>
          </div>
        ) : images.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center bg-brand-surface rounded-2xl border border-brand-border p-8">
            <div className="text-5xl mb-3">🎨</div>
            <h3 className="font-playfair font-bold text-2xl text-brand-text-dark mb-2">
              No cakes found in this category
            </h3>
            <p className="font-montserrat text-xs sm:text-sm text-brand-text-muted max-w-md mx-auto mb-6">
              We haven't uploaded creations for "{category}" yet. Check back soon or request a custom bespoke design.
            </p>
            <button
              onClick={() => handleCategoryChange('All')}
              className="btn-secondary text-xs px-6 py-2.5 rounded-xl font-semibold border-2 border-brand-border-btn text-brand-accent hover:bg-brand-bg-hero"
            >
              Browse All Categories
            </button>
          </div>
        ) : (
          /* Grid of Cloudinary dynamic images */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {images.map((item) => {
              const imageSrc = item.imageUrl || item.image;
              return (
                <div
                  key={item._id || item.id}
                  onClick={() => setLightboxItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxItem(item)}
                  aria-label={`View ${item.title}`}
                  className="group relative overflow-hidden rounded-2xl bg-brand-surface border border-brand-border shadow-xs hover:shadow-lg hover:border-brand-accent transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-brand-bg-hero/50 relative">
                    <img
                      src={getOptimizedImageUrl(imageSrc, 600)}
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder-cake.png';
                      }}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-text-dark/80 via-brand-text-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="self-end p-2 rounded-full bg-white/25 backdrop-blur-xs text-white">
                        <ZoomIn size={16} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-primary text-white uppercase tracking-wider">
                          {item.category || 'Artisanal'}
                        </span>
                        <p className="font-playfair font-bold text-white text-base mt-1.5 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-surface border-t border-brand-border/60">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-playfair font-semibold text-sm text-brand-text-dark truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-bg-hero text-brand-accent border border-brand-border shrink-0">
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="font-montserrat text-xs text-brand-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {page < totalPages && (
          <div className="text-center mt-12">
            <button
              id="load-more-gallery"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 bg-brand-surface border-2 border-brand-border-btn text-brand-accent font-montserrat font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-brand-bg-hero hover:border-brand-primary hover:text-brand-primary transition-all duration-200 shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading More Inspirations...
                </>
              ) : (
                <>
                  Load More Inspirations
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Bespoke Request CTA Card */}
        <div className="mt-16 bg-brand-surface rounded-2xl border border-brand-border shadow-xs p-8 md:p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
            <Sparkles size={22} />
          </div>
          <h3 className="font-playfair font-bold text-3xl text-brand-text-dark mb-3">
            Envisioning something unique?
          </h3>
          <p className="font-montserrat text-sm text-brand-text-muted leading-relaxed max-w-lg mx-auto mb-6">
            Share your themes, favorite flavors, and color palettes. We will handcraft a bespoke masterpiece made specifically for your milestone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/custom-order')}
              className="btn-primary flex items-center gap-2 justify-center py-3.5 px-7 rounded-xl font-semibold shadow-sm"
            >
              Order Custom Cake
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="btn-secondary border-2 border-brand-border-btn text-brand-accent bg-brand-surface hover:bg-brand-bg-hero py-3.5 px-7 rounded-xl font-semibold"
            >
              Contact Baker
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-brand-surface border border-brand-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl cursor-default"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 z-10 min-w-[44px] min-h-[44px] rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>

            <div className="aspect-4/3 w-full bg-black/10 overflow-hidden">
              <img
                src={getOptimizedImageUrl(lightboxItem.imageUrl || lightboxItem.image, 1200)}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder-cake.png';
                }}
                alt={lightboxItem.title}
                className="w-full h-full object-contain bg-black/5"
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-primary text-white uppercase tracking-wider">
                  {lightboxItem.category || 'Custom'}
                </span>
              </div>
              <h3 className="font-playfair font-bold text-2xl text-brand-text-dark">
                {lightboxItem.title}
              </h3>
              {lightboxItem.description && (
                <p className="font-montserrat text-sm text-brand-text-body leading-relaxed">
                  {lightboxItem.description}
                </p>
              )}
              <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                <span className="text-xs text-brand-text-muted flex items-center gap-1.5">
                  <Calendar size={13} />
                  Handcrafted by Cake of Paradise
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxItem(null);
                    navigate('/custom-order');
                  }}
                  className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  Request Similar Cake
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

