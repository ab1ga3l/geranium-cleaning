import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#c69491', '#96aca0', '#f0a040', '#3d6b4a', '#7d9094', '#60665a', '#e57373', '#f9c8c2']

function parseLocalDate(dateStr) {
  if (!dateStr) return null
  try {
    const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number)
    return new Date(y, m - 1, d)
  } catch { return null }
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AnalyticsTab({ bookings, stats }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: '#96aca0' }}>
        <p className="font-medium">No booking data available yet</p>
        <p className="text-sm mt-1">Charts will appear once bookings come in</p>
      </div>
    )
  }

  // Revenue by month (last 6 months)
  const now = new Date()
  const revenueByMonth = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthBookings = bookings.filter(b => {
      const bd = new Date(b.createdAt)
      return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear()
    })
    const revenue = monthBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((s, b) => s + parseFloat(b.total || 0), 0)
    revenueByMonth.push({
      month: MONTHS_SHORT[d.getMonth()],
      revenue: Math.round(revenue),
      bookings: monthBookings.length,
    })
  }

  // Bookings by area
  const areaCounts = {}
  bookings.forEach(b => {
    if (b.area) areaCounts[b.area] = (areaCounts[b.area] || 0) + 1
  })
  const byArea = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  // Bookings by seat type
  const seatTypeCounts = {}
  bookings.forEach(b => {
    if (b.seatType) seatTypeCounts[b.seatType] = (seatTypeCounts[b.seatType] || 0) + 1
  })
  const bySeatType = Object.entries(seatTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  // Busiest days of week
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dowCounts = [0, 0, 0, 0, 0, 0, 0]
  bookings.forEach(b => {
    const d = parseLocalDate(b.date)
    if (d) dowCounts[d.getDay()]++
  })
  const byDow = DOW.map((day, i) => ({ day, bookings: dowCounts[i] }))

  const cardStyle = { borderRadius: 16, padding: '24px', backgroundColor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#60665a' }}>Analytics</h2>
        <p style={{ color: '#96aca0' }}>Business insights from your booking data</p>
      </div>

      {/* Summary row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Completed Jobs', value: stats.completed || 0 },
            { label: 'Accepted Jobs', value: stats.accepted || 0 },
            { label: 'Total Seats Cleaned', value: (stats.totalSeats || 0).toLocaleString('en-KE') },
            { label: 'Month Revenue (KSh)', value: parseFloat(stats.monthRevenue || 0).toLocaleString('en-KE') },
          ].map(s => (
            <div key={s.label} style={cardStyle}>
              <p className="text-xl font-bold" style={{ color: '#60665a' }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: '#96aca0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Revenue by month */}
      <div style={cardStyle}>
        <h3 className="font-bold mb-4" style={{ color: '#60665a' }}>Revenue & Bookings — Last 6 Months</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueByMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#96aca0' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#96aca0' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#c69491' }} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #f0e8e6', fontSize: 12 }}
              formatter={(val, name) => name === 'revenue' ? [`KSh ${val.toLocaleString('en-KE')}`, 'Revenue'] : [val, 'Bookings']}
            />
            <Bar yAxisId="left" dataKey="revenue" fill="#c69491" radius={[6, 6, 0, 0]} name="revenue" />
            <Bar yAxisId="right" dataKey="bookings" fill="#96aca0" radius={[6, 6, 0, 0]} name="bookings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by area */}
        {byArea.length > 0 && (
          <div style={cardStyle}>
            <h3 className="font-bold mb-4" style={{ color: '#60665a' }}>Bookings by Area</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byArea} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#96aca0' }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#60665a' }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f0e8e6', fontSize: 12 }} />
                <Bar dataKey="value" name="Bookings" radius={[0, 6, 6, 0]}>
                  {byArea.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bookings by seat type */}
        {bySeatType.length > 0 && (
          <div style={cardStyle}>
            <h3 className="font-bold mb-4" style={{ color: '#60665a' }}>Bookings by Seat Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bySeatType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {bySeatType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f0e8e6', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Busiest days of week */}
      <div style={cardStyle}>
        <h3 className="font-bold mb-4" style={{ color: '#60665a' }}>Busiest Days of the Week</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={byDow} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#96aca0' }} />
            <YAxis tick={{ fontSize: 11, fill: '#96aca0' }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f0e8e6', fontSize: 12 }} />
            <Bar dataKey="bookings" name="Bookings" radius={[6, 6, 0, 0]}>
              {byDow.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
