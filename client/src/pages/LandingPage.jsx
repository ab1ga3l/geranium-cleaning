import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Clock, Phone, Mail, MapPin, CheckCircle, Sparkles } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const services = [
  {
    icon: '🚗',
    title: 'Car Seats',
    desc: 'Deep clean fabric and leather car seats. Remove stains, odors, and allergens for a fresh interior.',
  },
  {
    icon: '🪑',
    title: 'Office Chairs',
    desc: 'Sanitize and refresh office chairs. Improve hygiene and prolong the life of your office furniture.',
  },
  {
    icon: '🛋️',
    title: 'Sofas & Couches',
    desc: 'Thorough sofa cleaning that removes dirt, pet hair, and embedded grime from all fabric types.',
  },
  {
    icon: '🍽️',
    title: 'Dining Chairs',
    desc: 'Restore dining chairs to pristine condition. Safe for all materials including fabric and leather.',
  },
]

const steps = [
  { step: '01', title: 'Book Online', desc: 'Fill out our simple booking form with your location, seat count, and preferred date.' },
  { step: '02', title: 'Confirm & Pay', desc: 'Receive confirmation and arrange payment. Instant email receipt sent to you.' },
  { step: '03', title: 'We Come to You', desc: 'Our professional cleaner arrives at your location with all equipment needed.' },
  { step: '04', title: 'Enjoy Fresh Seats', desc: 'Sit back and enjoy spotlessly clean, fresh-smelling seats.' },
]

const testimonials = [
  { name: 'Jasmine A.', loc: 'Westlands', text: 'Absolutely amazing! My car seats look brand new. Will definitely book again.', stars: 5 },
  { name: 'Paul M.', loc: 'Karen', text: 'The team was professional, on time, and the results were incredible. Highly recommend!', stars: 5 },
  { name: 'Veronicah W.', loc: 'Kilimani', text: 'Finally a cleaning service that delivers on its promise. My sofa is spotless!', stars: 5 },
]

