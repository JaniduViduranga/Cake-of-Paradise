import { MapPin, Clock, MessageCircle, Camera, ThumbsUp, Play, Send, CheckCircle } from 'lucide-react';
import { useContactController } from '../../controllers/useContactController';

export default function Contact() {
  const {
    form,
    updateField,
    submitted,
    loading,
    submitContactForm,
    resetForm,
    inquiryTypes,
    hours,
  } = useContactController();

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-playfair font-bold text-4xl lg:text-5xl text-chocolate-900 mb-3">
            Let's Create Something Sweet
          </h1>
          <p className="font-montserrat text-base text-chocolate-800/60 max-w-xl leading-relaxed">
            We'd love to hear from you. Whether you have a question about our menu, need to discuss a custom wedding cake, or just want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Contact Form ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-50 p-7 lg:p-9">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-playfair font-bold text-2xl text-chocolate-900">Message Sent!</h3>
                <p className="font-montserrat text-sm text-chocolate-800/60 max-w-sm">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={resetForm}
                  className="btn-primary mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={submitContactForm} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">
                      Phone Number <span className="font-normal text-chocolate-800/30">(Optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">
                      Event Date <span className="font-normal text-chocolate-800/30">(If applicable)</span>
                    </label>
                    <input
                      id="contact-event-date"
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => updateField('eventDate', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <select
                      id="contact-inquiry-type"
                      value={form.inquiryType}
                      onChange={(e) => updateField('inquiryType', e.target.value)}
                      className="input-field appearance-none pr-8 cursor-pointer"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-chocolate-800/30">▾</div>
                  </div>
                </div>

                <div>
                  <label className="block font-montserrat text-xs font-semibold text-chocolate-800/60 mb-1.5 uppercase tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell us about your sweet ideas..."
                    required
                    className="input-field resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 btn-primary py-3.5 disabled:opacity-60"
                >
                  <Send size={15} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* ── Info Panel ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bakery Image */}
            <div className="relative rounded-2xl overflow-hidden h-44">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop"
                alt="Our bakery"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <p className="font-montserrat font-semibold text-xs text-chocolate-900">Visit Us</p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 space-y-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-caramel-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-montserrat font-bold text-sm text-chocolate-900 mb-1">Our Bakery</h4>
                  <p className="font-montserrat text-sm text-chocolate-800/60 leading-relaxed">
                    123 Artisanal Avenue<br />Pastry District<br />Sweetville, CA 90210
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-caramel-600 shrink-0 mt-0.5" />
                <div className="w-full">
                  <h4 className="font-montserrat font-bold text-sm text-chocolate-900 mb-2">Hours</h4>
                  <div className="space-y-1.5">
                    {hours.map((row) => (
                      <div key={row.day} className="flex items-center justify-between">
                        <span className="font-montserrat text-xs text-chocolate-800/60">{row.day}</span>
                        <span className={`font-montserrat text-xs font-semibold ${row.hours === 'Closed' ? 'text-red-400' : 'text-chocolate-900'}`}>
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Map iframe */}
              <div className="rounded-xl overflow-hidden h-32 bg-cream-100 relative">
                <iframe
                  title="Bakery Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-118.2711%2C34.0522%2C-118.2311%2C34.0722&layer=mapnik"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <a
              id="whatsapp-cta"
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 text-white font-montserrat font-bold text-sm tracking-wide px-5 py-4 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>

            {/* Social */}
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between">
              <span className="font-montserrat text-xs font-semibold text-chocolate-800/50 uppercase tracking-widest">Follow Us</span>
              <div className="flex gap-4">
                {[Camera, ThumbsUp, Play].map((Icon, i) => (
                  <a key={i} href="#" className="text-chocolate-800/40 hover:text-caramel-600 transition-colors">
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
