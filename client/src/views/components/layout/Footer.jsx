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
    { label: 'Menu', to: '/menu' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Custom Order', to: '/custom-order' },
    { label: 'About Us', to: '/about' },
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
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-montserrat font-semibold text-xs tracking-wide px-4 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <MessageCircle size={15} />
              Chat on WhatsApp
            </a>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-montserrat font-semibold text-xs tracking-widest uppercase text-cream-50 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="font-montserrat text-sm text-cream-200/70 hover:text-cream-200 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="font-montserrat text-sm text-cream-200/70 hover:text-cream-200 transition-colors"
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

        {/* Bottom Bar */}
        <div className="border-t border-cream-50/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-montserrat text-xs text-cream-200/50 text-center sm:text-left">
            © 2024 Cake of Paradise. Artisanally Crafted.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <span className="font-montserrat text-xs text-cream-200/50 uppercase tracking-widest">Follow Us</span>
            {[
              { Icon: Camera, label: 'Instagram', href: '#' },
              { Icon: ThumbsUp, label: 'Facebook', href: '#' },
              { Icon: Play, label: 'YouTube', href: '#' },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-cream-200/50 hover:text-cream-200 transition-colors"
              >
                <Icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
