import { useState } from 'react'

export default function StatsCard({ label, value, icon, color, tooltip, onClick }) {
  const [showTip, setShowTip] = useState(false)
  const displayValue = value === null || value === undefined ? '—' : value

  return (
    <div
      className="card p-5 relative"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)' }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.boxShadow = '' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
        {tooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              style={{ background: 'none', border: 'none', cursor: 'default', color: '#b8b0ae', padding: 0, fontSize: 13 }}
              aria-label="More info">
              ?
            </button>
            {showTip && (
              <div className="absolute right-0 top-6 z-10 px-3 py-2 rounded-lg text-xs w-40 shadow-lg"
                style={{ backgroundColor: '#60665a', color: 'white', whiteSpace: 'normal' }}>
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: '#60665a' }}>{displayValue}</p>
      <p className="text-sm" style={{ color: '#96aca0' }}>{label}</p>
    </div>
  )
}
