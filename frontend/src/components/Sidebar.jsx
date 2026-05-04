function Sidebar() {
  const sidebarStyles = {
    width: '260px',
    flex: '0 0 260px',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #10263f 0%, #0b1624 100%)',
    color: '#f8fafc',
    padding: '24px',
    boxSizing: 'border-box',
  }

  const logoStyles = {
    margin: '0 0 24px',
    fontSize: '1.35rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
  }

  const menuStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '18px',
  }

  const itemStyles = {
    padding: '12px 14px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#dbeafe',
    fontWeight: 600,
  }

  const activeItemStyles = {
    ...itemStyles,
    background: 'rgba(16, 185, 129, 0.16)',
    color: '#d1fae5',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  }

  return (
    <aside style={sidebarStyles}>
      <div>
        <div style={logoStyles}>EcoTrack SL</div>
        <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>
          E-Waste management dashboard for reporting and forecasting.
        </p>
      </div>

      <nav style={menuStyles} aria-label="Sidebar navigation">
        <div style={activeItemStyles}>Dashboard</div>
        <div style={itemStyles}>Report Waste</div>
        <div style={itemStyles}>Predictions</div>
        <div style={itemStyles}>Data Insights</div>
      </nav>
    </aside>
  )
}

export default Sidebar
