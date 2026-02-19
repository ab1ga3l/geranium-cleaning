import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Calendar, Users, LogOut, Flower,
  CheckCircle, XCircle, Clock, TrendingUp, Search,
  ChevronDown, RefreshCw, Phone, Mail, MapPin, Sofa,
  DollarSign, Filter, X
} from 'lucide-react'
import BookingCard from '../components/admin/BookingCard'
import StatsCard from '../components/admin/StatsCard'
import ClientsTable from '../components/admin/ClientsTable'
import CalendarView from '../components/admin/CalendarView'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'clients', label: 'Clients', icon: Users },
]

const STATUS_FILTERS = ['all', 'pending', 'accepted', 'completed', 'declined']

function api(token) {
  return axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')
  const [tab, setTab] = useState('overview')
  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/admin'); return }
    loadData()
  }, [token])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const instance = api(token)
      const [bookingsRes, statsRes, clientsRes] = await Promise.allSettled([
        instance.get('/admin/bookings'),
        instance.get('/admin/stats'),
        instance.get('/admin/clients'),
      ])

      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.bookings)
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      if (clientsRes.status === 'fulfilled') setClients(clientsRes.value.data.clients)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token')
        navigate('/admin')
      }
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api(token).patch(`/admin/bookings/${bookingId}/status`, { status })
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, bookingStatus: status } : b))
      toast.success(`Booking ${status}`)
    } catch {
      toast.error('Failed to update booking')
    }
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
                style={{ backgroundColor: '#f9c8c2', color: '#c69491' }}>PW</div>
              <div>
                <p className="text-white text-xs font-semibold">Patience Wanja</p>
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
                  Good day, Patience! 🌸
                </h2>
                <p style={{ color: '#96aca0' }}>Here's your business overview.</p>
              </div>

              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard label="Total Bookings" value={stats.total} icon={<Calendar size={20} />} color="#c69491" />
                  <StatsCard label="Pending" value={stats.pending} icon={<Clock size={20} />} color="#f0a040" />
                  <StatsCard label="This Month" value={stats.thisMonth} icon={<TrendingUp size={20} />} color="#96aca0" />
                  <StatsCard label="Revenue (KSh)" value={`${parseFloat(stats.totalRevenue).toLocaleString()}`} icon={<DollarSign size={20} />} color="#60665a" />
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
                    <BookingCard key={b.id} booking={b} onStatusChange={updateBookingStatus} statusColor={statusColor} />
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
            <div className="space-y-5">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#96aca0' }} />
                  <input className="input-field pl-9" placeholder="Search by name, email, area…"
                    value={search} onChange={e => setSearch(e.target.value)} />
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

              <p className="text-sm" style={{ color: '#96aca0' }}>
                Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
              </p>

              <div className="space-y-3">
                {filteredBookings.map(b => (
                  <BookingCard key={b.id} booking={b} onStatusChange={updateBookingStatus} statusColor={statusColor} expanded />
                ))}
                {filteredBookings.length === 0 && (
                  <div className="text-center py-16 card" style={{ color: '#96aca0' }}>
                    <Calendar size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No bookings found</p>
                    <p className="text-sm mt-1">Try adjusting filters</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {tab === 'calendar' && (
            <CalendarView bookings={bookings} statusColor={statusColor} />
          )}

          {/* CLIENTS */}
          {tab === 'clients' && (
            <ClientsTable clients={clients} />
          )}
        </div>
      </div>
    </div>
  )
}
