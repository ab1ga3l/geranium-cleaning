import { useState } from 'react'
import { Search, Phone, Mail, MapPin, ChevronUp, ChevronDown } from 'lucide-react'

const PAGE_SIZE = 20

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <span style={{ color: '#ccc', fontSize: 10 }}>↕</span>
  return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
}

export default function ClientsTable({ clients }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('lastBooking')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.area?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
  })

  const sorted = [...filtered].sort((a, b) => {
    let va, vb
    if (sortBy === 'name') { va = a.name || ''; vb = b.name || '' }
    else if (sortBy === 'bookings') { va = a.bookings || 0; vb = b.bookings || 0 }
    else if (sortBy === 'totalSpent') { va = a.totalSpent || 0; vb = b.totalSpent || 0 }
    else { va = a.lastBooking ? new Date(a.lastBooking).getTime() : 0; vb = b.lastBooking ? new Date(b.lastBooking).getTime() : 0 }
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return sortDir === 'asc' ? va - vb : vb - va
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
    setPage(1)
  }

  const thStyle = { color: '#60665a', cursor: 'pointer', userSelect: 'none' }

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
        <input className="input-field pl-9" placeholder="Search by name, email, phone, area…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#fef5f3', borderBottom: '1.5px solid #e8d5d2' }}>
                <th className="text-left px-4 py-3 font-semibold" style={thStyle} onClick={() => handleSort('name')}>
                  <span className="flex items-center gap-1">Client <SortIcon field="name" sortBy={sortBy} sortDir={sortDir} /></span>
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#60665a' }}>Contact</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#60665a' }}>Location</th>
                <th className="text-left px-4 py-3 font-semibold" style={thStyle} onClick={() => handleSort('bookings')}>
                  <span className="flex items-center gap-1">Bookings <SortIcon field="bookings" sortBy={sortBy} sortDir={sortDir} /></span>
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={thStyle} onClick={() => handleSort('totalSpent')}>
                  <span className="flex items-center gap-1">Total Spent <SortIcon field="totalSpent" sortBy={sortBy} sortDir={sortDir} /></span>
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={thStyle} onClick={() => handleSort('lastBooking')}>
                  <span className="flex items-center gap-1">Last Booking <SortIcon field="lastBooking" sortBy={sortBy} sortDir={sortDir} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
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
                        <a href={`mailto:${c.email}`} className="hover:underline truncate max-w-[160px]" title={c.email}>
                          {c.email}
                        </a>
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
                      {[c.area, c.county].filter(Boolean).join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                      {c.bookings}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#60665a' }}>
                    {(c.totalSpent || 0).toLocaleString('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 })}
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
          {paginated.length === 0 && (
            <div className="text-center py-12" style={{ color: '#96aca0' }}>
              <p className="font-medium">No clients found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm" style={{ color: '#96aca0' }}>
          <span>Page {page} of {totalPages} · {sorted.length} clients</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-xs"
              style={{ borderColor: '#e8d5d2', color: page === 1 ? '#ccc' : '#60665a', background: 'white', cursor: page === 1 ? 'default' : 'pointer' }}>
              ← Prev
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border text-xs"
              style={{ borderColor: '#e8d5d2', color: page === totalPages ? '#ccc' : '#60665a', background: 'white', cursor: page === totalPages ? 'default' : 'pointer' }}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
