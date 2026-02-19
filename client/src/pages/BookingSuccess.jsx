import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, Calendar, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

export default function BookingSuccess() {
  const location = useLocation()
  const booking = location.state?.booking

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f6' }}>
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #96aca0, #7d9094)' }}>
              <CheckCircle size={48} color="white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#60665a' }}>Booking Confirmed!</h1>
          <p className="mb-8" style={{ color: '#7d9094' }}>
            Thank you! Your cleaning has been booked. A confirmation email has been sent to{' '}
            <strong>{booking?.email || 'your inbox'}</strong>.
          </p>

          {booking && (
            <div className="card text-left mb-6 shadow-xl">
              <h3 className="font-bold mb-4" style={{ color: '#60665a' }}>Booking Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b" style={{ borderColor: '#f0e8e6' }}>
                  <span style={{ color: '#96aca0' }}>Booking ID</span>
                  <span className="font-mono font-medium" style={{ color: '#60665a' }}>#{booking.id?.slice(-8).toUpperCase() || 'GCS-0001'}</span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: '#f0e8e6' }}>
                  <span style={{ color: '#96aca0' }}>Client</span>
                  <span className="font-medium" style={{ color: '#60665a' }}>{booking.name}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b" style={{ borderColor: '#f0e8e6' }}>
                  <span className="flex items-center gap-1" style={{ color: '#96aca0' }}>
                    <Calendar size={14} />Date & Time
                  </span>
                  <span className="font-medium text-right" style={{ color: '#60665a' }}>
                    {booking.date ? new Date(booking.date).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    {booking.timeSlot && ` · ${booking.timeSlot}`}
                  </span>
                </div>
                <div className="flex items-start justify-between py-2 border-b" style={{ borderColor: '#f0e8e6' }}>
                  <span className="flex items-center gap-1" style={{ color: '#96aca0' }}>
                    <MapPin size={14} />Location
                  </span>
                  <span className="font-medium text-right" style={{ color: '#60665a' }}>
                    {booking.area}, {booking.county}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: '#f0e8e6' }}>
                  <span style={{ color: '#96aca0' }}>Seats</span>
                  <span className="font-medium" style={{ color: '#60665a' }}>{booking.seatCount} × {booking.seatType}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold" style={{ color: '#60665a' }}>Amount Paid</span>
                  <span className="font-bold text-lg" style={{ color: '#c69491' }}>KSh {booking.total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl mb-8 text-sm" style={{ backgroundColor: '#f9c8c2' }}>
            <p style={{ color: '#60665a' }}>
              🌸 Our cleaner will contact you before arrival.
              For questions, call <a href="tel:+254726390610" className="font-semibold underline">+254 726 390610</a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <button className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
                <ArrowLeft size={16} /> Back to Home
              </button>
            </Link>
            <Link to="/book">
              <button className="btn-primary w-full sm:w-auto">Book Another</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
