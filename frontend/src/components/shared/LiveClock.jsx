import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export default function LiveClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  })
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#f0fdf4', border: '1px solid #bbf7d0',
      borderRadius: 10, padding: '8px 16px',
    }}>
      <Clock size={16} color="#16a34a" />
      <div>
        <p style={{ margin: 0, fontSize: 11, color: '#6b7280', lineHeight: 1 }}>{dateStr}</p>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#14532d', lineHeight: 1.4, fontFamily: 'monospace' }}>{timeStr}</p>
      </div>
    </div>
  )
}
