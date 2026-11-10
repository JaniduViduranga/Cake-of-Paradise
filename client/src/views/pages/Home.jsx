import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { BAKER_VALUES } from '../../models/cakes';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroSlides, setHeroSlides] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [latestGallery, setLatestGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // 1. Fetch Randomly Picked Gallery Images for Home Page Hero Slider
  useEffect(() => {
    let isCancelled = false;
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch(`${apiUrl}/gallery/random?count=6`);
        const data = await res.json();
        if (!isCancelled && data.success && data.images && data.images.length > 0) {
          setHeroSlides(
            data.images.map((item) => ({
              id: item._id || item.id,
              name: item.title,
              category: item.category || 'Artisanal',
              image: item.imageUrl || item.image,
            }))
          );
        }
      } catch (err) {
        console.warn('Could not load random hero slider images:', err);
      } finally {
        if (!isCancelled) setSliderLoading(false);
      }
    };
    fetchHeroSlides();
    return () => {
      isCancelled = true;
    };
  }, [apiUrl]);

  // 2. Fetch Latest 8 Gallery Images for Home Page Inspiration Gallery
  useEffect(() => {
    let isCancelled = false;
    const fetchLatestGallery = async () => {
      try {
        const res = await fetch(`${apiUrl}/gallery?limit=8`);
        const data = await res.json();
        if (!isCancelled && data.success && data.images) {
          setLatestGallery(data.images);
        }
      } catch (err) {
        console.warn('Could not load latest gallery creations:', err);
      } finally {
        if (!isCancelled) setGalleryLoading(false);
      }
    };
    fetchLatestGallery();
    return () => {
      isCancelled = true;
    };
  }, [apiUrl]);

  // Autoplay hero slider
  useEffect(() => {
    if (isPaused || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const activeIndex = heroSlides.length > 0 ? currentSlide % heroSlides.length : 0;
  const currentItem = heroSlides[activeIndex];

  return (
    <div className="min-h-screen bg-brand-bg-hero">
      {/* ── Hero Section (Right-Half Background Image Slider with Centered Content) ── */}
      <section
        className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-16 sm:pb-20 bg-brand-bg-hero border-b border-brand-border select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ── Background Image Slider (Positioned on the Right Half with Feathered & Shaded Edge) ── */}
        <div className="absolute top-0 bottom-0 right-0 w-full md:w-[58%] lg:w-[54%] overflow-hidden pointer-events-none hero-slider-mask">
          {heroSlides.length > 0 ? (
            heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={slide.id || index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={getOptimizedImageUrl(slide.image, 1200)}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    {...(index === 0 ? { fetchpriority: 'high' } : {})}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/placeholder-cake.png';
                    }}
                    alt={slide.name}
                    className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out"
                  />
                </div>
              );
            })
          ) : (
            /* Clean placeholder backdrop while loading or prior to first upload */
            <div className="absolute inset-0 bg-gradient-to-br from-brand-border/30 via-brand-bg-hero to-brand-border/20" />
          )}

          {/* Smooth left/middle-edge gradient shade to seamlessly dissolve into the page background */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-52 sm:w-72 lg:w-96 bg-gradient-to-r from-brand-bg-hero via-brand-bg-hero/75 to-transparent z-10" />
          {/* Subtle top & bottom edge blend */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-bg-hero/75 to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-bg-hero/75 to-transparent z-10" />
          {/* Mobile soft backdrop for maximum readability on small screens */}
          <div className="md:hidden absolute inset-0 bg-brand-bg-hero/80 backdrop-blur-[1px] z-10" />
        </div>

        {/* ── Text and Buttons Positioned in Middle ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Main Headline */}
          <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-text-dark leading-[1.15] tracking-tight max-w-4xl mx-auto">
            Handcrafted Cakes for Your{' '}
            <span className="italic font-serif">Sweetest</span> Moments
          </h1>

          {/* Subtitle Paragraph */}
          <p className="font-montserrat text-sm sm:text-base max-w-xl mx-auto px-2 text-brand-text-body leading-relaxed mt-4 sm:mt-6">
            Experience artisanal quality with every bite. We blend traditional techniques
            with modern high-end pastry design to create masterpieces for your special occasions.
          </p>

          {/* Centered Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full max-w-md sm:max-w-none mt-6 sm:mt-8">
            <Link
              to="/custom-order"
              id="hero-cta-custom"
              className="w-full sm:w-auto min-h-[44px] btn-primary bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center gap-2 text-sm sm:text-base px-7 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-brand-primary/25 font-sans font-semibold transition-all duration-200 active:scale-95"
            >
              <Plus size={18} />
              Order Custom Cake
            </Link>
            <Link
              to="/gallery"
              id="hero-cta-gallery"
              className="w-full sm:w-auto min-h-[44px] btn-secondary border-2 border-brand-border-btn text-brand-accent bg-brand-surface hover:bg-brand-bg-hero flex items-center justify-center gap-2 text-sm sm:text-base px-7 sm:px-8 py-3.5 rounded-xl font-sans font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Plus size={18} />
              View Gallery
            </Link>
          </div>
        </div>

        {/* ── Slide Navigation & Indicator Bar on Right Side (rendered if multiple random slides exist) ── */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-12 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-lg">
            <button
              type="button"
              onClick={prevSlide}
              className="text-white/80 hover:text-white min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === index ? 'w-6 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextSlide}
              className="text-white/80 hover:text-white min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── Active Slide Info Tag on Right Side ── */}
        {currentItem && (
          <div className="hidden sm:flex items-center gap-2 absolute top-24 sm:top-28 right-6 sm:right-12 z-20 bg-black/40 backdrop-blur-md text-white/95 font-montserrat text-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-brand-accent font-semibold">{currentItem.category}</span>
            <span className="text-white/50">·</span>
            <span className="truncate max-w-[150px]">{currentItem.name}</span>
          </div>
        )}
      </section>

      {/* ── Gallery Teaser Section (Latest 8 Gallery Images from Cloudinary / MongoDB) ── */}
      <section className="py-14 sm:py-20 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <SectionHeading
              title="Inspiration Gallery"
              subtitle="Explore our curated collection of custom baked delights"
              centered={false}
            />
            <Link
              to="/gallery"
              className="flex items-center gap-2 font-montserrat font-semibold text-sm text-brand-accent hover:text-brand-primary-hover transition-colors shrink-0"
            >
              View Full Gallery <ArrowRight size={15} />
            </Link>
          </div>

          {/* Square Grid Boxes showing Latest 8 Gallery Images */}
          {galleryLoading && latestGallery.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-2xl bg-brand-bg-hero/50 border border-brand-border animate-pulse"
                />
              ))}
            </div>
          ) : latestGallery.length === 0 ? (
            <div className="py-12 text-center bg-brand-bg-hero/40 rounded-2xl border border-brand-border p-8">
              <p className="font-playfair font-bold text-lg text-brand-text-dark">
                No gallery creations published yet
              </p>
              <p className="font-montserrat text-xs text-brand-text-muted mt-1 mb-4">
                Photos uploaded from the Admin Gallery will appear here automatically.
              </p>
              <Link
                to="/gallery"
                className="btn-primary text-xs px-5 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2"
              >
                Go to Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {latestGallery.map((item) => {
                const imgUrl = item.imageUrl || item.image;
                return (
                  <Link
                    key={item._id || item.id}
                    to="/gallery"
                    className="relative overflow-hidden rounded-2xl group aspect-square block border border-brand-border shadow-sm hover:shadow-md hover:border-brand-accent transition-all bg-brand-surface"
                  >
                    <img
                      src={getOptimizedImageUrl(imgUrl, 600)}
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder-cake.png';
                      }}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] uppercase font-montserrat tracking-wider text-brand-bg-hero font-medium">
                        {item.category}
                      </span>
                      <p className="font-playfair text-sm sm:text-base text-white font-semibold leading-tight mt-0.5 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-brand-accent font-semibold mt-1 flex items-center gap-1">
                        Explore Design <ArrowRight size={12} />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mobile view all */}
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/gallery"
              className="btn-secondary border-2 border-brand-border-btn text-brand-accent bg-brand-surface hover:bg-brand-bg-hero inline-flex items-center gap-2 text-sm px-6 py-3 rounded-xl font-semibold"
            >
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Baker Values Section (Why Choose Us) ── */}
      <section className="py-14 sm:py-20 bg-brand-bg-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Why Choose Us?" subtitle="Our commitment to artisanal excellence" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 mt-4">
            {BAKER_VALUES.map((val) => (
              <div
                key={val.title}
                className="text-center p-6 sm:p-8 rounded-2xl bg-brand-surface border border-brand-border hover:shadow-md hover:border-brand-accent transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{val.icon}</div>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-brand-text-dark mb-2 sm:mb-3">{val.title}</h3>
                <p className="font-montserrat text-xs sm:text-sm text-brand-text-body leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
