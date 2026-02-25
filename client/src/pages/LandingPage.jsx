import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Star, Shield, Clock, Phone, Mail, MapPin,
  CheckCircle, Sparkles, ChevronDown, ChevronUp, Leaf, Award, Users, Zap
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// ── Data ──────────────────────────────────────────────────────────────────────

const services = [
  {
    icon: '🚗',
    title: 'Car Seats',
    desc: 'Deep clean fabric and leather car seats. Remove stains, odors, and allergens for a fresh interior.',
    highlight: 'Most popular',
  },
  {
    icon: '🛋️',
    title: 'Sofas & Couches',
    desc: 'Thorough sofa cleaning that removes dirt, pet hair, and embedded grime from all fabric types.',
    highlight: null,
  },
  {
    icon: '🪑',
    title: 'Office Chairs',
    desc: 'Sanitize and refresh office chairs. Improve hygiene and prolong the life of your office furniture.',
    highlight: null,
  },
  {
    icon: '🍽️',
    title: 'Dining Chairs',
    desc: 'Restore dining chairs to pristine condition. Safe for all materials including fabric and leather.',
    highlight: null,
  },
  {
    icon: '🛏️',
    title: 'Mattresses',
    desc: 'Deep clean your mattress — remove dust mites, stains, bacteria, and allergens for a healthier sleep.',
    highlight: null,
  },
  {
    icon: '🪵',
    title: 'Bed Frames',
    desc: 'Bedroom headboards and side bed frames cleaned and refreshed. Fabric and upholstered frames welcome.',
    highlight: null,
  },
  {
    icon: '🏠',
    title: 'Carpets',
    desc: 'Professional carpet deep cleaning coming soon. Join the waitlist when you book.',
    highlight: 'Coming soon',
  },
]

const steps = [
  { step: '01', icon: '📱', title: 'Book Online', desc: 'Fill out our quick booking form with your location, seat count, and preferred date.' },
  { step: '02', icon: '✅', title: 'Get Confirmed', desc: 'Receive instant email confirmation. We review and accept your booking same day.' },
  { step: '03', icon: '🚐', title: 'We Come to You', desc: 'Our professional cleaner arrives with all equipment needed — no hassle for you.' },
  { step: '04', icon: '✨', title: 'Enjoy Clean Results', desc: 'Sit back and enjoy spotlessly clean, fresh results — guaranteed every time.' },
]

const testimonials = [
  { name: 'Jasmine A.', loc: 'Waiyaki Way', text: 'Absolutely amazing! My car seats look brand new. The cleaner was punctual and so thorough. Will definitely book again.', stars: 5, avatar: 'JA' },
  { name: 'Paul M.', loc: 'Ruaraka', text: 'The team was professional, on time, and the results were incredible. My office chairs look fresh out of the factory!', stars: 5, avatar: 'PM' },
  { name: 'Veronicah W.', loc: 'Kahawa Sukari', text: 'Finally a cleaning service that delivers on its promise. My sofa is completely spotless. Best KSh 700 I\'ve ever spent.', stars: 5, avatar: 'VW' },
  { name: 'Cathy M.', loc: 'Garden Estate', text: 'They cleaned my cat-stained sofa and it looks and smells completely new. I was worried about the pet hair and odors but they handled it perfectly. Highly recommend!', stars: 5, avatar: 'CM' },
  { name: 'Sheila K.', loc: 'Kilimani', text: 'Super convenient, they came right to my parking. Seats are immaculate. Booked them again the following week!', stars: 5, avatar: 'SK' },
  { name: 'James N.', loc: 'Ruiru', text: 'Great value for money. The eco-friendly products mean I don\'t worry about my kids sitting on freshly cleaned seats.', stars: 5, avatar: 'JN' },
  { name: 'Pauline W.', loc: 'Lower Kabete', text: 'I had my mattress and dining chairs done at the same visit. Super convenient, professional team and the mattress is completely fresh now. Will book monthly!', stars: 5, avatar: 'PW' },
  { name: 'Kevin O.', loc: 'Eastleigh', text: 'Booked for my office — 8 chairs done in under 2 hours. Very professional, arrived on time and the results were brilliant. Already recommended to colleagues.', stars: 5, avatar: 'KO' },
]

