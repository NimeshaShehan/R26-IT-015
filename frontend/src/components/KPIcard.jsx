function KPIcard({ title, value, subtitle, tone = 'green' }) {
  const tones = {
    green: {
      border: '#c7eadf',
      accent: '#0f766e',
      soft: '#f0fbf7',
    },
    blue: {
      border: '#c7d7f2',
      accent: '#1d4ed8',
      soft: '#f2f7ff',
    },
    dark: {
      border: '#cbd5e1',
      accent: '#0f172a',
      soft: '#f8fafc',
    },
    amber: {
      border: '#f2ddaf',
      accent: '#b45309',
      soft: '#fffaf0',
    },
  }

  const palette = tones[tone] ?? tones.green

  const cardStyles = {
    background: palette.soft,
    border: `1px solid ${palette.border}`,
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
  }

  const labelStyles = {
    margin: '0 0 8px',
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: 600,
  }

  const valueStyles = {
    margin: 0,
    color: palette.accent,
    fontSize: '1.8rem',
    fontWeight: 800,
    lineHeight: 1.1,
  }

  const subtitleStyles = {
    margin: '8px 0 0',
    color: '#475569',
    fontSize: '0.9rem',
  }

  return (
    <article style={cardStyles}>
      <p style={labelStyles}>{title}</p>
      <p style={valueStyles}>{value}</p>
      <p style={subtitleStyles}>{subtitle}</p>
    </article>
  )
}

export default KPIcard
