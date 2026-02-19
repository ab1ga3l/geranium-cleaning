import { Flower, Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#60665a' }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f9c8c2' }}>
                <Flower size={18} style={{ color: '#c69491' }} />
              </div>
              <div>
                <span className="font-bold text-lg">Geranium</span>
                <span className="font-light text-lg ml-1" style={{ color: '#f9c8c2' }}>Cleaning</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#b8c4c2' }}>
              Professional seat cleaning services in Nairobi & the surroundings.
              Bringing freshness and care to every seat we touch.
            </p>
            <p className="mt-4 text-sm font-medium" style={{ color: '#f9c8c2' }}>
              By Patience Wanja
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4" style={{ color: '#f9c8c2' }}>Quick Links</h4>
            <ul className="space-y-2">
              {['Services', 'Pricing', 'How It Works', 'Book Now'].map(item => (
                <li key={item}>
                  <Link
                    to={item === 'Book Now' ? '/book' : '/'}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#b8c4c2' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4" style={{ color: '#f9c8c2' }}>Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm" style={{ color: '#b8c4c2' }}>
                <Phone size={16} style={{ color: '#f9c8c2' }} />
                <a href="tel:+254768514443" className="hover:text-white transition-colors">+254 768 514443</a>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: '#b8c4c2' }}>
                <Mail size={16} style={{ color: '#f9c8c2' }} />
                <a href="mailto:bookings@geraniumcleaning.co.ke" className="hover:text-white transition-colors">
                  bookings@geraniumcleaning.co.ke
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: '#b8c4c2' }}>
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#f9c8c2' }} />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-xs" style={{ borderColor: '#7d8c82', color: '#96aca0' }}>
          © {new Date().getFullYear()} Geranium Cleaning Services. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
