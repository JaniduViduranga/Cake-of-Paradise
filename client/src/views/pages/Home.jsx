import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { CAKES, BAKER_VALUES } from '../../models/cakes';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCF8F8]">
      {/* ── Hero Section (Restructured according to Figma Wireframe) ── */}
      <section className="pt-24 sm:pt-28 pb-16 sm:pb-24 bg-gradient-to-b from-[#FCF8F8] via-[#FBEFEF]/50 to-[#FCF8F8] border-b border-[#F9DFDF]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

          {/* Centered Main Headline */}
          <h1 className="font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5AFAF] leading-[1.12] tracking-tight max-w-4xl mx-auto">
            Handcrafted Cakes for Your{' '}
            <span className="italic font-serif">Sweetest</span> Moments
          </h1>

          {/* Centered Subtitle Paragraph */}
          <p className="font-montserrat text-sm sm:text-base md:text-lg text-[#57595B] leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6">
            Experience artisanal quality with every bite. We blend traditional techniques
            with modern high-end pastry design to create masterpieces for your special occasions.
          </p>

          {/* Centered Action Buttons (Matching Figma Dual Button Design) */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8 sm:mt-10">
            <Link
              to="/custom-order"
              id="hero-cta-custom"
              className="btn-primary bg-[#F5AFAF] hover:bg-[#EFA3A3] text-white flex items-center justify-center gap-2 text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-[#F5AFAF]/25 font-sans font-semibold transition-all duration-200 active:scale-95"
            >
              <Plus size={18} />
              Order Custom Cake
            </Link>
            <Link
              to="/gallery"
              id="hero-cta-gallery"
              className="btn-secondary border-2 border-[#F5AFAF] text-[#F5AFAF] bg-white hover:bg-[#FBEFEF] flex items-center justify-center gap-2 text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-sans font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Plus size={18} />
              View Gallery
            </Link>
          </div>

        </div>
      </section>

      {/* ── Gallery Teaser Section (Square Boxes matching Figma design) ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#F9DFDF]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <SectionHeading
              title="Inspiration Gallery"
              subtitle="Explore our curated collection of custom baked delights"
              centered={false}
            />
            <Link
              to="/gallery"
              className="flex items-center gap-2 font-montserrat font-semibold text-sm text-[#F5AFAF] hover:text-[#EFA3A3] transition-colors shrink-0"
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
                className="relative overflow-hidden rounded-2xl group aspect-square block border border-[#F9DFDF] shadow-sm hover:shadow-md hover:border-[#F5AFAF] transition-all bg-white"
              >
                <img
                  src={cake.image}
                  alt={cake.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] uppercase font-montserrat tracking-wider text-[#FBEFEF] font-medium">{cake.category}</span>
                  <p className="font-playfair text-sm sm:text-base text-white font-semibold leading-tight mt-0.5">{cake.name}</p>
                  <p className="text-xs text-[#F5AFAF] font-semibold mt-1 flex items-center gap-1">
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
              className="btn-secondary border-2 border-[#F5AFAF] text-[#F5AFAF] bg-white hover:bg-[#FBEFEF] inline-flex items-center gap-2 text-sm px-6 py-3 rounded-xl font-semibold"
            >
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Baker Values Section (Why Choose Us) ── */}
      <section className="py-14 sm:py-20 bg-[#FCF8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <SectionHeading title="Why Choose Us?" subtitle="Our commitment to artisanal excellence" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 mt-4">
            {BAKER_VALUES.map((val) => (
              <div
                key={val.title}
                className="text-center p-6 sm:p-8 rounded-2xl bg-white border border-[#F9DFDF] hover:shadow-md hover:border-[#F5AFAF] transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{val.icon}</div>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-[#F5AFAF] mb-2 sm:mb-3">{val.title}</h3>
                <p className="font-montserrat text-xs sm:text-sm text-[#57595B] leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