// Before/after placeholder images using picsum (consistent, tasteful)
const beforeAfterPairs = [
  {
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=300&fit=crop&q=80',
    label: 'Car Seats',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden pt-16"
        style={{ background: 'linear-gradient(135deg, #fef5f3 0%, #fdf8f6 50%, #f0f4f2 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #f9c8c2, transparent)', transform: 'translate(30%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #96aca0, transparent)', transform: 'translate(-30%, 30%)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: '#f9c8c2', color: '#60665a' }}>
                <Sparkles size={14} />
                Professional Seat Cleaning Services
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6" style={{ color: '#60665a' }}>
                Fresh Seats,<br />
                <span style={{ color: '#c69491' }}>Happy Spaces</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#7d9094' }}>
                Expert seat cleaning for car interiors, offices, dining rooms, and living spaces.
                Serving Nairobi & the surroundings with care, precision, and a personal touch.
              </p>
              <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#c69491" stroke="none" />)}
                </div>
                <span className="text-sm font-medium" style={{ color: '#7d9094' }}>4.9 · 200+ happy clients</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/book">
                  <button className="btn-primary flex items-center gap-2 text-base">
                    Book a Cleaning <ArrowRight size={18} />
                  </button>
                </Link>
                <a href="tel:+254768514443">
                  <button className="btn-secondary flex items-center gap-2 text-base">
                    <Phone size={18} /> Call Us
                  </button>
                </a>
              </div>
            </div>

            {/* Before/After Card */}
            <div className="relative">
              <div className="card overflow-hidden p-0 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-2 h-72 sm:h-80">
                  {/* BEFORE */}
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=320&fit=crop&q=80"
                      alt="Dirty car seat before cleaning"
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.85) saturate(0.7)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(96,102,90,0.6), transparent)' }} />
                    <div className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-full bg-white/80 font-semibold" style={{ color: '#60665a' }}>
                      Before
                    </div>
                    <div className="absolute top-3 left-3 text-white text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(198,148,145,0.85)' }}>
                      Stained & worn
                    </div>
                  </div>
                  {/* AFTER */}
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=320&fit=crop&q=80"
                      alt="Clean car seat after cleaning"
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(1.05) saturate(1.1)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(96,102,90,0.4), transparent)' }} />
                    <div className="absolute bottom-3 right-3 text-white text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ backgroundColor: '#96aca0' }}>
                      After ✨
                    </div>
                    <div className="absolute top-3 right-3 text-white text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(150,172,160,0.85)' }}>
                      Fresh & clean
                    </div>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between" style={{ backgroundColor: '#fdf8f6' }}>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#60665a' }}>Only $5.30 USD / seat</p>
                    <p className="text-xs mt-0.5" style={{ color: '#96aca0' }}>≈ KSh 700 · Professional results guaranteed</p>
                  </div>
                  <Link to="/book">
                    <button className="btn-primary text-sm px-5 py-2.5">Book Now</button>
                  </Link>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{ backgroundColor: '#c69491' }}>
                <span className="text-white font-bold text-base leading-tight">$5.30</span>
                <span className="text-white text-xs leading-tight">/seat</span>
                <span className="text-white text-xs opacity-80">USD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-y py-6" style={{ borderColor: '#e8d5d2', backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ color: '#7d9094' }}>
            {[
              { icon: <Shield size={18} />, label: 'Eco-safe products' },
              { icon: <Clock size={18} />, label: 'Same-day service' },
              { icon: <CheckCircle size={18} />, label: 'Results guaranteed' },
              { icon: <Star size={18} />, label: '4.9★ rated service' },
              { icon: <MapPin size={18} />, label: 'Nairobi & surroundings' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 font-medium">
                <span style={{ color: '#96aca0' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">What We Clean</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Specialized cleaning for all types of upholstered seats. Every surface treated with professional-grade products and care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <div key={service.title} className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#60665a' }}>{service.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7d9094' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title mb-4">Simple, Transparent Pricing</h2>
          <p className="section-subtitle mb-12">No hidden fees. Pay only for what you need.</p>

          <div className="card max-w-md mx-auto shadow-xl border-2 text-center" style={{ borderColor: '#f9c8c2' }}>
            <div className="text-6xl font-bold mb-2" style={{ color: '#c69491' }}>$5.30</div>
            <p className="text-lg font-medium mb-1" style={{ color: '#60665a' }}>per seat</p>
            <p className="text-sm mb-6" style={{ color: '#96aca0' }}>≈ KSh 700</p>
            <ul className="text-left space-y-3 mb-8">
              {[
                'All seat types: car, office, dining, sofa',
                'Professional-grade eco-safe products',
                'On-site service at your location',
                'Same-day or scheduled bookings',
                'Email confirmation & receipt',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#7d9094' }}>
                  <CheckCircle size={17} className="mt-0.5 flex-shrink-0" style={{ color: '#96aca0' }} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#fef5f3' }}>
              <p className="text-sm font-medium" style={{ color: '#60665a' }}>
                Example: 5 seats = <span style={{ color: '#c69491' }}>$26.50 (≈ KSh 3,500)</span>
              </p>
            </div>
            <Link to="/book">
              <button className="btn-primary w-full text-base">Book Your Cleaning</button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle">Four simple steps to freshly cleaned seats</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line — shown between ALL steps on lg screens */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute h-0.5 z-0"
                    style={{
                      background: 'linear-gradient(to right, #c69491, #e8d5d2)',
                      top: '2rem',
                      left: 'calc(50% + 2rem)',
                      right: 'calc(-50% + 2rem)',
                    }}
                  />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg mb-4"
                    style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#60665a' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7d9094' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Gallery */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">See the Difference</h2>
            <p className="section-subtitle">Real results from our professional cleaning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pair 1 — Car seats */}
            <div className="card p-0 overflow-hidden rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 h-56">
                <div className="relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=230&fit=crop&q=80"
                    alt="Dirty car seat" className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.8) saturate(0.6)' }} />
                  <span className="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-black/40 text-white">Before</span>
                </div>
                <div className="relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=230&fit=crop&q=80"
                    alt="Clean car seat" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: '#96aca0' }}>After ✨</span>
                </div>
              </div>
              <div className="px-5 py-3" style={{ backgroundColor: '#fdf8f6' }}>
                <p className="text-sm font-semibold" style={{ color: '#60665a' }}>🚗 Car Seats</p>
                <p className="text-xs" style={{ color: '#96aca0' }}>Fabric deep clean — stains & odour removed</p>
              </div>
            </div>

            {/* Pair 2 — Sofa */}
            <div className="card p-0 overflow-hidden rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 h-56">
                <div className="relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=230&fit=crop&q=80"
                    alt="Dirty sofa" className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.75) saturate(0.5)' }} />
                  <span className="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-black/40 text-white">Before</span>
                </div>
                <div className="relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=230&fit=crop&q=80"
                    alt="Clean sofa" className="w-full h-full object-cover"
                    style={{ filter: 'brightness(1.05) saturate(1.1)' }} />
                  <span className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: '#96aca0' }}>After ✨</span>
                </div>
              </div>
              <div className="px-5 py-3" style={{ backgroundColor: '#fdf8f6' }}>
                <p className="text-sm font-semibold" style={{ color: '#60665a' }}>🛋️ Sofa & Couch</p>
                <p className="text-xs" style={{ color: '#96aca0' }}>Full upholstery restore — pet hair & grime gone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">What Our Geranium Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="#c69491" stroke="none" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#60665a' }}>"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#60665a' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#96aca0' }}>{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #c69491 0%, #96aca0 100%)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready for Fresh Seats?</h2>
          <p className="text-lg mb-8 opacity-90">
            Book your professional cleaning today. We come to you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book">
              <button className="bg-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-all hover:shadow-lg"
                style={{ color: '#c69491' }}>
                Book Now <ArrowRight size={18} />
              </button>
            </Link>
            <a href="tel:+254768514443">
              <button className="bg-white/20 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 border border-white/40 hover:bg-white/30 transition-all">
                <Phone size={18} /> +254 768 514443
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Get in Touch</h2>
            <p className="section-subtitle">We'd love to hear from you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Phone size={24} />, title: 'Call Us', value: '+254 768 514443', href: 'tel:+254768514443' },
              { icon: <Mail size={24} />, title: 'Email Us', value: 'bookings@geraniumcleaning.co.ke', href: 'mailto:bookings@geraniumcleaning.co.ke' },
              { icon: <MapPin size={24} />, title: 'Service Area', value: 'Nairobi, Kenya', href: null },
            ].map(item => (
              <div key={item.title} className="card text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#60665a' }}>{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-sm hover:underline" style={{ color: '#7d9094' }}>{item.value}</a>
                ) : (
                  <p className="text-sm" style={{ color: '#7d9094' }}>{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
