export default function StatsCard({ label, value, icon, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: '#60665a' }}>{value}</p>
      <p className="text-sm" style={{ color: '#96aca0' }}>{label}</p>
    </div>
  )
}
