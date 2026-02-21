import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const STATUS_COLORS = {
  pending: '#f0a040',
  accepted: '#96aca0',
  completed: '#3d6b4a',
  declined: '#e57373',
}

const MIN_YEAR = 2024
const MAX_YEAR = new Date().getFullYear() + 2

// Parse date string as local date (avoid UTC offset shifting day)
function parseLocalDate(dateStr) {
  if (!dateStr) return null
  try {
    const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number)
    return new Date(y, m - 1, d)
  } catch { return null }
}

export default function CalendarView({ bookings, statusColor }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1)
    if (prev.getFullYear() >= MIN_YEAR) setViewDate(prev)
  }
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1)
    if (next.getFullYear() <= MAX_YEAR) setViewDate(next)
  }

  // Group bookings by day number (local date)
  const bookingsByDate = {}
  bookings.forEach(b => {
    if (!b.date) return
    const d = parseLocalDate(b.date)
    if (!d) return
    if (d.getMonth() === month && d.getFullYear() === year) {
      const key = d.getDate()
      if (!bookingsByDate[key]) bookingsByDate[key] = []
      bookingsByDate[key].push(b)
    }
  })

  const selectedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : []

  // Only show legend statuses that appear this month
  const monthStatuses = new Set(
    Object.values(bookingsByDate).flat().map(b => b.bookingStatus).filter(Boolean)
  )

  const fullSelectedDate = selectedDate
    ? (() => {
        const d = new Date(year, month, selectedDate)
        return `${DAY_NAMES[d.getDay()]}, ${MONTHS[month]} ${selectedDate}, ${year}`
      })()
    : null

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-xl" style={{ color: '#60665a' }}>Calendar View</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 card">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth}
              className="p-2 rounded-xl transition-colors hover:bg-pink-50"
              style={{ color: '#60665a', background: 'none', border: 'none', cursor: 'pointer' }}>
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-lg" style={{ color: '#60665a' }}>
              {MONTHS[month]} {year}
            </h3>
            <button onClick={nextMonth}
              className="p-2 rounded-xl transition-colors hover:bg-pink-50"
              style={{ color: '#60665a', background: 'none', border: 'none', cursor: 'pointer' }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: '#96aca0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayBookings = bookingsByDate[day] || []
              const hasBookings = dayBookings.length > 0
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = day === selectedDate

              return (
                <button key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className="relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all"
                  style={{
                    backgroundColor: isSelected ? '#c69491' : isToday ? '#f9c8c2' : 'transparent',
                    color: isSelected ? 'white' : '#60665a',
                    fontWeight: isToday || isSelected ? '700' : '400',
                    border: isToday && !isSelected ? '2px solid #c69491' : '2px solid transparent',
                    cursor: 'pointer',
                  }}>
                  {day}
                  {hasBookings && (
                    <div className="flex gap-0.5 mt-0.5 items-center">
                      {dayBookings.slice(0, 3).map((b, bi) => (
                        <div key={bi} className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: isSelected ? 'white' : (STATUS_COLORS[b.bookingStatus] || '#c69491')
                          }} />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-[8px] font-bold ml-0.5"
                          style={{ color: isSelected ? 'white' : '#96aca0' }}>
                          +{dayBookings.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend — only show statuses present this month */}
          {monthStatuses.size > 0 && (
            <div className="mt-4 flex gap-4 flex-wrap pt-4 border-t" style={{ borderColor: '#f0e8e6' }}>
              {Object.entries(STATUS_COLORS)
                .filter(([label]) => monthStatuses.has(label))
                .map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: '#7d9094' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Selected date bookings */}
        <div>
          <h3 className="font-semibold mb-3 text-sm" style={{ color: '#60665a' }}>
            {fullSelectedDate
              ? `${fullSelectedDate} — ${selectedBookings.length} booking${selectedBookings.length !== 1 ? 's' : ''}`
              : 'Click a date to see bookings'}
          </h3>

          <div className="space-y-3">
            {selectedBookings.length === 0 && selectedDate && (
              <div className="card text-center py-8" style={{ color: '#96aca0' }}>
                <p className="text-sm">No bookings on this date</p>
              </div>
            )}

            {selectedBookings.map(b => {
              const sc = statusColor(b.bookingStatus)
              return (
                <div key={b.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#60665a' }}>{b.name}</p>
                      <p className="text-xs" style={{ color: '#96aca0' }}>{b.timeSlot} · {b.area}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border"
                      style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#7d9094' }}>
                    {b.seatCount} {b.seatType} · KSh {Number(b.total || 0).toLocaleString('en-KE')}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
