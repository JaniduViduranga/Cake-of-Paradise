import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { CAKES, BAKER_VALUES } from '../../models/cakes';
import HomePageImage from '../../assets/HomePageImage.jpg';

// Gallery images for the slide bar
const HERO_SLIDES = [
  {
    id: 'slide-masterpiece',
    name: 'Grand Celebration Showpiece',
    category: 'Featured Masterpiece',
    image: HomePageImage,
  },
  {
    id: 'slide-001',
    name: CAKES[0]?.name || 'Midnight Chocolate Truffle',
    category: CAKES[0]?.category || 'Birthday Cakes',
    image: CAKES[0]?.image,
  },
  {
    id: 'slide-002',
    name: CAKES[1]?.name || 'Classic Vanilla Bean Rose',
    category: CAKES[1]?.category || 'Tiered Wedding',
    image: CAKES[1]?.image,
  },
  {
    id: 'slide-003',
    name: CAKES[2]?.name || 'Summer Berry Chantilly',
    category: CAKES[2]?.category || 'Signature Cakes',
    image: CAKES[2]?.image,
  },
  {
    id: 'slide-004',
    name: CAKES[3]?.name || 'Red Velvet Dream',
    category: CAKES[3]?.category || 'Celebration Cakes',
    image: CAKES[3]?.image,
  },
  {
    id: 'slide-005',
    name: CAKES[4]?.name || 'Lemon Citrus Delight',
    category: CAKES[4]?.category || 'Artisanal Flavors',
    image: CAKES[4]?.image,
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

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
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.name}
                  className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out"
                />
              </div>
            );
          })}
          {/* Smooth left/middle-edge gradient shade to seamlessly dissolve into the page background */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-52 sm:w-72 lg:w-96 bg-gradient-to-r from-brand-bg-hero via-brand-bg-hero/75 to-transparent z-10" />
          {/* Subtle top & bottom edge blend */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-bg-hero/75 to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-bg-hero/75 to-transparent z-10" />
          {/* Mobile soft backdrop for maximum readability on small screens */}
          <div className="md:hidden absolute inset-0 bg-brand-bg-hero/80 backdrop-blur-[1px] z-10" />
        </div>

        {/* ── Text and Buttons Positioned in Middle (Unchanged Position) ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Main Headline */}
          <h1 className="font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-text-dark leading-[1.12] tracking-tight max-w-4xl mx-auto">
            Handcrafted Cakes for Your{' '}
            <span className="italic font-serif">Sweetest</span> Moments
          </h1>

          {/* Subtitle Paragraph */}
          <p className="font-montserrat text-sm sm:text-base md:text-lg text-brand-text-body leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6">
            Experience artisanal quality with every bite. We blend traditional techniques
            with modern high-end pastry design to create masterpieces for your special occasions.
          </p>

          {/* Centered Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8 sm:mt-10">
            <Link
              to="/custom-order"
              id="hero-cta-custom"
              className="btn-primary bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center gap-2 text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-brand-primary/25 font-sans font-semibold transition-all duration-200 active:scale-95"
            >
              <Plus size={18} />
              Order Custom Cake
            </Link>
            <Link
              to="/gallery"
              id="hero-cta-gallery"
              className="btn-secondary border-2 border-brand-border-btn text-brand-accent bg-brand-surface hover:bg-brand-bg-hero flex items-center justify-center gap-2 text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-sans font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Plus size={18} />
              View Gallery
            </Link>
          </div>
        </div>

        {/* ── Slide Navigation & Indicator Bar on Right Side ── */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-20 flex items-center gap-2.5 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
          <button
            type="button"
            onClick={prevSlide}
            className="text-white/80 hover:text-white p-0.5 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-6 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={nextSlide}
            className="text-white/80 hover:text-white p-0.5 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ── Active Slide Info Tag on Right Side ── */}
        <div className="hidden sm:flex items-center gap-2 absolute top-24 sm:top-28 right-6 sm:right-12 z-20 bg-black/40 backdrop-blur-md text-white/95 font-montserrat text-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          <span className="text-brand-accent font-semibold">{HERO_SLIDES[currentSlide]?.category}</span>
          <span className="text-white/50">·</span>
          <span className="truncate max-w-[150px]">{HERO_SLIDES[currentSlide]?.name}</span>
        </div>
      </section>

      {/* ── Gallery Teaser Section (Square Boxes matching Figma design) ── */}
      <section className="py-14 sm:py-20 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
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

          {/* Square Grid Boxes according to Figma Wireframe Design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CAKES.slice(0, 8).map((cake) => (
              <Link
                key={cake.id}
                to="/gallery"
                className="relative overflow-hidden rounded-2xl group aspect-square block border border-brand-border shadow-sm hover:shadow-md hover:border-brand-accent transition-all bg-brand-surface"
              >
                <img
                  src={cake.image}
                  alt={cake.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] uppercase font-montserrat tracking-wider text-brand-bg-hero font-medium">{cake.category}</span>
                  <p className="font-playfair text-sm sm:text-base text-white font-semibold leading-tight mt-0.5">{cake.name}</p>
                  <p className="text-xs text-brand-accent font-semibold mt-1 flex items-center gap-1">
                    Explore Design <ArrowRight size={12} />
                  </p>
                </div>
              </Link>
            ))}
          </div>

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
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
