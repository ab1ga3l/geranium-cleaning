import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Flower } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { hash: '#services', label: 'Services' },
    { hash: '#how-it-works', label: 'How It Works' },
    { hash: '#pricing', label: 'Pricing' },
    { hash: '#contact', label: 'Contact' },
  ]

  const scrollTo = (hash) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      window.location.href = '/' + hash
      return
    }
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f9c8c2' }}>
              <Flower size={18} style={{ color: '#c69491' }} />
            </div>
            <div>
              <span className="font-bold text-lg" style={{ color: '#60665a' }}>Geranium</span>
              <span className="font-light text-lg ml-1" style={{ color: '#c69491' }}>Cleaning</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.hash)}
                className="text-sm font-medium transition-colors hover:text-rose-400"
                style={{ color: '#7d9094', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
              </button>
            ))}
            <Link to="/book">
              <button className="btn-primary text-sm px-5 py-2.5">Book Now</button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#7d9094' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.hash)}
              className="text-left text-sm font-medium py-2"
              style={{ color: '#7d9094', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {link.label}
            </button>
          ))}
          <Link to="/book" onClick={() => setMenuOpen(false)}>
            <button className="btn-primary w-full text-sm">Book Now</button>
          </Link>
        </div>
      )}
    </nav>
  )
}
