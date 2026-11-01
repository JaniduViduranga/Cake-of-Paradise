import { Link } from 'react-router-dom';
import { Camera, ThumbsUp, Play, MessageCircle, MapPin, Clock } from 'lucide-react';

const FOOTER_LINKS = {
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
  Information: [
    { label: 'Shipping Info', href: '#' },
    { label: 'Wholesale', href: '#' },
  ],
  'Quick Links': [
    { label: 'Gallery', to: '/gallery' },
    { label: 'Custom Order', to: '/custom-order' },
    { label: 'About & Contact', to: '/about' },
    { label: 'Admin Portal', to: '/admin' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-chocolate-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-12 pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-playfair italic font-semibold text-2xl text-cream-50 mb-4 block hover:text-cream-200 transition-colors">
              Cake of Paradise
            </Link>
            <p className="font-montserrat text-sm text-cream-200/80 leading-relaxed mb-5">
              Artisanal baking bringing elegance and sweetness to your table. Every cake is a masterpiece.
            </p>
            {/* Store Hours */}
            <div className="flex items-start gap-2 mb-3">
              <Clock size={14} className="text-cream-200/60 mt-0.5 shrink-0" />
              <div className="font-montserrat text-xs text-cream-200/70 space-y-1">
                <p><span className="text-cream-200">Mon–Fri:</span> 8:00 AM – 8:00 PM</p>
                <p><span className="text-cream-200">Saturday:</span> 9:00 AM – 7:00 PM</p>
                <p><span className="text-cream-200">Sunday:</span> Closed</p>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-start gap-2 mb-5">
              <MapPin size={14} className="text-cream-200/60 mt-0.5 shrink-0" />
              <p className="font-montserrat text-xs text-cream-200/70 leading-relaxed">
                123 Artisanal Avenue, Pastry District<br />Sweetville, CA 90210
              </p>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-playfair font-semibold text-cream-50 text-base mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="font-montserrat text-xs text-cream-200/70 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        {link.label}
                        {link.label === 'Admin Portal' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-caramel-600 text-white">Chef</span>
                        )}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="font-montserrat text-xs text-cream-200/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-cream-200/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-montserrat text-cream-200/50">
          <p>© {new Date().getFullYear()} Cake of Paradise. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-cream-200 text-caramel-400 font-semibold">
              Admin Portal
            </Link>
            <span>•</span>
            <a href="#" className="hover:text-cream-200">Terms & Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-cream-200">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
