import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Calendar, Users, LogOut, Flower,
  CheckCircle, XCircle, Clock, TrendingUp, Search,
  ChevronDown, RefreshCw, Phone, Mail, MapPin, Sofa,
  DollarSign, Filter, X, BarChart2
} from 'lucide-react'
import BookingCard from '../components/admin/BookingCard'
import StatsCard from '../components/admin/StatsCard'
import ClientsTable from '../components/admin/ClientsTable'
import CalendarView from '../components/admin/CalendarView'
import AnalyticsTab from '../components/admin/AnalyticsTab'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
]

// Decode admin name from JWT payload
function getAdminName(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.name || payload.email?.split('@')[0] || 'Admin'
  } catch {
    return 'Admin'
  }
}

const STATUS_FILTERS = ['all', 'pending', 'accepted', 'completed', 'declined']

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function api(token) {
  return axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  })
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')
  const mounted = useRef(true)
  const [tab, setTab] = useState('overview')
  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(null) // { bookingId, status, name }
  const adminName = token ? getAdminName(token) : 'Admin'

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (!token) { navigate('/admin'); return }
    loadData()
  }, [token])

  const loadData = useCallback(async () => {
    if (!mounted.current) return
    setLoading(true)
    try {
      const instance = api(token)
      const [bookingsRes, statsRes, clientsRes] = await Promise.allSettled([
        instance.get('/admin/bookings'),
        instance.get('/admin/stats'),
        instance.get('/admin/clients'),
      ])

      if (!mounted.current) return
      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.bookings)
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      if (clientsRes.status === 'fulfilled') setClients(clientsRes.value.data.clients)

      // Handle 401 from any request
      const unauthorized = [bookingsRes, statsRes, clientsRes].find(
        r => r.status === 'rejected' && r.reason?.response?.status === 401
      )
      if (unauthorized) {
        localStorage.removeItem('admin_token')
        navigate('/admin')
        return
      }
    } catch (err) {
      if (!mounted.current) return
      toast.error('Failed to load data')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [token, navigate])

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api(token).patch(`/admin/bookings/${bookingId}/status`, { status })
      if (mounted.current) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, bookingStatus: status } : b))
        toast.success(`Booking ${status}`)
      }
    } catch {
      if (mounted.current) toast.error('Failed to update booking')
    }
  }

  const requestStatusChange = (bookingId, status, bookingName) => {
    setConfirmDialog({ bookingId, status, name: bookingName })
  }

  const confirmStatusChange = async () => {
    if (!confirmDialog) return
    const { bookingId, status } = confirmDialog
    setConfirmDialog(null)
    await updateBookingStatus(bookingId, status)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin')
  }

  const filteredBookings = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.bookingStatus === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q || b.name?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) || b.area?.toLowerCase().includes(q) ||
      b.phone?.includes(q)
    return matchStatus && matchSearch
  })

  const statusColor = (s) => ({
    pending: { bg: '#fef5f3', text: '#c69491', border: '#f9c8c2' },
    accepted: { bg: '#f0f4f2', text: '#60665a', border: '#96aca0' },
    completed: { bg: '#eef4f0', text: '#3d6b4a', border: '#96c4a0' },
    declined: { bg: '#fef2f2', text: '#e57373', border: '#fca5a5' },
  }[s] || { bg: '#f5f5f5', text: '#666', border: '#ddd' })

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#fdf8f6' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
        style={{ backgroundColor: '#60665a' }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: '#7d8c82' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f9c8c2' }}>
              <Flower size={16} style={{ color: '#c69491' }} />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Geranium</p>
              <p className="text-xs" style={{ color: '#96aca0' }}>Admin Panel</p>
            </div>
            <button className="ml-auto lg:hidden text-white" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setTab(id); setMobileMenuOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: tab === id ? '#f9c8c2' : 'transparent',
                  color: tab === id ? '#60665a' : '#b8c4c2',
                }}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t" style={{ borderColor: '#7d8c82' }}>
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{adminName}</p>
                <p className="text-xs" style={{ color: '#96aca0' }}>Administrator</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-white/10"
              style={{ color: '#b8c4c2', background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b px-4 sm:px-6 py-4 flex items-center justify-between"
          style={{ borderColor: '#e8d5d2' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg" style={{ color: '#60665a' }}
              onClick={() => setMobileMenuOpen(true)}>
              <Filter size={20} />
            </button>
            <h1 className="font-bold text-lg" style={{ color: '#60665a' }}>
              {TABS.find(t => t.id === tab)?.label}
            </h1>
          </div>
          <button onClick={loadData} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all"
            style={{ backgroundColor: '#f9c8c2', color: '#60665a', border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#60665a' }}>
                  Good day, {adminName}! 🌸
                </h2>
                <p style={{ color: '#96aca0' }}>Here's your business overview.</p>
              </div>

              {loading && !stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="card p-5 animate-pulse">
                      <div className="w-10 h-10 rounded-xl mb-3" style={{ backgroundColor: '#f0e8e6' }} />
                      <div className="h-7 w-16 rounded mb-2" style={{ backgroundColor: '#f0e8e6' }} />
                      <div className="h-4 w-24 rounded" style={{ backgroundColor: '#f0e8e6' }} />
                    </div>
                  ))}
                </div>
              ) : stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard label="Total Bookings" value={stats.total} icon={<Calendar size={20} />} color="#c69491"
                    tooltip="All bookings ever made" onClick={() => { setTab('bookings'); setStatusFilter('all') }} />
                  <StatsCard label="Pending" value={stats.pending} icon={<Clock size={20} />} color="#f0a040"
                    tooltip="Bookings awaiting your response" onClick={() => { setTab('bookings'); setStatusFilter('pending') }} />
                  <StatsCard label="This Month" value={stats.thisMonth} icon={<TrendingUp size={20} />} color="#96aca0"
                    tooltip="Bookings created this month" onClick={() => { setTab('bookings'); setStatusFilter('all') }} />
                  <StatsCard label="Revenue (KSh)" value={parseFloat(stats.totalRevenue || 0).toLocaleString('en-KE')} icon={<DollarSign size={20} />} color="#60665a"
                    tooltip="Total revenue from paid bookings" />
                </div>
              )}

              {/* Recent bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg" style={{ color: '#60665a' }}>Recent Bookings</h3>
                  <button onClick={() => setTab('bookings')} className="text-sm font-medium" style={{ color: '#c69491', background: 'none', border: 'none', cursor: 'pointer' }}>
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => (
                    <BookingCard key={b.id} booking={b} onStatusChange={requestStatusChange} statusColor={statusColor} />
                  ))}
                  {bookings.length === 0 && !loading && (
                    <div className="text-center py-12" style={{ color: '#96aca0' }}>
                      <Calendar size={40} className="mx-auto mb-3 opacity-40" />
                      <p>No bookings yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {tab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              filteredBookings={filteredBookings}
              onStatusChange={requestStatusChange}
              statusColor={statusColor}
              loading={loading}
            />
          )}

          {/* CALENDAR */}
          {tab === 'calendar' && (
            <CalendarView bookings={bookings} statusColor={statusColor} />
          )}

          {/* CLIENTS */}
          {tab === 'clients' && (
            <ClientsTable clients={clients} />
          )}

          {/* ANALYTICS */}
          {tab === 'analytics' && (
            <AnalyticsTab bookings={bookings} stats={stats} />
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-2" style={{ color: '#60665a' }}>Confirm Action</h3>
            <p className="text-sm mb-5" style={{ color: '#7d9094' }}>
              Mark <strong>{confirmDialog.name}</strong>'s booking as{' '}
              <strong style={{ textTransform: 'capitalize' }}>{confirmDialog.status}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
                style={{ color: '#60665a', borderColor: '#e8d5d2', background: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmStatusChange}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{
                  backgroundColor: confirmDialog.status === 'declined' ? '#e57373' : '#c69491',
                  border: 'none', cursor: 'pointer'
                }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Bookings Tab ──────────────────────────────────────────────────────────────
function BookingsTab({ bookings, statusFilter, setStatusFilter, searchInput, setSearchInput,
  filteredBookings, onStatusChange, statusColor, loading }) {
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const todayStr = new Date().toISOString().slice(0, 10)

  const toggleSelect = (id) => setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )
  const allSelected = filteredBookings.length > 0 && filteredBookings.every(b => selectedIds.includes(b.id))
  const toggleAll = () => setSelectedIds(allSelected ? [] : filteredBookings.map(b => b.id))

  const exportCSV = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Phone', 'Area', 'Address', 'Seat Type', 'Seat Count', 'Date', 'Time Slot', 'Status', 'Payment', 'Total (KSh)', 'Booked At'],
      ...filteredBookings.map(b => [
        b.id?.slice(-8).toUpperCase() || '',
        b.name || '', b.email || '', b.phone || '',
        b.area || '', b.address || '', b.seatType || '',
        b.seatCount || '', b.date || '', b.timeSlot || '',
        b.bookingStatus || '', b.paymentStatus || '',
        b.total || '', b.createdAt ? new Date(b.createdAt).toLocaleString('en-KE') : '',
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `geranium-bookings-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#96aca0' }} />
          <input className="input-field pl-9" placeholder="Search by name, email, phone, area…"
            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border"
              style={{
                backgroundColor: statusFilter === s ? '#c69491' : 'white',
                color: statusFilter === s ? 'white' : '#60665a',
                borderColor: statusFilter === s ? '#c69491' : '#e8d5d2',
                cursor: 'pointer',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm" style={{ color: '#96aca0' }}>
            Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => {
              setStatusFilter('all')
              setSearchInput(todayStr)
            }}
            className="text-xs px-3 py-1.5 rounded-full border font-medium"
            style={{ color: '#60665a', borderColor: '#e8d5d2', background: 'white', cursor: 'pointer' }}>
            Today
          </button>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium"
          style={{ backgroundColor: '#f0f4f2', color: '#60665a', border: 'none', cursor: 'pointer' }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl flex-wrap"
          style={{ backgroundColor: '#fef5f3', border: '1px solid #f9c8c2' }}>
          <span className="text-sm font-medium" style={{ color: '#60665a' }}>
            {selectedIds.length} selected
          </span>
          <button
            onClick={async () => {
              setBulkUpdating(true)
              await Promise.all(selectedIds.map(id => onStatusChange(id, 'accepted', '')))
              setSelectedIds([])
              setBulkUpdating(false)
            }}
            disabled={bulkUpdating}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ backgroundColor: '#f0f4f2', color: '#60665a', border: 'none', cursor: 'pointer' }}>
            Accept Selected
          </button>
          <button
            onClick={async () => {
              setBulkUpdating(true)
              await Promise.all(selectedIds.map(id => onStatusChange(id, 'declined', '')))
              setSelectedIds([])
              setBulkUpdating(false)
            }}
            disabled={bulkUpdating}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ backgroundColor: '#fef2f2', color: '#e57373', border: 'none', cursor: 'pointer' }}>
            Decline Selected
          </button>
          <button onClick={() => setSelectedIds([])}
            className="text-xs px-3 py-1.5 rounded-lg font-medium ml-auto"
            style={{ color: '#96aca0', background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      )}

      {/* Select all */}
      {filteredBookings.length > 0 && (
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#96aca0' }}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll}
            style={{ accentColor: '#c69491' }} />
          Select all
        </label>
      )}

      <div className="space-y-3">
        {filteredBookings.map(b => (
          <BookingCard key={b.id} booking={b} onStatusChange={onStatusChange} statusColor={statusColor} expanded
            selected={selectedIds.includes(b.id)} onSelect={() => toggleSelect(b.id)} />
        ))}
        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-16 card" style={{ color: '#96aca0' }}>
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No bookings found</p>
            <p className="text-sm mt-1">Try adjusting filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
