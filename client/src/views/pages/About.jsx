import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { BAKER_VALUES } from '../../models/cakes';

const PHILOSOPHY_POINTS = [
  { title: 'Artisan Focus', desc: 'Dedication to traditional techniques over mass production.' },
  { title: 'Fresh Ingredients', desc: 'Sourcing locally and seasonally for the purest flavors.' },
  { title: 'Handcrafted Care', desc: 'Every detail, from the crumb to the frosting, is shaped by hand.' },
];

const TEAM = [
  { name: 'Chef Isabelle Moreau', role: 'Head Pastry Chef & Founder', bio: 'Trained at Le Cordon Bleu Paris, Isabelle brings 15 years of artisanal baking expertise to every creation.' },
  { name: 'Aria Tan', role: 'Cake Design Artist', bio: 'A fine arts graduate with a passion for edible sculpture, Aria transforms simple cakes into breathtaking works of art.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556909114-44e3e9699a06?w=1600&auto=format&fit=crop"
          alt="Our bakery kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate-900/40 via-chocolate-900/20 to-cream-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-playfair font-bold text-4xl lg:text-5xl text-white mb-3">
              Baking Memories with Passion
            </h1>
            <p className="font-montserrat text-base text-white/80">
              Crafting artisanal delights that elevate every celebration.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="font-playfair font-bold text-3xl text-chocolate-900 mb-5">Our Story</h2>
            <p className="font-montserrat text-base text-chocolate-800/70 leading-relaxed mb-5">
              Cake of Paradise began with a simple dream: to bring the warmth of a traditional bakery to modern celebrations. Every creation is a testament to our dedication to the craft.
            </p>
            <p className="font-montserrat text-base text-chocolate-800/70 leading-relaxed mb-7">
              We believe that a cake is more than just dessert; it's a centerpiece of memories, a symbol of joy, and a work of art meant to be shared.
            </p>

            <h3 className="font-playfair font-semibold italic text-xl text-caramel-600 mb-4">Our Baking Philosophy</h3>
            <ul className="space-y-4">
              {PHILOSOPHY_POINTS.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-caramel-600 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-caramel-600" />
                  </div>
                  <p className="font-montserrat text-sm text-chocolate-800/70 leading-relaxed">
                    <strong className="text-chocolate-900">{point.title}:</strong> {point.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-cream-200/40 to-rose-soft/20 blur-lg" />
            <img
              src="https://images.unsplash.com/photo-1607478900766-efe13248b125?w=800&auto=format&fit=crop"
              alt="Our bakers at work"
              className="relative rounded-2xl w-full h-80 lg:h-[450px] object-cover shadow-xl"
            />
            {/* Overlay badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <p className="font-playfair italic text-caramel-600 font-semibold text-sm">Cake of Paradise</p>
              <p className="font-montserrat text-xs text-chocolate-800/50">Est. 2021</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <SectionHeading title="What We Stand For" subtitle="Our commitments that define every cake we bake" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {BAKER_VALUES.map((val) => (
              <div key={val.title} className="bg-cream-50 rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-all duration-300 text-center group">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{val.icon}</div>
                <h3 className="font-playfair font-bold text-lg text-chocolate-900 mb-2">{val.title}</h3>
                <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <SectionHeading title="Meet Our Bakers" subtitle="The passionate artisans behind every creation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mt-4">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50">
                <div className="h-52 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${member.name.includes('Isabelle') ? '1607478900766-efe13248b125' : '1607748851687-1e576f03a5be'}?w=600&auto=format&fit=crop`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-playfair font-bold text-lg text-chocolate-900">{member.name}</h3>
                  <p className="font-montserrat text-xs text-caramel-600 font-semibold uppercase tracking-wide mt-1">{member.role}</p>
                  <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed mt-3">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-chocolate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair font-bold text-3xl lg:text-4xl text-cream-50 mb-4">
            Ready to Create Something Sweet?
          </h2>
          <p className="font-montserrat text-sm text-cream-200/70 leading-relaxed mb-8">
            Let us craft the perfect cake for your next special occasion. Contact us or start your custom order today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/custom-order" className="inline-flex items-center justify-center gap-2 bg-cream-50 text-chocolate-900 font-montserrat font-bold text-sm tracking-wide px-8 py-3.5 rounded hover:bg-white transition-colors">
              Order Custom Cake <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-cream-200/30 text-cream-200 font-montserrat font-semibold text-sm tracking-wide px-8 py-3.5 rounded hover:border-cream-200/60 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
