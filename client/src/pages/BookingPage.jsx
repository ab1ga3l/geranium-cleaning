import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Calendar, MapPin, User, Mail, Phone, ChevronRight, ChevronLeft, CreditCard, Smartphone } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StripePayment from '../components/booking/StripePayment'

const SEAT_TYPES = ['Car Seats', 'Office Chairs', 'Dining Chairs', 'Sofa / Couch', 'Mixed']
const NAIROBI_AREAS = ['Westlands', 'Karen', 'Kilimani', 'Lavington', 'Parklands', 'Upperhill', 'CBD', 'Gigiri', 'Runda', 'Muthaiga']
const KIAMBU_AREAS = ['Kiambu Town', 'Ruiru', 'Thika', 'Kikuyu', 'Limuru', 'Githunguri', 'Karuri', 'Juja']

const STEPS = ['Details', 'Schedule', 'Payment']

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

export default function BookingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    county: 'Nairobi',
    area: '',
    address: '',
    seatType: '',
    seatCount: 1,
    date: null,
    timeSlot: '',
    notes: '',
    mpesaPhone: '',
  })

  const pricePerSeat = 5.40
  const total = (form.seatCount * pricePerSeat).toFixed(2)

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const areaOptions = form.county === 'Nairobi' ? NAIROBI_AREAS : KIAMBU_AREAS

  const validateStep0 = () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return false }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { toast.error('Please enter a valid email'); return false }
    if (!form.phone.trim()) { toast.error('Please enter your phone number'); return false }
    if (!form.area) { toast.error('Please select your area'); return false }
    if (!form.address.trim()) { toast.error('Please enter your address'); return false }
    if (!form.seatType) { toast.error('Please select seat type'); return false }
    return true
  }

  const validateStep1 = () => {
    if (!form.date) { toast.error('Please select a date'); return false }
    if (!form.timeSlot) { toast.error('Please select a time slot'); return false }
    return true
  }

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    setStep(s => s + 1)
  }

  const handleMpesaPay = async () => {
    if (!form.mpesaPhone.trim()) { toast.error('Enter M-Pesa phone number'); return }
    setLoading(true)
    try {
      const res = await axios.post('/api/bookings', {
        ...form,
        paymentMethod: 'mpesa',
        total,
      })
      setBookingId(res.data.bookingId)
      // Trigger STK push
      await axios.post('/api/payments/mpesa/stk-push', {
        bookingId: res.data.bookingId,
        phone: form.mpesaPhone,
        amount: total,
      })
      toast.success('M-Pesa prompt sent! Check your phone.')
      // Poll for payment status
      pollMpesaStatus(res.data.bookingId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  const pollMpesaStatus = async (id) => {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await axios.get(`/api/bookings/${id}/payment-status`)
        if (res.data.status === 'paid') {
          clearInterval(interval)
          setLoading(false)
          navigate('/booking-success', { state: { booking: res.data.booking } })
        } else if (res.data.status === 'failed' || attempts >= 12) {
          clearInterval(interval)
          setLoading(false)
          if (attempts >= 12) toast.error('Payment timed out. Please try again.')
          else toast.error('Payment failed. Please try again.')
        }
      } catch { /* keep polling */ }
    }, 5000)
  }

  const handleStripeSuccess = (booking) => {
    navigate('/booking-success', { state: { booking } })
  }

  const isWeekend = (date) => {
    const day = date.getDay()
    return day !== 0 // allow all days except Sunday
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f6' }}>
      <Navbar />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 pt-8">
            <h1 className="section-title mb-2">Book Your Cleaning</h1>
            <p className="section-subtitle">Professional service delivered to your door</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i <= step
                      ? 'text-white shadow-md'
                      : 'text-gray-400'
                  }`} style={{
                    backgroundColor: i <= step ? '#c69491' : '#e8d5d2',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs mt-1 font-medium" style={{ color: i <= step ? '#c69491' : '#b8b0ae' }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-all"
                    style={{ backgroundColor: i < step ? '#c69491' : '#e8d5d2' }} />
                )}
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl mb-6"
            style={{ backgroundColor: '#f9c8c2' }}>
            <span className="text-sm font-medium" style={{ color: '#60665a' }}>
              {form.seatCount} seat{form.seatCount > 1 ? 's' : ''} × KSh 5.40
            </span>
            <span className="font-bold text-lg" style={{ color: '#60665a' }}>Total: KSh {total}</span>
          </div>

          <div className="card shadow-xl">
            {/* STEP 0: Details */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-bold text-xl mb-6" style={{ color: '#60665a' }}>Your Details</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                    <User size={14} className="inline mr-1" />Full Name *
                  </label>
                  <input className="input-field" placeholder="e.g. Amara Ndichu"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                      <Mail size={14} className="inline mr-1" />Email *
                    </label>
                    <input className="input-field" type="email" placeholder="you@example.com"
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                      <Phone size={14} className="inline mr-1" />Phone *
                    </label>
                    <input className="input-field" placeholder="+254 7XX XXX XXX"
                      value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>County *</label>
                    <select className="input-field" value={form.county}
                      onChange={e => { set('county', e.target.value); set('area', '') }}>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Kiambu">Kiambu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                      <MapPin size={14} className="inline mr-1" />Area *
                    </label>
                    <select className="input-field" value={form.area} onChange={e => set('area', e.target.value)}>
                      <option value="">Select area…</option>
                      {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>Street / Building Address *</label>
                  <input className="input-field" placeholder="e.g. Westlands, ABC Apartments, Unit 5"
                    value={form.address} onChange={e => set('address', e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>Seat Type *</label>
                    <select className="input-field" value={form.seatType} onChange={e => set('seatType', e.target.value)}>
                      <option value="">Select type…</option>
                      {SEAT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>Number of Seats *</label>
                    <div className="flex items-center gap-3">
                      <button type="button"
                        className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}
                        onClick={() => set('seatCount', Math.max(1, form.seatCount - 1))}>−</button>
                      <span className="font-bold text-xl w-8 text-center" style={{ color: '#60665a' }}>{form.seatCount}</span>
                      <button type="button"
                        className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}
                        onClick={() => set('seatCount', Math.min(50, form.seatCount + 1))}>+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                    Additional Notes <span style={{ color: '#b8b0ae' }}>(optional)</span>
                  </label>
                  <textarea className="input-field" rows={3}
                    placeholder="Any special instructions, access codes, pet information…"
                    value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            )}

            {/* STEP 1: Schedule */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-bold text-xl mb-6" style={{ color: '#60665a' }}>Schedule Your Visit</h2>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#60665a' }}>
                    <Calendar size={14} className="inline mr-1" />Select Date *
                  </label>
                  <DatePicker
                    selected={form.date}
                    onChange={date => set('date', date)}
                    minDate={new Date()}
                    filterDate={isWeekend}
                    inline
                    calendarClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#60665a' }}>Select Time Slot *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} type="button"
                        onClick={() => set('timeSlot', slot)}
                        className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all border"
                        style={{
                          backgroundColor: form.timeSlot === slot ? '#c69491' : 'white',
                          color: form.timeSlot === slot ? 'white' : '#60665a',
                          borderColor: form.timeSlot === slot ? '#c69491' : '#e8d5d2',
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {form.date && form.timeSlot && (
                  <div className="p-4 rounded-xl border" style={{ backgroundColor: '#fef5f3', borderColor: '#f9c8c2' }}>
                    <p className="text-sm font-medium" style={{ color: '#60665a' }}>
                      📅 {form.date.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {' '}at {form.timeSlot}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#7d9094' }}>
                      {form.area}, {form.county} · {form.seatCount} seat{form.seatCount > 1 ? 's' : ''} · KSh {total}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-bold text-xl mb-2" style={{ color: '#60665a' }}>Payment</h2>

                {/* Order Summary */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: '#fef5f3', borderColor: '#f9c8c2' }}>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: '#60665a' }}>Order Summary</h3>
                  <div className="space-y-1.5 text-sm" style={{ color: '#7d9094' }}>
                    <div className="flex justify-between"><span>Client</span><span className="font-medium" style={{ color: '#60665a' }}>{form.name}</span></div>
                    <div className="flex justify-between"><span>Location</span><span className="font-medium" style={{ color: '#60665a' }}>{form.area}, {form.county}</span></div>
                    <div className="flex justify-between"><span>Date & Time</span><span className="font-medium" style={{ color: '#60665a' }}>{form.date?.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })} · {form.timeSlot}</span></div>
                    <div className="flex justify-between"><span>Seats</span><span className="font-medium" style={{ color: '#60665a' }}>{form.seatCount} × KSh 5.40</span></div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base" style={{ borderColor: '#e8d5d2', color: '#60665a' }}>
                      <span>Total</span><span>KSh {total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment method selector */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#60665a' }}>Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setPaymentMethod('mpesa')}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: paymentMethod === 'mpesa' ? '#c69491' : '#e8d5d2',
                        backgroundColor: paymentMethod === 'mpesa' ? '#fef5f3' : 'white',
                      }}>
                      <Smartphone size={20} style={{ color: paymentMethod === 'mpesa' ? '#c69491' : '#96aca0' }} />
                      <div className="text-left">
                        <p className="font-semibold text-sm" style={{ color: '#60665a' }}>M-Pesa</p>
                        <p className="text-xs" style={{ color: '#96aca0' }}>Mobile money</p>
                      </div>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('card')}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: paymentMethod === 'card' ? '#c69491' : '#e8d5d2',
                        backgroundColor: paymentMethod === 'card' ? '#fef5f3' : 'white',
                      }}>
                      <CreditCard size={20} style={{ color: paymentMethod === 'card' ? '#c69491' : '#96aca0' }} />
                      <div className="text-left">
                        <p className="font-semibold text-sm" style={{ color: '#60665a' }}>Card</p>
                        <p className="text-xs" style={{ color: '#96aca0' }}>Visa / Mastercard</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* M-Pesa */}
                {paymentMethod === 'mpesa' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                      M-Pesa Phone Number *
                    </label>
                    <input className="input-field" placeholder="e.g. 0712345678 or 254712345678"
                      value={form.mpesaPhone} onChange={e => set('mpesaPhone', e.target.value)} />
                    <p className="text-xs mt-2" style={{ color: '#96aca0' }}>
                      You will receive an M-Pesa STK push prompt on this number.
                    </p>
                    <button
                      onClick={handleMpesaPay}
                      disabled={loading}
                      className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Waiting for payment…
                        </>
                      ) : (
                        <>Pay KSh {total} via M-Pesa</>
                      )}
                    </button>
                  </div>
                )}

                {/* Stripe Card */}
                {paymentMethod === 'card' && (
                  <StripePayment
                    formData={form}
                    total={total}
                    onSuccess={handleStripeSuccess}
                  />
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#e8d5d2' }}>
              <button
                onClick={() => setStep(s => s - 1)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${step === 0 ? 'invisible' : ''}`}
                style={{ color: '#7d9094', backgroundColor: '#f5f0ef', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> Back
              </button>
              {step < 2 && (
                <button onClick={handleNext}
                  className="btn-primary flex items-center gap-2">
                  Continue <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
