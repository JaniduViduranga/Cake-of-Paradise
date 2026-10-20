import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { CAKES, BAKER_VALUES } from '../../models/cakes';
import HomePageImage from '../../assets/HomePageImage.jpg';

const STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '12+', label: 'Signature Recipes' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* ── Hero ── */}
      <section
        className="pt-16"
        style={{ background: 'linear-gradient(135deg, #fff8f6 0%, #ffeee8 50%, #fff8f6 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* ── Text side ── */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cream-200/60 text-caramel-600 font-montserrat font-semibold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 sm:mb-6">
              <Leaf size={12} />
              Freshly Baked Daily
            </div>

            {/* Headline */}
            <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-chocolate-900 leading-tight mb-4 sm:mb-6">
              Handcrafted Cakes for Your{' '}
              <span className="text-caramel-600 italic">Sweetest</span> Moments
            </h1>

            {/* Sub-text */}
            <p className="font-montserrat text-sm sm:text-base lg:text-lg text-chocolate-800/70 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Experience artisanal quality with every bite. We blend traditional techniques
              with modern high-end pastry design to create masterpieces for your special occasions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/custom-order"
                id="hero-cta-custom"
                className="btn-primary flex items-center gap-2 text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4"
              >
                Order Custom Cake
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/gallery"
                id="hero-cta-gallery"
                className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4"
              >
                Gallery
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-8 pt-6 border-t border-caramel-600/10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-playfair font-bold text-xl sm:text-2xl text-chocolate-900">{stat.value}</p>
                  <p className="font-montserrat text-xs text-chocolate-800/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Hero Image ── */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Glow blur */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-br from-cream-200/40 to-rose-soft/30 blur-xl pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-caramel-600/10">
                <img
                  src={HomePageImage}
                  alt="Beautiful handcrafted wedding cake with rose decorations"
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[520px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Baker Values ── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <SectionHeading title="Why Choose Us?" subtitle="Our commitment to artisanal excellence" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 mt-4">
            {BAKER_VALUES.map((val) => (
              <div
                key={val.title}
                className="text-center p-6 sm:p-8 rounded-2xl bg-cream-50 border border-gray-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{val.icon}</div>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-chocolate-900 mb-2 sm:mb-3">{val.title}</h3>
                <p className="font-montserrat text-xs sm:text-sm text-chocolate-800/60 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Teaser ── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <SectionHeading title="Inspiration Gallery" subtitle="A taste of our recent creations" centered={false} />
            <Link
              to="/gallery"
              className="hidden sm:flex items-center gap-1.5 font-montserrat font-semibold text-sm text-caramel-600 hover:text-caramel-700 transition-colors shrink-0 ml-4"
            >
              View Gallery <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CAKES.slice(0, 4).map((cake) => (
              <Link
                key={cake.id}
                to="/gallery"
                className="relative overflow-hidden rounded-xl group aspect-square block"
              >
                <img
                  src={cake.image}
                  alt={cake.name}
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-chocolate-900/0 group-hover:bg-chocolate-900/30 transition-all duration-300 flex items-end p-2 sm:p-3 opacity-0 group-hover:opacity-100">
                  <p className="font-playfair text-xs sm:text-sm text-white font-semibold leading-tight">{cake.name}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile view all */}
          <div className="text-center mt-6 sm:hidden">
            <Link to="/gallery" className="btn-secondary inline-flex items-center gap-1.5 text-sm">
              View Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
