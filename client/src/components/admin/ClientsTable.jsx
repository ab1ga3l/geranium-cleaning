import { useState } from 'react'
import { Search, Phone, Mail, MapPin } from 'lucide-react'

export default function ClientsTable({ clients }) {
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) || c.area?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl" style={{ color: '#60665a' }}>Client Management</h2>
          <p className="text-sm mt-1" style={{ color: '#96aca0' }}>{clients.length} unique clients</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#96aca0' }} />
        <input className="input-field pl-9" placeholder="Search clients…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#fef5f3', borderBottom: '1.5px solid #e8d5d2' }}>
                {['Client', 'Contact', 'Location', 'Bookings', 'Total Spent', 'Last Booking'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: '#60665a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.email}
                  className="border-b transition-colors hover:bg-pink-50/30"
                  style={{ borderColor: '#f0e8e6' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                        {c.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium" style={{ color: '#60665a' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#7d9094' }}>
                        <Mail size={12} />
                        <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#7d9094' }}>
                          <Phone size={12} />
                          <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#7d9094' }}>
                      <MapPin size={12} />
                      {c.area && `${c.area}, `}{c.county}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                      {c.bookings}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#60665a' }}>
                    KSh {c.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#96aca0' }}>
                    {c.lastBooking
                      ? new Date(c.lastBooking).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: '#96aca0' }}>
              <p className="font-medium">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
