import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'About & Contact', to: '/about' },
];

export default function Footer() {
  return (
    <footer className="bg-chocolate-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-12 pb-6">
        {/* Main Grid: Left details & Right Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-10">
          {/* Brand & Contact Info Column */}
          <div className="space-y-4">
            <Link
              to="/"
              className="font-playfair font-bold text-2xl text-cream-50 block hover:text-cream-200 transition-colors"
            >
              Cake of Paradise
            </Link>

            <p className="font-montserrat text-sm text-cream-200/80 leading-relaxed max-w-md">
              Artisanal baking bringing elegance and sweetness to your table.<br className="hidden sm:inline" />
              Every cake is a masterpiece.
            </p>

            {/* Opening Hours with Timer Icon */}
            <div className="flex items-start gap-2.5 pt-1">
              <Clock size={16} className="text-cream-200/70 mt-1 shrink-0" />
              <div className="font-montserrat text-sm text-cream-200/80 leading-relaxed space-y-0.5">
                <p>Mon–Fri: 8:00 AM – 8:00 PM</p>
                <p>Saturday: 9:00 AM – 7:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            {/* Address with MapPin Icon */}
            <div className="flex items-start gap-2.5 pt-1">
              <MapPin size={16} className="text-cream-200/70 mt-1 shrink-0" />
              <p className="font-montserrat text-sm text-cream-200/80 leading-relaxed">
                Rathaba para, Abagasdoowa,<br />
                Welimada, Sri Lanka
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:pl-10">
            <h4 className="font-playfair font-semibold text-cream-50 text-base mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-montserrat text-sm text-cream-200/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-cream-200/10 flex items-center justify-end text-xs font-montserrat text-cream-200/60">
          <p>© {new Date().getFullYear() || 2026} Cake of Paradise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
