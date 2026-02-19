import { useState } from 'react'
import { CheckCircle, XCircle, Clock, MapPin, Calendar, Phone, Mail, ChevronDown, ChevronUp, User } from 'lucide-react'

const STATUS_ICONS = {
  pending: <Clock size={14} />,
  accepted: <CheckCircle size={14} />,
  completed: <CheckCircle size={14} />,
  declined: <XCircle size={14} />,
}

export default function BookingCard({ booking: b, onStatusChange, statusColor, expanded = false }) {
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const sc = statusColor(b.bookingStatus)

  const handleStatus = async (status) => {
    setUpdating(true)
    await onStatusChange(b.id, status)
    setUpdating(false)
  }

  const dateStr = b.date
    ? new Date(b.date).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
    : '—'

  return (
    <div className="card p-4 sm:p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
            {b.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm" style={{ color: '#60665a' }}>{b.name}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                {STATUS_ICONS[b.bookingStatus]}
                {b.bookingStatus}
              </span>
              {b.paymentStatus === 'paid' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#eef4f0', color: '#3d6b4a' }}>paid</span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ color: '#96aca0' }}>
              <span className="flex items-center gap-1"><Calendar size={11} />{dateStr} {b.timeSlot && `· ${b.timeSlot}`}</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{b.area}, {b.county}</span>
              <span>{b.seatCount} seat{b.seatCount > 1 ? 's' : ''} · KSh {b.total}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick actions for pending */}
          {b.bookingStatus === 'pending' && (
            <div className="hidden sm:flex gap-2">
              <button onClick={() => handleStatus('accepted')} disabled={updating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ backgroundColor: '#f0f4f2', color: '#60665a', border: 'none', cursor: 'pointer' }}>
                <CheckCircle size={13} /> Accept
              </button>
              <button onClick={() => handleStatus('declined')} disabled={updating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ backgroundColor: '#fef2f2', color: '#e57373', border: 'none', cursor: 'pointer' }}>
                <XCircle size={13} /> Decline
              </button>
            </div>
          )}
          {b.bookingStatus === 'accepted' && (
            <button onClick={() => handleStatus('completed')} disabled={updating}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: '#eef4f0', color: '#3d6b4a', border: 'none', cursor: 'pointer' }}>
              <CheckCircle size={13} /> Mark Done
            </button>
          )}
          <button onClick={() => setOpen(!open)}
            className="p-1.5 rounded-lg transition-all"
            style={{ backgroundColor: '#f5f0ef', color: '#60665a', border: 'none', cursor: 'pointer' }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {open && (
        <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: '#f0e8e6' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <Mail size={14} style={{ color: '#96aca0' }} />
              <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <Phone size={14} style={{ color: '#96aca0' }} />
              <a href={`tel:${b.phone}`} className="hover:underline">{b.phone}</a>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <MapPin size={14} style={{ color: '#96aca0' }} />
              {b.address}, {b.area}
            </div>
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <User size={14} style={{ color: '#96aca0' }} />
              {b.seatType} · {b.seatCount} seat{b.seatCount > 1 ? 's' : ''}
            </div>
          </div>

          {b.notes && (
            <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef5f3', color: '#60665a' }}>
              <span style={{ color: '#96aca0' }}>Notes: </span>{b.notes}
            </div>
          )}

          {b.paymentMethod === 'mpesa' && b.mpesaReceiptNumber && (
            <div className="text-xs" style={{ color: '#96aca0' }}>
              M-Pesa Receipt: <span className="font-mono font-medium" style={{ color: '#60665a' }}>{b.mpesaReceiptNumber}</span>
            </div>
          )}

          {/* Mobile actions */}
          <div className="flex gap-2 sm:hidden flex-wrap">
            {b.bookingStatus === 'pending' && (
              <>
                <button onClick={() => handleStatus('accepted')} disabled={updating}
                  className="flex-1 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#f0f4f2', color: '#60665a', border: 'none', cursor: 'pointer' }}>
                  ✓ Accept
                </button>
                <button onClick={() => handleStatus('declined')} disabled={updating}
                  className="flex-1 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#fef2f2', color: '#e57373', border: 'none', cursor: 'pointer' }}>
                  ✗ Decline
                </button>
              </>
            )}
            {b.bookingStatus === 'accepted' && (
              <button onClick={() => handleStatus('completed')} disabled={updating}
                className="flex-1 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#eef4f0', color: '#3d6b4a', border: 'none', cursor: 'pointer' }}>
                ✓ Mark Complete
              </button>
            )}
          </div>

          <div className="text-xs" style={{ color: '#b8b0ae' }}>
            Booked: {new Date(b.createdAt).toLocaleString('en-KE')} · ID: #{b.id?.slice(-8).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  )
}
