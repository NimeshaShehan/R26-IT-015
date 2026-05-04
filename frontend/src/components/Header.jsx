import { useEffect, useState } from 'react'

function Header({ title }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const headerStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 24px',
    background: '#ffffff',
    border: '1px solid #d9e3ec',
    borderRadius: '18px',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
  }

  const titleStyles = {
    margin: 0,
    color: '#0f172a',
    fontSize: '1.4rem',
  }

  const timeStyles = {
    margin: 0,
    color: '#475569',
    fontSize: '0.95rem',
  }

  return (
    <header style={headerStyles}>
      <div>
        <p style={{ margin: '0 0 4px', color: '#0f766e', fontWeight: 700, letterSpacing: '0.05em' }}>
          E-Waste Management System
        </p>
        <h1 style={titleStyles}>{title}</h1>
      </div>

      <p style={timeStyles}>{now.toLocaleString()}</p>
    </header>
  )
}

export default Header
