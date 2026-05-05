import { useState } from 'react'

const navigationItems = [
  { label: 'Dashboard', icon: '\u{1F4CA}', active: true },
  { label: 'Report Waste', icon: '\u{1F5D1}\uFE0F' },
  { label: 'Predictions', icon: '\u{1F4C8}' },
  { label: 'Data Insights', icon: '\u{1F9E0}' },
  { label: 'Network Hubs', icon: '\u{1F310}' },
  { label: 'System Settings', icon: '\u2699\uFE0F', alignRight: true },
]

function NavItem({ item }) {
  const [isHovered, setIsHovered] = useState(false)

  const itemStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '999px',
    border: 'none',
    background: item.active ? '#0f766e' : isHovered ? '#eef6f2' : 'transparent',
    color: item.active ? '#ffffff' : '#334155',
    fontSize: '0.95rem',
    fontWeight: item.active ? 700 : 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
    boxShadow: item.active ? '0 10px 18px rgba(15, 118, 110, 0.2)' : 'none',
  }

  return (
    <button
      type="button"
      style={itemStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-current={item.active ? 'page' : undefined}
    >
      <span aria-hidden="true">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  )
}

function Navbar() {
  const navStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#ffffff',
    borderRadius: '60px',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    flexWrap: 'wrap',
  }

  const rightItemStyles = {
    marginLeft: 'auto',
  }

  return (
    <nav style={navStyles} aria-label="Main navigation">
      {navigationItems.map((item) => (
        <div key={item.label} style={item.alignRight ? rightItemStyles : undefined}>
          <NavItem item={item} />
        </div>
      ))}
    </nav>
  )
}

export default Navbar