const stats = [
  { icon: <Users size={28} />, value: '100+', label: 'Happy Clients' },
  { icon: <Award size={28} />, value: '4.9★', label: 'Average Rating' },
  { icon: <Zap size={28} />, value: 'Same Day', label: 'Service Available' },
  { icon: <Leaf size={28} />, value: '100%', label: 'Eco-Safe Products' },
]

const faqs = [
  {
    q: 'How long does cleaning take?',
    a: 'Most jobs take 30–90 minutes depending on the number of seats and how soiled they are. Car seats usually take about 45 minutes for a full set.'
  },
  {
    q: 'Do you bring your own equipment?',
    a: 'Yes! We arrive fully equipped with professional-grade cleaning machines and eco-safe products. You don\'t need to prepare anything.'
  },
  {
    q: 'Is it safe for children and pets?',
    a: 'Absolutely. We use only eco-safe, non-toxic products that are completely safe for kids and pets once dry (usually 1–2 hours).'
  },
  {
    q: 'Do you serve areas outside Nairobi?',
    a: 'We cover Nairobi and surrounding areas including Kiambu, Machakos, and parts of the greater Nairobi metro. Contact us to confirm your area.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We currently accept M-Pesa and cash on service. Online card payment is coming soon.'
  },
  {
    q: 'What if I\'m not satisfied with the results?',
    a: 'We offer a satisfaction guarantee — if you\'re not happy, we\'ll re-clean at no extra charge. Your satisfaction is our priority.'
  },
]

