import { useState } from 'react'
import { CheckCircle, XCircle, Clock, MapPin, Calendar, Phone, Mail, ChevronDown, ChevronUp, User, Copy } from 'lucide-react'

const STATUS_ICONS = {
  pending: <Clock size={14} />,
  accepted: <CheckCircle size={14} />,
  completed: <CheckCircle size={14} />,
  declined: <XCircle size={14} />,
}

const PAYMENT_STYLES = {
  paid: { bg: '#eef4f0', color: '#3d6b4a', label: 'paid' },
  pending: { bg: '#fef9ec', color: '#b07d1a', label: 'unpaid' },
  failed: { bg: '#fef2f2', color: '#e57373', label: 'failed' },
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {})
}

export default function BookingCard({ booking: b, onStatusChange, statusColor, expanded = false, selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showFullNotes, setShowFullNotes] = useState(false)
  const sc = statusColor(b.bookingStatus)

  const handleStatus = async (status) => {
    setUpdating(true)
    try {
      await onStatusChange(b.id, status, b.name)
    } finally {
      setUpdating(false)
    }
  }

  const dateStr = b.date
    ? (() => {
        try {
          // Parse as local date to avoid UTC offset issues
          const [y, m, d] = (b.date.slice(0, 10)).split('-').map(Number)
          return new Date(y, m - 1, d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
        } catch { return b.date }
      })()
    : '—'

  const createdStr = b.createdAt
    ? (() => {
        try { return new Date(b.createdAt).toLocaleString('en-KE') }
        catch { return '—' }
      })()
    : '—'

  const paymentStyle = PAYMENT_STYLES[b.paymentStatus] || PAYMENT_STYLES.pending
  const notesLong = b.notes && b.notes.length > 120
  const notesDisplay = notesLong && !showFullNotes ? b.notes.slice(0, 120) + '…' : b.notes

  return (
    <div className="card p-4 sm:p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox for bulk select */}
        {onSelect && (
          <input type="checkbox" checked={!!selected} onChange={onSelect}
            className="mt-1 flex-shrink-0" style={{ accentColor: '#c69491' }} />
        )}

        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
            {b.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm" style={{ color: '#60665a' }}>{b.name || '—'}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                {STATUS_ICONS[b.bookingStatus]}
                {b.bookingStatus}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: paymentStyle.bg, color: paymentStyle.color }}>
                {paymentStyle.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ color: '#96aca0' }}>
              <span className="flex items-center gap-1"><Calendar size={11} />{dateStr} {b.timeSlot && `· ${b.timeSlot}`}</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{b.area}{b.county ? `, ${b.county}` : ''}</span>
              <span>{b.seatCount} seat{b.seatCount > 1 ? 's' : ''} · KSh {Number(b.total || 0).toLocaleString('en-KE')}</span>
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
              <a href={`mailto:${b.email}`} className="hover:underline truncate">{b.email}</a>
              {b.email && (
                <button onClick={() => copyToClipboard(b.email)} title="Copy email"
                  style={{ color: '#96aca0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Copy size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <Phone size={14} style={{ color: '#96aca0' }} />
              <a href={`tel:${b.phone}`} className="hover:underline">{b.phone}</a>
              {b.phone && (
                <button onClick={() => copyToClipboard(b.phone)} title="Copy phone"
                  style={{ color: '#96aca0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Copy size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <MapPin size={14} style={{ color: '#96aca0' }} />
              {[b.address, b.area].filter(Boolean).join(', ')}
            </div>
            <div className="flex items-center gap-2" style={{ color: '#60665a' }}>
              <User size={14} style={{ color: '#96aca0' }} />
              {b.seatType || 'N/A'} · {b.seatCount} seat{b.seatCount > 1 ? 's' : ''}
            </div>
          </div>

          {b.notes && (
            <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef5f3', color: '#60665a' }}>
              <span style={{ color: '#96aca0' }}>Notes: </span>{notesDisplay}
              {notesLong && (
                <button onClick={() => setShowFullNotes(!showFullNotes)}
                  className="ml-1 font-medium" style={{ color: '#c69491', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showFullNotes ? 'show less' : 'show more'}
                </button>
              )}
            </div>
          )}

          {b.paymentMethod === 'mpesa' && b.mpesaReceiptNumber && (
            <div className="flex items-center gap-2 text-xs" style={{ color: '#96aca0' }}>
              M-Pesa Receipt:
              <span className="font-mono font-medium" style={{ color: '#60665a' }}>{b.mpesaReceiptNumber}</span>
              <button onClick={() => copyToClipboard(b.mpesaReceiptNumber)} title="Copy receipt"
                style={{ color: '#96aca0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Copy size={11} />
              </button>
            </div>
          )}

          {/* Mobile actions */}
          <div className="flex gap-2 sm:hidden flex-wrap">
            {b.bookingStatus === 'pending' && (
              <>
                <button onClick={() => handleStatus('accepted')} disabled={updating}
                  className="flex-1 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#f0f4f2', color: '#60665a', border: 'none', cursor: 'pointer' }}>
                  Accept
                </button>
                <button onClick={() => handleStatus('declined')} disabled={updating}
                  className="flex-1 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#fef2f2', color: '#e57373', border: 'none', cursor: 'pointer' }}>
                  Decline
                </button>
              </>
            )}
            {b.bookingStatus === 'accepted' && (
              <button onClick={() => handleStatus('completed')} disabled={updating}
                className="flex-1 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#eef4f0', color: '#3d6b4a', border: 'none', cursor: 'pointer' }}>
                Mark Complete
              </button>
            )}
          </div>

          <div className="text-xs" style={{ color: '#b8b0ae' }}>
            Booked: {createdStr} · ID: #{b.id?.slice(-8).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  )
}
