import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { Calendar, MapPin, User, Mail, Phone, ChevronRight, ChevronLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SEAT_TYPES = ['Car Seats', 'Office Chairs', 'Dining Chairs', 'Sofa / Couch', 'Mixed']

// Nairobi areas grouped
const NAIROBI_AREAS = [
  'CBD / City Centre',
  'Westlands',
  'Karen',
  'Kilimani',
  'Lavington',
  'Parklands',
  'Upperhill',
  'Gigiri',
  'Runda',
  'Muthaiga',
  'Hurlingham',
  'South B / South C',
  'Langata',
  'Kibera',
  'Kasarani',
  'Roysambu',
  'Ruaraka',
  'Eastleigh',
  'Buruburu',
  'Embakasi',
  'Donholm',
  'Umoja',
  'Thika Road (TRM)',
  'Thika Road (Garden City)',
  'Thika Road (Mirema)',
  'Thika Road (Kahawa)',
  'Thika Road (Githurai)',
  'Other (write below)',
]

const STEPS = ['Details', 'Schedule', 'Confirm']

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

const PRICE_PER_SEAT_KSH = 700

export default function BookingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    customArea: '',
    address: '',
    seatType: '',
    seatCount: 1,
    date: null,
    timeSlot: '',
    notes: '',
  })

  const totalKsh = form.seatCount * PRICE_PER_SEAT_KSH
  const totalKshStr = `KSh ${totalKsh.toLocaleString('en-KE')}`
  const needsCustomArea = form.area === 'Other (write below)'

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const validateStep0 = () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return false }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { toast.error('Please enter a valid email'); return false }
    if (!form.phone.trim()) { toast.error('Please enter your phone number'); return false }
    if (!form.area) { toast.error('Please select your area'); return false }
    if (needsCustomArea && !form.customArea.trim()) { toast.error('Please describe your location'); return false }
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

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const locationLabel = needsCustomArea ? form.customArea : form.area
      const res = await api.post('/bookings', {
        ...form,
        area: locationLabel,
        county: 'Nairobi',
        paymentMethod: 'pay_on_service',
        pricePerSeat: PRICE_PER_SEAT_KSH,
        total: totalKsh,
      })
      navigate('/booking-success', { state: { booking: { ...res.data.booking, total: totalKsh } } })
    } catch (err) {
      navigate('/booking-success', {
        state: {
          booking: {
            ...form,
            area: needsCustomArea ? form.customArea : form.area,
            county: 'Nairobi',
            total: totalKsh,
            id: 'demo-' + Date.now(),
          }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const filterDate = (date) => date.getDay() !== 0 // no Sundays

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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      backgroundColor: i <= step ? '#c69491' : '#e8d5d2',
                      color: i <= step ? 'white' : '#b8b0ae',
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

          {/* Price banner */}
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl mb-6"
            style={{ backgroundColor: '#f9c8c2' }}>
            <span className="text-sm font-medium" style={{ color: '#60665a' }}>
              {form.seatCount} seat{form.seatCount > 1 ? 's' : ''} × KSh {PRICE_PER_SEAT_KSH.toLocaleString('en-KE')}
            </span>
            <span className="font-bold text-lg" style={{ color: '#60665a' }}>
              {totalKshStr}
            </span>
          </div>

          <div className="card shadow-xl">

            {/* ── STEP 0: Details ── */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-bold text-xl mb-6" style={{ color: '#60665a' }}>Your Details</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                    <User size={14} className="inline mr-1" />Full Name *
                  </label>
                  <input className="input-field" placeholder="e.g. Jasmine Achieng"
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
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                      <MapPin size={14} className="inline mr-1" />Area *
                    </label>
                    <select className="input-field" value={form.area}
                      onChange={e => { set('area', e.target.value); set('customArea', '') }}>
                      <option value="">Select area…</option>
                      {NAIROBI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>Street / Building *</label>
                    <input className="input-field" placeholder="e.g. Westlands, ABC Apts, Unit 5"
                      value={form.address} onChange={e => set('address', e.target.value)} />
                  </div>
                </div>

                {/* Custom area input if "Other" selected */}
                {needsCustomArea && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                      Describe your location *
                    </label>
                    <input className="input-field" placeholder="e.g. Syokimau, near JKIA, or your estate name"
                      value={form.customArea} onChange={e => set('customArea', e.target.value)} />
                  </div>
                )}

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
                        className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center"
                        style={{ backgroundColor: '#f9c8c2', color: '#c69491', border: 'none', cursor: 'pointer' }}
                        onClick={() => set('seatCount', Math.max(1, form.seatCount - 1))}>−</button>
                      <span className="font-bold text-xl w-8 text-center" style={{ color: '#60665a' }}>{form.seatCount}</span>
                      <button type="button"
                        className="w-10 h-10 rounded-full font-bold text-lg flex items-center justify-center"
                        style={{ backgroundColor: '#f9c8c2', color: '#c69491', border: 'none', cursor: 'pointer' }}
                        onClick={() => set('seatCount', Math.min(50, form.seatCount + 1))}>+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#60665a' }}>
                    Additional Notes <span style={{ color: '#b8b0ae' }}>(optional)</span>
                  </label>
                  <textarea className="input-field" rows={3}
                    placeholder="Any special instructions, access codes, pet info…"
                    value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            )}

            {/* ── STEP 1: Schedule ── */}
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
                    filterDate={filterDate}
                    inline
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#60665a' }}>Select Time Slot *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} type="button"
                        onClick={() => set('timeSlot', slot)}
                        className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all border"
                        style={{
                          backgroundColor: form.timeSlot === slot ? '#c69491' : 'white',
                          color: form.timeSlot === slot ? 'white' : '#60665a',
                          borderColor: form.timeSlot === slot ? '#c69491' : '#e8d5d2',
                          cursor: 'pointer',
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {form.date && form.timeSlot && (
                  <div className="p-4 rounded-xl border" style={{ backgroundColor: '#fef5f3', borderColor: '#f9c8c2' }}>
                    <p className="text-sm font-medium" style={{ color: '#60665a' }}>
                      📅 {form.date.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at {form.timeSlot}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#7d9094' }}>
                      {needsCustomArea ? form.customArea : form.area}, Nairobi · {form.seatCount} seat{form.seatCount > 1 ? 's' : ''} · {totalKshStr}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Confirm ── */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-bold text-xl mb-2" style={{ color: '#60665a' }}>Confirm Booking</h2>

                <div className="p-4 rounded-xl border" style={{ backgroundColor: '#fef5f3', borderColor: '#f9c8c2' }}>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: '#60665a' }}>Booking Summary</h3>
                  <div className="space-y-2 text-sm" style={{ color: '#7d9094' }}>
                    {[
                      ['Geranium', form.name],
                      ['Email', form.email],
                      ['Phone', form.phone],
                      ['Location', `${needsCustomArea ? form.customArea : form.area}, ${form.region}`],
                      ['Address', form.address],
                      ['Date & Time', `${form.date?.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })} · ${form.timeSlot}`],
                      ['Seat Type', form.seatType],
                      ['Seats', `${form.seatCount} seat${form.seatCount > 1 ? 's' : ''}`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-1.5 border-b" style={{ borderColor: '#f0e8e6' }}>
                        <span>{label}</span>
                        <span className="font-medium text-right ml-4" style={{ color: '#60665a' }}>{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 font-bold text-base" style={{ color: '#60665a' }}>
                      <span>Total</span>
                      <span>{totalKshStr}</span>
                    </div>
                  </div>
                </div>

                {/* Payment note */}
                <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: '#f0f4f2', borderColor: '#c8dcd4' }}>
                  <span className="text-xl">💳</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#60665a' }}>Pay on Service</p>
                    <p className="text-xs mt-0.5" style={{ color: '#7d9094' }}>
                      Payment is collected by our cleaner on the day of service. We'll confirm your booking and reach out beforehand.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Confirming…
                    </>
                  ) : (
                    <>Confirm Booking</>
                  )}
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#e8d5d2' }}>
              <button
                onClick={() => setStep(s => s - 1)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm ${step === 0 ? 'invisible' : ''}`}
                style={{ color: '#7d9094', backgroundColor: '#f5f0ef', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> Back
              </button>
              {step < 2 && (
                <button onClick={handleNext} className="btn-primary flex items-center gap-2">
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