const areas = [
  'CBD', 'Westlands', 'Karen', 'Kilimani', 'Lavington', 'Parklands',
  'Ngong Road', 'South B', 'South C', 'Eastleigh', 'Kasarani', 'Ruiru',
  'Thika', 'Rongai', 'Kiambu', 'Gigiri', 'Runda', 'Muthaiga',
  'Kahawa Sukari', 'Kahawa Wendani',
]

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  useReveal()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden pt-16"
        style={{ background: 'linear-gradient(135deg, #fef5f3 0%, #fdf8f6 50%, #f0f4f2 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,200,194,0.35), transparent 70%)', transform: 'translate(30%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(150,172,160,0.25), transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 badge-gradient shadow-md">
                <Sparkles size={14} />
                Nairobi's #1 Upholstery &amp; Mattress Cleaning
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6" style={{ color: '#60665a' }}>
                Clean Spaces,<br />
                <span className="shimmer-text">Happy Homes</span>
              </h1>

              <p className="text-lg mb-6 leading-relaxed" style={{ color: '#7d9094' }}>
                Expert cleaning for car seats, sofas, mattresses, bed frames, and more.
                We come to <strong style={{ color: '#60665a' }}>you</strong> — anywhere in Nairobi.
              </p>

              {/* Mini trust signals */}
              <div className="flex flex-wrap gap-3 mb-8">
                {['✓ Same-day service', '✓ Eco-safe products', '✓ Results guaranteed'].map(t => (
                  <span key={t} className="text-sm font-medium px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#f0f4f2', color: '#60665a' }}>{t}</span>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#c69491" stroke="none" />)}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#60665a' }}>4.9</span>
                <span className="text-sm" style={{ color: '#7d9094' }}>· Trusted by 100+ clients in Nairobi</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/book">
                  <button className="btn-primary flex items-center gap-2 text-base shadow-lg">
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

            {/* Right — Before/After card */}
            <div className="relative float-card">
              <div className="card overflow-hidden p-0 rounded-3xl shadow-2xl">
                <div className="grid grid-cols-2 h-72 sm:h-80">
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=320&fit=crop&q=80"
                      alt="Dirty car seat before cleaning"
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.82) saturate(0.6)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(60,60,55,0.55), transparent)' }} />
                    <span className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-full bg-black/50 text-white font-bold">Before</span>
                    <span className="absolute top-3 left-3 text-white text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(198,148,145,0.85)' }}>Stained & worn</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=320&fit=crop&q=80"
                      alt="Clean car seat after cleaning"
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(1.05) saturate(1.1)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(60,60,55,0.35), transparent)' }} />
                    <span className="absolute bottom-3 right-3 text-white text-xs px-2.5 py-1 rounded-full font-bold"
                      style={{ backgroundColor: '#96aca0' }}>After ✨</span>
                    <span className="absolute top-3 right-3 text-white text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(150,172,160,0.85)' }}>Fresh & clean</span>
                  </div>
                </div>

                {/* Divider line */}
                <div className="absolute top-0 bottom-16 left-1/2 w-0.5 -translate-x-1/2 z-10"
                  style={{ background: 'rgba(255,255,255,0.8)' }} />

                <div className="p-5 flex items-center justify-between" style={{ backgroundColor: '#fdf8f6' }}>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#60665a' }}>From KSh 700 <span className="text-sm font-normal" style={{ color: '#96aca0' }}>/ item</span></p>
                    <p className="text-xs mt-0.5" style={{ color: '#96aca0' }}>Professional results guaranteed</p>
                  </div>
                  <Link to="/book">
                    <button className="btn-primary text-sm px-5 py-2.5">Book Now</button>
                  </Link>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl"
                style={{ background: 'linear-gradient(135deg, #c69491, #96aca0)' }}>
                <span className="text-white font-bold text-xs leading-tight">From</span>
                <span className="text-white font-extrabold text-sm leading-tight">KSh 700</span>
                <span className="text-white text-xs opacity-80">/item</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs" style={{ color: '#7d9094' }}>Scroll to explore</span>
          <ChevronDown size={16} style={{ color: '#7d9094' }} className="animate-bounce" />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="border-y py-5" style={{ borderColor: '#e8d5d2', backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm" style={{ color: '#7d9094' }}>
            {[
              { icon: <Shield size={17} />, label: 'Eco-safe products' },
              { icon: <Clock size={17} />, label: 'Same-day service' },
              { icon: <CheckCircle size={17} />, label: 'Results guaranteed' },
              { icon: <Star size={17} />, label: '4.9★ rated service' },
              { icon: <MapPin size={17} />, label: 'Nairobi & surroundings' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 font-medium">
                <span style={{ color: '#c69491' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <div key={s.label} className={`stat-card reveal reveal-delay-${i + 1}`}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                  {s.icon}
                </div>
                <p className="text-3xl font-extrabold mb-1" style={{ color: '#60665a' }}>{s.value}</p>
                <p className="text-sm" style={{ color: '#96aca0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>What We Clean</div>
            <h2 className="section-title mb-4">Professional Deep Cleaning</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Seats, mattresses, bed frames and more — every surface treated with professional-grade, eco-safe products. We don't just clean — we restore.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={service.title}
                className={`card service-card text-center relative reveal reveal-delay-${i + 1}`}>
                {service.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white shadow"
                    style={{ backgroundColor: service.highlight === 'Coming soon' ? '#96aca0' : '#c69491', whiteSpace: 'nowrap' }}>
                    {service.highlight}
                  </div>
                )}
                <div className="text-5xl mb-4 mt-2">{service.icon}</div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#60665a' }}>{service.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7d9094' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER GALLERY ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>Real Results</div>
            <h2 className="section-title mb-4">See the Difference</h2>
            <p className="section-subtitle">These are actual before & after results from our cleaning jobs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=230&fit=crop&q=80',
                after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=230&fit=crop&q=80',
                label: '🚗 Car Seats', sub: 'Fabric deep clean — stains & odour removed',
              },
              {
                before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=230&fit=crop&q=80',
                after: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=230&fit=crop&q=80',
                label: '🛋️ Sofa & Couch', sub: 'Full upholstery restore — pet hair & grime gone',
              },
              {
                before: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=400&h=230&fit=crop&q=80',
                after: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=230&fit=crop&q=80',
                label: '🛏️ Mattress', sub: 'Deep clean — dust mites, stains & allergens removed',
              },
              {
                before: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=230&fit=crop&q=80',
                after: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=230&fit=crop&q=80',
                label: '🪵 Bed Frame', sub: 'Headboard & side frames cleaned & refreshed',
              },
            ].map((pair, i) => (
              <div key={pair.label} className={`card p-0 overflow-hidden rounded-2xl shadow-lg reveal reveal-delay-${i + 1}`}>
                <div className="grid grid-cols-2 h-56 relative">
                  <div className="relative overflow-hidden">
                    <img src={pair.before} alt="Before" className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.78) saturate(0.55)' }} />
                    <span className="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-black/50 text-white">Before</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img src={pair.after} alt="After" className="w-full h-full object-cover"
                      style={{ filter: 'brightness(1.05) saturate(1.1)' }} />
                    <span className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: '#96aca0' }}>After ✨</span>
                  </div>
                  {/* Center divider */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 z-10 bg-white/70" />
                </div>
                <div className="px-5 py-3" style={{ backgroundColor: '#fdf8f6' }}>
                  <p className="text-sm font-semibold" style={{ color: '#60665a' }}>{pair.label}</p>
                  <p className="text-xs" style={{ color: '#96aca0' }}>{pair.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>Simple Process</div>
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle">Four simple steps to spotlessly clean results</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className={`relative reveal reveal-delay-${i + 1}`}>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute h-0.5 z-0"
                    style={{
                      background: 'linear-gradient(to right, #c69491, #e8d5d2)',
                      top: '2rem', left: 'calc(50% + 2.5rem)', right: 'calc(-50% + 2.5rem)',
                    }} />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #f9c8c2, #e8c4c0)' }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: '#c69491' }}>STEP {step.step}</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#60665a' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7d9094' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>Transparent Pricing</div>
            <h2 className="section-title mb-4">Simple, Honest Pricing</h2>
            <p className="section-subtitle mb-12">No hidden fees. No surprises. Pay only for what you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            {/* Seat Cleaning */}
            <div className="card shadow-xl border-2 text-center relative" style={{ borderColor: '#f9c8c2' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full text-xs font-bold text-white badge-gradient" style={{ whiteSpace: 'nowrap' }}>
                Most popular
              </div>
              <div className="text-4xl mb-3 mt-2">🪑</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#60665a' }}>Seat Cleaning</h3>
              <div className="text-4xl font-extrabold my-3 shimmer-text">KSh 700</div>
              <p className="text-sm mb-4" style={{ color: '#96aca0' }}>per seat</p>
              <ul className="text-left space-y-2 mb-6 text-sm" style={{ color: '#7d9094' }}>
                {['Car seats', 'Office chairs', 'Dining chairs', 'Sofas & couches'].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#96aca0', flexShrink: 0 }} />{i}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[['4 seats', 'KSh 2,800'], ['8 seats', 'KSh 5,600']].map(([label, price]) => (
                  <div key={label} className="p-2 rounded-xl" style={{ backgroundColor: '#fef5f3' }}>
                    <p className="text-xs" style={{ color: '#96aca0' }}>{label}</p>
                    <p className="font-bold text-sm" style={{ color: '#c69491' }}>{price}</p>
                  </div>
                ))}
              </div>
              <Link to="/book"><button className="btn-primary w-full text-sm">Book Seat Cleaning</button></Link>
            </div>

            {/* Mattress Cleaning */}
            <div className="card shadow-xl border-2 text-center" style={{ borderColor: '#e8d5d2' }}>
              <div className="text-4xl mb-3 mt-2">🛏️</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#60665a' }}>Mattress Cleaning</h3>
              <p className="text-sm mb-3" style={{ color: '#96aca0' }}>Priced by mattress size</p>
              <div className="space-y-2 mb-5">
                {[['Single', 'KSh 1,500'], ['Double', 'KSh 2,000'], ['King', 'KSh 2,500']].map(([size, price]) => (
                  <div key={size} className="flex justify-between items-center px-3 py-2 rounded-xl" style={{ backgroundColor: '#fef5f3' }}>
                    <span className="text-sm font-medium" style={{ color: '#60665a' }}>{size}</span>
                    <span className="font-bold text-sm" style={{ color: '#c69491' }}>{price}</span>
                  </div>
                ))}
              </div>
              <ul className="text-left space-y-2 mb-6 text-sm" style={{ color: '#7d9094' }}>
                {['Deep clean & sanitize', 'Stain & odour removal', 'Dust mite treatment', 'Allergen protection'].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#96aca0', flexShrink: 0 }} />{i}
                  </li>
                ))}
              </ul>
              <Link to="/book"><button className="btn-primary w-full text-sm">Book Mattress Cleaning</button></Link>
            </div>

            {/* Bed Frame Cleaning */}
            <div className="card shadow-xl border-2 text-center" style={{ borderColor: '#e8d5d2' }}>
              <div className="text-4xl mb-3 mt-2">🪵</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#60665a' }}>Bed Frame Cleaning</h3>
              <div className="text-4xl font-extrabold my-3" style={{ color: '#c69491' }}>KSh 800</div>
              <p className="text-sm mb-4" style={{ color: '#96aca0' }}>per frame</p>
              <ul className="text-left space-y-2 mb-6 text-sm" style={{ color: '#7d9094' }}>
                {['Bedroom headboard', 'Side bed frames', 'Fabric & upholstered frames', 'Stain & dust removal'].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: '#96aca0', flexShrink: 0 }} />{i}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[['1 frame', 'KSh 800'], ['3 frames', 'KSh 2,400']].map(([label, price]) => (
                  <div key={label} className="p-2 rounded-xl" style={{ backgroundColor: '#fef5f3' }}>
                    <p className="text-xs" style={{ color: '#96aca0' }}>{label}</p>
                    <p className="font-bold text-sm" style={{ color: '#c69491' }}>{price}</p>
                  </div>
                ))}
              </div>
              <Link to="/book"><button className="btn-primary w-full text-sm">Book Frame Cleaning</button></Link>
            </div>
          </div>

          <p className="mt-8 text-sm reveal" style={{ color: '#96aca0' }}>
            💡 Combo deals available — ask us when booking · Satisfaction guaranteed or we redo it free
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>Reviews</div>
            <h2 className="section-title mb-4">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#c69491" stroke="none" />)}
              <span className="font-bold ml-2" style={{ color: '#60665a' }}>4.9/5</span>
              <span style={{ color: '#96aca0' }}>· 100+ happy clients</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`card service-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={15} fill="#c69491" stroke="none" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#60665a' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f9c8c2, #c69491)', color: 'white' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#60665a' }}>{t.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: '#96aca0' }}>
                      <MapPin size={10} />{t.loc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>Coverage</div>
            <h2 className="section-title mb-4">We Cover All of Nairobi</h2>
            <p className="section-subtitle mb-10">From Karen to Kasarani — we come to you. Don't see your area? Contact us!</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 reveal">
            {areas.map(area => (
              <span key={area} className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{ backgroundColor: 'white', color: '#60665a', borderColor: '#e8d5d2' }}>
                📍 {area}
              </span>
            ))}
          </div>
          <div className="mt-8 reveal">
            <Link to="/book">
              <button className="btn-primary flex items-center gap-2 mx-auto">
                Book in Your Area <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>FAQ</div>
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know before booking</p>
          </div>
          <div className="space-y-3 reveal">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item border" style={{ borderColor: '#e8d5d2' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-sm"
                  style={{ color: '#60665a', background: openFaq === i ? '#fef5f3' : 'white', border: 'none', cursor: 'pointer' }}>
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={18} style={{ color: '#c69491', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: '#96aca0', flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#7d9094', backgroundColor: '#fef5f3' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #c69491 0%, #96aca0 100%)' }}>
        <div className="max-w-3xl mx-auto text-center text-white reveal">
          <div className="text-5xl mb-4">🌸</div>
          <h2 className="text-4xl font-bold mb-4">Ready for a Fresher Home?</h2>
          <p className="text-lg mb-8 opacity-90">
            Book online in under 2 minutes. We come to you — same day available!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book">
              <button className="bg-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-all hover:shadow-xl shadow-lg"
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
          <p className="text-sm mt-6 opacity-75">From KSh 700 · Eco-safe products · Guaranteed results</p>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fdf8f6' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="section-title mb-4">Get in Touch</h2>
            <p className="section-subtitle">We'd love to hear from you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto reveal">
            {[
              { icon: <Phone size={24} />, title: 'Call or WhatsApp', value: '+254 768 514443', href: 'tel:+254768514443', sub: 'Mon–Sat, 8am–7pm' },
              { icon: <MapPin size={24} />, title: 'Service Area', value: 'All of Nairobi, Kenya', href: null, sub: 'We come to you' },
            ].map(item => (
              <div key={item.title} className="card text-center service-card">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #f9c8c2, #e8c4c0)', color: '#c69491' }}>
                  {item.icon}
                </div>
                <h3 className="font-bold mb-1" style={{ color: '#60665a' }}>{item.title}</h3>
                <p className="text-xs mb-2" style={{ color: '#96aca0' }}>{item.sub}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm hover:underline font-medium" style={{ color: '#c69491' }}>{item.value}</a>
                ) : (
                  <p className="text-sm font-medium" style={{ color: '#7d9094' }}>{item.value}</p>
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
